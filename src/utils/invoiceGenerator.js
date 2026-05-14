/**
 * Generates a professional PDF invoice in a new window using the browser's print dialog.
 * No external PDF libraries required.
 */
export function downloadInvoice(bill, user) {
  if (!bill) return;

  const tenant = bill.tenant || user || {};
  const room = bill.room || {};
  const isPaid = bill.paymentStatus === 'PAID';
  const invoiceNo = `INV-${String(bill.id).padStart(5, '0')}`;
  const issueDate = bill.createdAt
    ? new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dueDate = bill.dueDate
    ? new Date(bill.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const periodStart = bill.billingPeriodStart || '—';
  const periodEnd = bill.billingPeriodEnd || '—';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      padding: 40px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .brand h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .brand .tagline {
      color: #94a3b8;
      font-size: 13px;
      margin-top: 4px;
    }
    
    .invoice-meta {
      text-align: right;
    }
    
    .invoice-meta h2 {
      font-size: 14px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 8px;
    }
    
    .invoice-meta .inv-number {
      font-size: 22px;
      font-weight: 700;
      color: white;
    }
    
    .status-badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-paid {
      background: #065f46;
      color: #6ee7b7;
    }
    
    .status-unpaid {
      background: #92400e;
      color: #fcd34d;
    }
    
    .body {
      padding: 40px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 40px;
    }
    
    .detail-section h3 {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    
    .detail-section p {
      font-size: 14px;
      color: #475569;
      line-height: 1.7;
    }
    
    .detail-section p strong {
      color: #1e293b;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    
    thead th {
      background: #f8fafc;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: left;
      border-bottom: 2px solid #e2e8f0;
    }
    
    thead th:last-child {
      text-align: right;
    }
    
    tbody td {
      padding: 16px;
      font-size: 14px;
      color: #334155;
      border-bottom: 1px solid #f1f5f9;
    }
    
    tbody td:last-child {
      text-align: right;
      font-weight: 600;
      color: #1e293b;
    }
    
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    
    .totals-box {
      width: 280px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #64748b;
    }
    
    .total-row.grand {
      border-top: 2px solid #1e293b;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }
    
    .footer {
      background: #f8fafc;
      padding: 24px 40px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer p {
      font-size: 12px;
      color: #94a3b8;
    }
    
    .footer .powered {
      font-size: 12px;
      color: #94a3b8;
    }
    
    .footer .powered strong {
      color: #0f9d78;
      font-weight: 600;
    }
    
    @media print {
      body { padding: 0; background: white; }
      .invoice { box-shadow: none; border-radius: 0; }
      .no-print { display: none !important; }
    }
    
    .print-btn {
      display: block;
      margin: 24px auto;
      padding: 12px 32px;
      background: #0f9d78;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    
    .print-btn:hover {
      background: #0d8a6a;
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="brand">
        <h1>⚡ SmartGrid</h1>
        <p class="tagline">Electricity Billing Invoice</p>
      </div>
      <div class="invoice-meta">
        <h2>Invoice</h2>
        <p class="inv-number">${invoiceNo}</p>
        <span class="status-badge ${isPaid ? 'status-paid' : 'status-unpaid'}">
          ${isPaid ? '✓ Paid' : '⏳ Unpaid'}
        </span>
      </div>
    </div>
    
    <div class="body">
      <div class="details-grid">
        <div class="detail-section">
          <h3>Billed To</h3>
          <p>
            <strong>${tenant.fullname || 'Tenant'}</strong><br>
            ${tenant.email || ''}<br>
            ${tenant.contactNo ? tenant.contactNo : ''}
          </p>
        </div>
        <div class="detail-section" style="text-align: right;">
          <h3>Invoice Details</h3>
          <p>
            <strong>Issue Date:</strong> ${issueDate}<br>
            <strong>Due Date:</strong> ${dueDate}<br>
            <strong>Room:</strong> ${room.roomNumber || '—'}
          </p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Period</th>
            <th>Units (kWh)</th>
            <th>Rate (₹/kWh)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Electricity Consumption — Room ${room.roomNumber || '—'}</td>
            <td>${periodStart} → ${periodEnd}</td>
            <td>${bill.unitsConsumed?.toFixed(2) || '0.00'}</td>
            <td>₹${bill.unitRate?.toFixed(2) || '0.00'}</td>
            <td>₹${bill.totalAmount?.toFixed(2) || '0.00'}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="totals">
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal</span>
            <span>₹${bill.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="total-row">
            <span>Tax</span>
            <span>₹0.00</span>
          </div>
          <div class="total-row grand">
            <span>Total</span>
            <span>₹${bill.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Payment processed via Cashfree Payment Gateway${bill.paymentOrderId ? ' · Order: ' + bill.paymentOrderId : ''}</p>
      <p class="powered">Powered by <strong>SmartGrid</strong></p>
    </div>
  </div>
  
  <button class="print-btn no-print" onclick="window.print()">
    📄 Download as PDF
  </button>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
