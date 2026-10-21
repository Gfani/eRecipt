import React from 'react';
import { Plus, Trash2, PackageSearch } from 'lucide-react';
import type { CartItem, SupplyType, UomType, VatCategory } from '../types';
import { netLineAmount, lineExcise, formatMoney, SAMPLE_PRODUCTS } from '../types';
import styles from './TaxLineItemsTable.module.css';

interface TaxLineItemsTableProps {
  items: CartItem[];
  onUpdateItem: (id: number, patch: Partial<CartItem>) => void;
  onAddItem: () => void;
  onAddPresetProduct: (product: (typeof SAMPLE_PRODUCTS)[0]) => void;
  onRemoveItem: (id: number) => void;
}

export const TaxLineItemsTable: React.FC<TaxLineItemsTableProps> = ({
  items,
  onUpdateItem,
  onAddItem,
  onAddPresetProduct,
  onRemoveItem,
}) => {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Tax line items</h2>
          <p className={styles.copy}>
            Excise is calculated on the net line amount; standard VAT is then calculated on net amount plus excise.
          </p>
        </div>

        <div className={styles.headerActions}>
          <select
            className={styles.presetSelect}
            defaultValue=""
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const found = SAMPLE_PRODUCTS.find((p) => p.id === selectedId);
              if (found) {
                onAddPresetProduct(found);
                e.target.value = '';
              }
            }}
            aria-label="Quick-add catalog product"
          >
            <option value="" disabled>
              ⚡ Quick-add catalog product...
            </option>
            {SAMPLE_PRODUCTS.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.code} · {prod.name} (ETB {prod.price})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onAddItem}
            className={styles.addBtn}
          >
            <Plus size={16} />
            <span>Add line</span>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <PackageSearch size={36} className={styles.emptyStateIcon} />
            <p style={{ margin: 0, fontWeight: 600 }}>No items added yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Click &quot;Add line&quot; or choose a catalog product above to begin.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ minWidth: 240 }}>Code &amp; description</th>
                <th style={{ width: 110 }}>Supply</th>
                <th style={{ width: 90 }}>Qty</th>
                <th style={{ width: 95 }}>UoM</th>
                <th style={{ width: 120 }}>Unit price (ETB)</th>
                <th style={{ width: 110 }}>Discount (ETB)</th>
                <th style={{ width: 170 }}>VAT category</th>
                <th style={{ width: 110 }}>Excise rate</th>
                <th style={{ width: 140, textAlign: 'right' }}>Net + excise (ETB)</th>
                <th style={{ width: 50 }} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const netAmount = netLineAmount(item);
                const excise = lineExcise(item);
                const totalLineWithExcise = netAmount + excise;

                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.codeDescCell}>
                        <input
                          required
                          value={item.code}
                          onChange={(e) => onUpdateItem(item.id, { code: e.target.value })}
                          className={`${styles.inputField} ${styles.codeField}`}
                          placeholder="Item code (e.g. GR-101)"
                        />
                        <input
                          required
                          value={item.name}
                          onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                          className={styles.inputField}
                          placeholder="Item name / supply description"
                        />
                      </div>
                    </td>

                    <td>
                      <select
                        value={item.supplyType}
                        onChange={(e) =>
                          onUpdateItem(item.id, { supplyType: e.target.value as SupplyType })
                        }
                        className={styles.selectField}
                      >
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={item.qty === 0 ? '' : item.qty}
                        onChange={(e) =>
                          onUpdateItem(item.id, { qty: Math.max(0, parseFloat(e.target.value) || 0) })
                        }
                        className={`${styles.inputField} ${styles.numField}`}
                      />
                    </td>

                    <td>
                      <select
                        value={item.uom}
                        onChange={(e) => onUpdateItem(item.id, { uom: e.target.value as UomType })}
                        className={styles.selectField}
                      >
                        <option value="PCS">PCS</option>
                        <option value="KG">KG</option>
                        <option value="LTR">LTR</option>
                        <option value="HRS">HRS</option>
                        <option value="BOX">BOX</option>
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.price === 0 ? '' : item.price}
                        onChange={(e) =>
                          onUpdateItem(item.id, { price: Math.max(0, parseFloat(e.target.value) || 0) })
                        }
                        className={`${styles.inputField} ${styles.numField}`}
                        placeholder="0.00"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount === 0 ? '' : item.discount}
                        onChange={(e) =>
                          onUpdateItem(item.id, { discount: Math.max(0, parseFloat(e.target.value) || 0) })
                        }
                        className={`${styles.inputField} ${styles.numField}`}
                        placeholder="0.00"
                      />
                    </td>

                    <td>
                      <select
                        value={item.vatCategory}
                        onChange={(e) =>
                          onUpdateItem(item.id, { vatCategory: e.target.value as VatCategory })
                        }
                        className={styles.selectField}
                        style={{ width: '100%' }}
                      >
                        <option value="Standard VAT (15%)">Standard VAT (15%)</option>
                        <option value="Zero-Rated (0%)">Zero-Rated (0%)</option>
                        <option value="VAT Exempt">VAT Exempt</option>
                      </select>
                    </td>

                    <td>
                      <select
                        value={item.exciseRate}
                        onChange={(e) =>
                          onUpdateItem(item.id, { exciseRate: Number(e.target.value) })
                        }
                        className={styles.selectField}
                      >
                        <option value={0}>None</option>
                        <option value={10}>10%</option>
                        <option value={20}>20%</option>
                        <option value={30}>30%</option>
                      </select>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <span className={styles.amountCell}>{formatMoney(totalLineWithExcise)}</span>
                      {excise > 0 && (
                        <span className={styles.exciseSubtext}>
                          Excise {formatMoney(excise)}
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name || 'item'}`}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={styles.tableFooterRow}>
                <td colSpan={2} className={styles.footerSummaryLabel}>
                  Total: {items.length} {items.length === 1 ? 'line item' : 'line items'}
                </td>
                <td className={styles.footerQtyCell}>
                  {items.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>
                  Combined Net + Excise:
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800 }} className={styles.amountCell}>
                  {formatMoney(
                    items.reduce(
                      (sum, item) => sum + netLineAmount(item) + lineExcise(item),
                      0
                    )
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </section>
  );
};

export default TaxLineItemsTable;
