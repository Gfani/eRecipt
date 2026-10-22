import { Decimal } from "decimal.js";
import { config } from "../config/index.js";

export interface ReceiptItemInput {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CalculatedItem extends ReceiptItemInput {
  lineTotal: number;
}

export interface TaxCalculationResult {
  items: CalculatedItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

/**
 * Calculates subtotal, VAT (15%), and total using Decimal.js for precise financial math.
 */
export function calculateReceiptTaxes(
  items: ReceiptItemInput[],
  taxRate = config.taxRate
): TaxCalculationResult {
  let subtotalDecimal = new Decimal(0);

  const calculatedItems: CalculatedItem[] = items.map((item) => {
    const qty = new Decimal(item.quantity);
    const price = new Decimal(item.unitPrice);
    const lineTotal = qty.times(price).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    subtotalDecimal = subtotalDecimal.plus(lineTotal);

    return {
      name: item.name,
      quantity: item.quantity,
      unitPrice: price.toNumber(),
      lineTotal: lineTotal.toNumber(),
    };
  });

  const rateDecimal = new Decimal(taxRate);
  const taxDecimal = subtotalDecimal.times(rateDecimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const totalDecimal = subtotalDecimal.plus(taxDecimal).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    items: calculatedItems,
    subtotal: subtotalDecimal.toNumber(),
    taxRate,
    taxAmount: taxDecimal.toNumber(),
    totalAmount: totalDecimal.toNumber(),
  };
}
