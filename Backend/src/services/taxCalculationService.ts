import type { CartItem, TransactionMode, TaxCalculationResult } from '../models/types.js';

export function netLineAmount(item: CartItem): number {
  return Math.max(0, item.price * item.qty - (item.discount || 0));
}

export function lineExcise(item: CartItem): number {
  return (netLineAmount(item) * (item.exciseRate || 0)) / 100;
}

export function lineVat(item: CartItem): number {
  if (item.vatCategory !== 'Standard VAT (15%)') return 0;
  return (netLineAmount(item) + lineExcise(item)) * 0.15;
}

export function calculateTaxes(
  items: CartItem[],
  transactionMode: TransactionMode,
  withholdingRequested: boolean,
  isDesignatedAgent: boolean
): TaxCalculationResult {
  const itemBreakdown = items.map((item) => {
    const net = netLineAmount(item);
    const excise = lineExcise(item);
    const vat = lineVat(item);
    return {
      id: item.id,
      code: item.code,
      name: item.name,
      netAmount: Math.round(net * 100) / 100,
      exciseAmount: Math.round(excise * 100) / 100,
      vatAmount: Math.round(vat * 100) / 100,
      lineTotal: Math.round((net + excise + vat) * 100) / 100,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + netLineAmount(item), 0);
  const exciseTax = items.reduce((sum, item) => sum + lineExcise(item), 0);
  const tax = items.reduce((sum, item) => sum + lineVat(item), 0);

  const goodsSubtotal = items
    .filter((item) => item.supplyType === 'Goods')
    .reduce((sum, item) => sum + netLineAmount(item), 0);

  const servicesSubtotal = items
    .filter((item) => item.supplyType === 'Services')
    .reduce((sum, item) => sum + netLineAmount(item), 0);

  // Ethiopian Statutory Withholding Rule:
  // Eligible ONLY if B2B AND (Goods > 10,000 ETB OR Services > 3,000 ETB)
  const withholdingEligible =
    transactionMode.startsWith('B2B') &&
    (goodsSubtotal > 10000 || servicesSubtotal > 3000);

  const withholdingTax =
    withholdingRequested && isDesignatedAgent && withholdingEligible ? subtotal * 0.02 : 0;

  const total = subtotal + exciseTax + tax - withholdingTax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    goodsSubtotal: Math.round(goodsSubtotal * 100) / 100,
    servicesSubtotal: Math.round(servicesSubtotal * 100) / 100,
    exciseTax: Math.round(exciseTax * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    withholdingEligible,
    withholdingTax: Math.round(withholdingTax * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemBreakdown,
  };
}
