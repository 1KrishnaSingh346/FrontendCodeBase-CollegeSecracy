import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportPaymentsToExcel(data = []) {
  try {
    if (!data || !data.length) {
      console.warn("No data available for Excel export");
      return;
    }

    // Format transaction details with all required fields
    const transactionDetails = data.map((p) => {
      const paymentDate = p.boughtAt || p.createdAt;
      const validityDate = p.validity;
      
      return {
        'S.No': data.indexOf(p) + 1,
        'Order ID': p.orderId || 'N/A',
        'Transaction ID': p.paymentId || p.transactionId || 'N/A',
        'Receipt ID': p.receipt || 'N/A',
        'Full Name': p.fullName || p.userId?.fullName || 'N/A',
        'Email': p.email || p.userId?.email || 'N/A',
        'Contact': p.contact || p.userId?.phone || 'N/A',
        'Plan Name': p.PlanName || p.planName || p.plan || 'Unknown',
        'Amount (₹)': p.amount ? Number(p.amount) : 0,
        'Currency': p.currency || 'INR',
        'Payment Method': p.paymentMethod || 'N/A',
        'Status': p.status || 'N/A',
        'Transaction Date': paymentDate ? new Date(paymentDate) : null,
        'Valid Till': validityDate ? new Date(validityDate) : 'Lifetime',
        'Is Bundle': p.isBundle ? 'Yes' : 'No',
        'Coupon Used': p.couponUsed || 'None',
        'Bank': p.bank || 'N/A',
        'Wallet': p.wallet || 'N/A'
      };
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add transaction details sheet with auto-filter
    const transactionSheet = XLSX.utils.json_to_sheet(transactionDetails);
    if (!transactionSheet['!ref']) {
      throw new Error("Failed to create transaction sheet");
    }
    transactionSheet['!autofilter'] = { ref: transactionSheet['!ref'] };
    
    // Set column widths (adjust as needed)
    transactionSheet['!cols'] = [
      { wch: 5 },   // S.No
      { wch: 20 },  // Order ID
      { wch: 20 },  // Transaction ID
      { wch: 15 },  // Receipt ID
      { wch: 20 },  // Full Name
      { wch: 25 },  // Email
      { wch: 15 },  // Contact
      { wch: 20 },  // Plan Name
      { wch: 12 },  // Amount
      { wch: 10 },  // Currency
      { wch: 15 },  // Payment Method
      { wch: 12 },  // Status
      { wch: 20 },  // Transaction Date
      { wch: 15 },  // Valid Till
      { wch: 10 },  // Is Bundle
      { wch: 15 },  // Coupon Used
      { wch: 15 },  // Bank
      { wch: 15 }   // Wallet
    ];

    XLSX.utils.book_append_sheet(wb, transactionSheet, "Transaction Details");

    // Format dates and currency
    const dateFormat = "dd-mm-yyyy hh:mm:ss";
    const currencyFormat = '"₹"#,##0.00';
    
    // Apply formatting
    const range = XLSX.utils.decode_range(transactionSheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const header = XLSX.utils.encode_col(C) + "1";
      const colName = transactionSheet[header]?.v;
      
      if (colName?.includes('Date') || colName === 'Valid Till') {
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = XLSX.utils.encode_cell({r:R, c:C});
          if (transactionSheet[cell]) {
            transactionSheet[cell].z = dateFormat;
          }
        }
      }
      
      if (colName === 'Amount (₹)') {
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = XLSX.utils.encode_cell({r:R, c:C});
          if (transactionSheet[cell]) {
            transactionSheet[cell].z = currencyFormat;
          }
        }
      }
    }

    // Generate filename
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `CollegeSecracy_Transactions_${dateStr}.xlsx`;

    // Export with proper MIME type
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellDates: true
    });
    
    saveAs(
      new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      filename
    );

  } catch (error) {
    console.error("Error exporting to Excel:", error);
    // Add user notification here if needed
  }
}