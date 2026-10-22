import React, { useState, useRef, useEffect } from 'react';
import { Wifi, CheckCircle2, RotateCcw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import DocumentClassificationCard from './components/DocumentClassificationCard';
import BuyerDetailsCard from './components/BuyerDetailsCard';
import TaxLineItemsTable from './components/TaxLineItemsTable';
import PaymentWithholdingCard from './components/PaymentWithholdingCard';
import ClearanceSummaryCard from './components/ClearanceSummaryCard';
import IssuedReceiptModal from './components/IssuedReceiptModal';
import type {
  CartItem,
  BuyerInfo,
  DocumentType,
  TransactionMode,
  PaymentMethod,
  IssuedReceipt,
  SAMPLE_PRODUCTS,
} from './types';
import {
  INITIAL_ITEMS,
  MERCHANT_CODE,
  BRANCH_CODE,
  REGISTER_CODE,
  netLineAmount,
  lineExcise,
  lineVat,
} from './types';
import styles from './ReceiptIssuance.module.css';

interface ReceiptIssuanceProps {
  onNavigate?: (screen: string) => void;
}

const INITIAL_BUYER: BuyerInfo = {
  name: 'Hana Trading PLC',
  tin: '0012345678',
  vat: 'VAT-ET-0012345678',
  nationalId: '',
  contact: '+251 911 234 567',
  designatedAgent: false,
  withholdingReference: '',
};

let fallbackSequenceCounter = 194;

function generateFiscalClearanceData(date: Date) {
  fallbackSequenceCounter += 1;
  const seq = fallbackSequenceCounter;
  const year = date.getFullYear();
  const padSeq = String(seq).padStart(6, '0');
  const receiptNumber = `${MERCHANT_CODE}-${REGISTER_CODE}-${year}-${padSeq}`;
  const irn = `IRN-ET-${year}-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const rrn = `RRN-ET-${year}-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const sigHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  ).join('');
  const digitalSignature = `SHA256:${sigHex.slice(0, 16)}...EIMS`;
  const clearanceTimestamp = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' EAT';

  return {
    receiptNumber,
    issuedAt: date.toISOString(),
    fiscalYear: year,
    branchCode: BRANCH_CODE,
    registerCode: REGISTER_CODE,
    sequence: seq,
    irn,
    rrn,
    digitalSignature,
    clearanceTimestamp,
  };
}

export const ReceiptIssuanceContent: React.FC<ReceiptIssuanceProps> = ({
  onNavigate: _onNavigate,
}) => {
  const [documentType, setDocumentType] = useState<DocumentType>(
    'Electronic Tax Invoice (VAT Invoice)'
  );
  const [transactionMode, setTransactionMode] = useState<TransactionMode>(
    'B2B / Registered Buyer'
  );
  const [buyer, setBuyer] = useState<BuyerInfo>(INITIAL_BUYER);
  const [originalIrn, setOriginalIrn] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [tinVerified, setTinVerified] = useState(true);
  const [isVerifyingTin, setIsVerifyingTin] = useState(false);
  const [withholding, setWithholding] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedReceipt, setIssuedReceipt] = useState<IssuedReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Auto-save form draft to localStorage
  useEffect(() => {
    try {
      const draft = {
        documentType,
        transactionMode,
        buyer,
        originalIrn,
        adjustmentReason,
        tinVerified,
        withholding,
        paymentMethod,
        paymentReference,
        items,
      };
      window.localStorage.setItem('ereceipt:pos_draft', JSON.stringify(draft));
    } catch {
      // LocalStorage might be disabled or full
    }
  }, [
    documentType,
    transactionMode,
    buyer,
    originalIrn,
    adjustmentReason,
    tinVerified,
    withholding,
    paymentMethod,
    paymentReference,
    items,
  ]);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + netLineAmount(item), 0);
  const exciseTax = items.reduce((sum, item) => sum + lineExcise(item), 0);
  const tax = items.reduce((sum, item) => sum + lineVat(item), 0);

  const goodsSubtotal = items
    .filter((item) => item.supplyType === 'Goods')
    .reduce((sum, item) => sum + netLineAmount(item), 0);
  const servicesSubtotal = items
    .filter((item) => item.supplyType === 'Services')
    .reduce((sum, item) => sum + netLineAmount(item), 0);

  const withholdingEligible =
    transactionMode.startsWith('B2B') &&
    (goodsSubtotal > 10000 || servicesSubtotal > 3000);

  const withholdingTax =
    withholding && buyer.designatedAgent && withholdingEligible ? subtotal * 0.02 : 0;

  const total = subtotal + exciseTax + tax - withholdingTax;

  const highValueB2C = transactionMode.startsWith('B2C') && total >= 10000;
  const highValueBuyerValid =
    !highValueB2C ||
    (Boolean(buyer.name.trim()) &&
      (buyer.tin.length === 10 || Boolean(buyer.nationalId.trim())));

  const isAdjustment = documentType.startsWith('Credit') || documentType.startsWith('Debit');
  const requiresAdjustmentReason = !isAdjustment || Boolean(adjustmentReason.trim());
  const requiresOriginalIrn = !isAdjustment || Boolean(originalIrn.trim());
  const requiresPaymentRef =
    paymentMethod === 'Cash' || paymentMethod === 'Credit' || paymentMethod === 'Check'
      ? true
      : Boolean(paymentReference.trim());

  const canSubmit =
    items.length > 0 &&
    highValueBuyerValid &&
    requiresAdjustmentReason &&
    requiresOriginalIrn &&
    requiresPaymentRef;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyTin = () => {
    if (buyer.tin.length !== 10) return;
    setIsVerifyingTin(true);
    setTimeout(() => {
      setIsVerifyingTin(false);
      setTinVerified(true);
      showToast(`TIN ${buyer.tin} verified with Ministry of Revenues registry.`);
    }, 600);
  };

  const handleUpdateItem = (id: number, patch: Partial<CartItem>) => {
    setItems((curr) =>
      curr.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: CartItem = {
      id: Date.now(),
      code: `ITM-${items.length + 1}`,
      name: '',
      price: 0,
      qty: 1,
      uom: 'PCS',
      discount: 0,
      vatCategory: 'Standard VAT (15%)',
      exciseRate: 0,
      supplyType: 'Goods',
    };
    setItems((curr) => [...curr, newItem]);
  };

  const handleAddPresetProduct = (preset: (typeof SAMPLE_PRODUCTS)[0]) => {
    const newItem: CartItem = {
      id: Date.now(),
      code: preset.code,
      name: preset.name,
      price: preset.price,
      qty: 1,
      uom: preset.uom,
      discount: 0,
      vatCategory: preset.vatCategory,
      exciseRate: preset.exciseRate,
      supplyType: preset.supplyType,
    };
    setItems((curr) => [...curr, newItem]);
    showToast(`Added "${preset.name}" to line items.`);
  };

  const handleRemoveItem = (id: number) => {
    setItems((curr) => curr.filter((item) => item.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const clearanceData = generateFiscalClearanceData(new Date());

      const finalReceipt: IssuedReceipt = {
        documentType,
        transactionMode,
        customerName: buyer.name || 'Walk-in customer',
        customerTin: buyer.tin,
        customerVat: buyer.vat,
        customerNationalId: buyer.nationalId,
        customerPhone: buyer.contact,
        designatedWithholdingAgent: buyer.designatedAgent,
        withholdingReference: buyer.withholdingReference,
        originalIrn,
        adjustmentReason,
        items,
        subtotal,
        exciseTax,
        tax,
        withholdingTax,
        total,
        paymentMethod,
        paymentReference,
        ...clearanceData,
      };

      setIsSubmitting(false);
      setIssuedReceipt(finalReceipt);
      showToast('MoR EIMS Clearance confirmed (HTTP 200). Receipt issued.');
    }, 900);
  };

  const handleLoadB2BScenario = () => {
    setDocumentType('Electronic Tax Invoice (VAT Invoice)');
    setTransactionMode('B2B / Registered Buyer');
    setBuyer({
      name: 'Hana Trading PLC',
      tin: '0012345678',
      vat: 'VAT-ET-0012345678',
      nationalId: '',
      contact: '+251 911 234 567',
      designatedAgent: true,
      withholdingReference: 'WHT-2026-9812',
    });
    setTinVerified(true);
    setPaymentMethod('Bank Transfer — CBE');
    setPaymentReference('CBE-FT-884291');
    setItems([
      { id: 1, code: 'GR-104', name: 'Sidamo Coffee 500g', price: 680, qty: 15, uom: 'PCS', discount: 200, vatCategory: 'Standard VAT (15%)', exciseRate: 10, supplyType: 'Goods' },
      { id: 2, code: 'ST-042', name: 'Leather Notebook', price: 450, qty: 8, uom: 'PCS', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
    ]);
    setWithholding(true);
    showToast('Loaded B2B Wholesale Sample scenario.');
  };

  const handleLoadRetailScenario = () => {
    setDocumentType('Electronic Cash / Payment Receipt');
    setTransactionMode('B2C / Walk-in Customer');
    setBuyer({
      name: 'Walk-in Customer',
      tin: '',
      vat: '',
      nationalId: '',
      contact: '',
      designatedAgent: false,
      withholdingReference: '',
    });
    setTinVerified(false);
    setPaymentMethod('Cash');
    setPaymentReference('');
    setWithholding(false);
    setItems([
      { id: 1, code: 'HM-076', name: 'Coffee Cup Set', price: 780, qty: 1, uom: 'BOX', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
      { id: 2, code: 'ST-018', name: 'Blue Pen Pack (10pcs)', price: 180, qty: 2, uom: 'BOX', discount: 0, vatCategory: 'Standard VAT (15%)', exciseRate: 0, supplyType: 'Goods' },
    ]);
    showToast('Loaded Retail Walk-in Sample scenario.');
  };

  const handleReset = () => {
    try {
      window.localStorage.removeItem('ereceipt:pos_draft');
    } catch {
      // Ignore
    }
    setIssuedReceipt(null);
    setItems(INITIAL_ITEMS);
    setBuyer(INITIAL_BUYER);
    setOriginalIrn('');
    setAdjustmentReason('');
    setPaymentReference('');
    showToast('Form cleared and draft reset.');
  };

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>MoR EIMS real-time clearance</p>
          <h1 className={styles.title}>Issue a receipt</h1>
          <p className={styles.copy}>
            Capture the transaction, validate taxpayer data, and submit it to the Ministry of
            Revenues before issue.
          </p>
        </div>

        <div className={styles.headerActionsGroup}>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetBtn}
            title="Reset form to default values"
          >
            <RotateCcw size={14} />
            <span>Clear form</span>
          </button>

          <div className={styles.connectionBadge}>
            <Wifi size={14} />
            <span>EIMS connection ready</span>
          </div>
        </div>
      </div>

      <div className={styles.scenarioBar}>
        <span className={styles.scenarioLabel}>Quick test scenarios:</span>
        <button
          type="button"
          onClick={handleLoadB2BScenario}
          className={styles.scenarioBtn}
        >
          💼 B2B Wholesale Sample
        </button>
        <button
          type="button"
          onClick={handleLoadRetailScenario}
          className={styles.scenarioBtn}
        >
          🛒 Retail Walk-in Sample
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <DocumentClassificationCard
          documentType={documentType}
          transactionMode={transactionMode}
          originalIrn={originalIrn}
          adjustmentReason={adjustmentReason}
          onDocumentTypeChange={(type) => setDocumentType(type)}
          onTransactionModeChange={(mode) => {
            setTransactionMode(mode);
            if (mode.startsWith('B2C')) {
              setWithholding(false);
            }
          }}
          onOriginalIrnChange={setOriginalIrn}
          onAdjustmentReasonChange={setAdjustmentReason}
        />

        <BuyerDetailsCard
          buyer={buyer}
          transactionMode={transactionMode}
          highValueB2C={highValueB2C}
          tinVerified={tinVerified}
          isVerifyingTin={isVerifyingTin}
          onBuyerChange={(patch) => {
            setBuyer((b) => ({ ...b, ...patch }));
            if ('tin' in patch) setTinVerified(false);
          }}
          onVerifyTin={handleVerifyTin}
        />

        <TaxLineItemsTable
          items={items}
          onUpdateItem={handleUpdateItem}
          onAddItem={handleAddItem}
          onAddPresetProduct={handleAddPresetProduct}
          onRemoveItem={handleRemoveItem}
        />

        <div className={styles.bottomGrid}>
          <PaymentWithholdingCard
            paymentMethod={paymentMethod}
            paymentReference={paymentReference}
            withholding={withholding}
            withholdingEligible={withholdingEligible}
            isDesignatedAgent={buyer.designatedAgent}
            withholdingReference={buyer.withholdingReference}
            goodsSubtotal={goodsSubtotal}
            servicesSubtotal={servicesSubtotal}
            withholdingTax={withholdingTax}
            onPaymentMethodChange={setPaymentMethod}
            onPaymentReferenceChange={setPaymentReference}
            onWithholdingChange={setWithholding}
            onWithholdingReferenceChange={(val) =>
              setBuyer((b) => ({ ...b, withholdingReference: val }))
            }
          />

          <ClearanceSummaryCard
            subtotal={subtotal}
            exciseTax={exciseTax}
            tax={tax}
            withholdingTax={withholdingTax}
            total={total}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            validationMessage={
              !items.length
                ? 'Please add at least one line item.'
                : !highValueBuyerValid
                ? 'High-value sale requires buyer name and 10-digit TIN or Fayda FIN.'
                : isAdjustment && !adjustmentReason
                ? 'Credit/Debit notes require an adjustment reason code.'
                : undefined
            }
            onSubmit={handleSubmit}
          />
        </div>
      </form>

      {/* Issued Receipt Confirmation & Official Document Modal */}
      {issuedReceipt && (
        <IssuedReceiptModal
          receipt={issuedReceipt}
          onClose={() => setIssuedReceipt(null)}
          onReset={handleReset}
        />
      )}

      {/* Floating toast feedback */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <CheckCircle2 size={18} className={styles.toastIcon} />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export const ReceiptIssuance: React.FC<ReceiptIssuanceProps> = ({ onNavigate }) => {
  return (
    <DashboardLayout activeScreen="pos" onNavigate={onNavigate}>
      <ReceiptIssuanceContent onNavigate={onNavigate} />
    </DashboardLayout>
  );
};

export default ReceiptIssuance;

