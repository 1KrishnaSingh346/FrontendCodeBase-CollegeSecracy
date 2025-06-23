import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
  },
  smallFontPage: {
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    fontFamily: 'Helvetica',
    fontSize: 8, // Smaller font size for pages with more data
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 3,
  },
  smallSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 2,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  smallTable: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 6,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 22,
  },
  smallTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 18,
  },
  headerRow: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
  cell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 9,
    flex: 1,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  smallCell: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontSize: 7,
    flex: 1,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  cellHeader: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#111827',
  },
  smallCellHeader: {
    fontWeight: 'bold',
    fontSize: 8,
    color: '#111827',
  },
  cellNoBorder: {
    borderRightWidth: 0,
  },
  totalContainer: {
    marginTop: 8,
    textAlign: 'right',
  },
  totalText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  smallTotalText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 5,
  },
  smallFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statBox: {
    width: '32%',
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  smallStatBox: {
    width: '32%',
    padding: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  smallStatLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  smallStatValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6B7280',
  },
  smallPageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6B7280',
  },
});

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_SMALL_FONT = 15;

const PaymentPDFDocument = ({ payments = [], stats = {} }) => {
  const now = new Date().toLocaleDateString('en-IN');
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Format date in Indian format (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  // Format datetime in Indian format
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Split payments into chunks for pagination
  const chunkPayments = (payments, itemsPerPage) => {
    const chunks = [];
    for (let i = 0; i < payments.length; i += itemsPerPage) {
      chunks.push(payments.slice(i, i + itemsPerPage));
    }
    return chunks;
  };

  // Determine if we need small font based on data size
  const useSmallFont = payments.length > ITEMS_PER_PAGE * 3; // If more than 3 pages at normal size
  const itemsPerPage = useSmallFont ? ITEMS_PER_PAGE_SMALL_FONT : ITEMS_PER_PAGE;
  const paymentChunks = chunkPayments(payments, itemsPerPage);

  // Get styles based on font size preference
  const getStyles = (small) => {
    return small ? {
      pageStyle: styles.smallFontPage,
      sectionTitle: styles.smallSectionTitle,
      table: styles.smallTable,
      tableRow: styles.smallTableRow,
      cell: styles.smallCell,
      cellHeader: styles.smallCellHeader,
      totalText: styles.smallTotalText,
      footer: styles.smallFooter,
      statsContainer: styles.smallStatsContainer,
      statBox: styles.smallStatBox,
      statLabel: styles.smallStatLabel,
      statValue: styles.smallStatValue,
      pageNumber: styles.smallPageNumber,
    } : {
      pageStyle: styles.page,
      sectionTitle: styles.sectionTitle,
      table: styles.table,
      tableRow: styles.tableRow,
      cell: styles.cell,
      cellHeader: styles.cellHeader,
      totalText: styles.totalText,
      footer: styles.footer,
      statsContainer: styles.statsContainer,
      statBox: styles.statBox,
      statLabel: styles.statLabel,
      statValue: styles.statValue,
      pageNumber: styles.pageNumber,
    };
  };

  return (
    <Document>
      {paymentChunks.map((chunk, pageIndex) => {
        const currentStyles = getStyles(useSmallFont);
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === paymentChunks.length - 1;
        
        return (
          <Page key={pageIndex} size="A4" style={currentStyles.pageStyle} wrap>
            {/* Header - Only on first page */}
            {isFirstPage && (
              <View style={currentStyles.header} fixed>
                <Text style={styles.logoText}>CollegeSecracy</Text>
                <Text style={styles.title}>Monthly Payment & Revenue Report</Text>
                <Text style={styles.subtitle}>Powered by ACStudyCentre | Report Date: {now}</Text>
              </View>
            )}

            {/* Stats Overview - Only on first page */}
            {isFirstPage && Object.keys(stats).length > 0 && (
              <View style={currentStyles.statsContainer}>
                <View style={currentStyles.statBox}>
                  <Text style={currentStyles.statLabel}>Total Payments</Text>
                  <Text style={currentStyles.statValue}>{stats.totalPayments || payments.length}</Text>
                </View>
                <View style={currentStyles.statBox}>
                  <Text style={currentStyles.statLabel}>Successful</Text>
                  <Text style={currentStyles.statValue}>
                    {stats.successfulPayments || payments.filter(p => p.status === 'completed' || p.status === 'paid').length}
                  </Text>
                </View>
                <View style={currentStyles.statBox}>
                  <Text style={currentStyles.statLabel}>Total Revenue</Text>
                  <Text style={currentStyles.statValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            )}

            {/* Payment Summary */}
            <View style={styles.section}>
              <Text style={currentStyles.sectionTitle}>Payment Summary (Page {pageIndex + 1} of {paymentChunks.length})</Text>
              <View style={currentStyles.table}>
                {/* Table Header */}
                <View style={[currentStyles.tableRow, currentStyles.headerRow]}>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.5 }]}>S.No</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Full Name</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Email</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Plan Name</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.7 }]}>Amount</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.7 }]}>Status</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.8, borderRightWidth: 0 }]}>Date</Text>
                </View>

                {/* Table Rows */}
                {chunk.map((payment, index) => {
                  const globalIndex = pageIndex * itemsPerPage + index;
                  return (
                    <View key={globalIndex} style={currentStyles.tableRow}>
                      <Text style={[currentStyles.cell, { flex: 0.5 }]}>{globalIndex + 1}</Text>
                      <Text style={currentStyles.cell}>{payment.fullName || payment.userId?.fullName || 'N/A'}</Text>
                      <Text style={currentStyles.cell}>{payment.email || payment.userId?.email || 'N/A'}</Text>
                      <Text style={currentStyles.cell}>{payment.PlanName || payment.planName || payment.plan || 'Unknown'}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.7 }]}>₹{(payment.amount || 0).toLocaleString('en-IN')}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.7 }]}>{payment.status || 'N/A'}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.8, borderRightWidth: 0 }]}>
                        {formatDate(payment.createdAt)}
                      </Text>
                    </View>
                  );
                })}
              </View>
              
              {/* Show total on last page only */}
              {isLastPage && (
                <View style={currentStyles.totalContainer}>
                  <Text style={currentStyles.totalText}>Total Revenue: ₹{totalEarnings.toLocaleString('en-IN')}</Text>
                </View>
              )}
            </View>

            {/* Transaction Details */}
            <View style={styles.section}>
              <Text style={currentStyles.sectionTitle}>Transaction Details (Page {pageIndex + 1} of {paymentChunks.length})</Text>
              <View style={currentStyles.table}>
                {/* Table Header */}
                <View style={[currentStyles.tableRow, currentStyles.headerRow]}>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Email</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.8 }]}>Contact</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.8 }]}>Payment Method</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Payment ID</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Order ID</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader]}>Receipt</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.9 }]}>Bought At</Text>
                  <Text style={[currentStyles.cell, currentStyles.cellHeader, { flex: 0.7, borderRightWidth: 0 }]}>Valid Till</Text>
                </View>

                {/* Table Rows */}
                {chunk.map((payment, index) => {
                  const globalIndex = pageIndex * itemsPerPage + index;
                  return (
                    <View key={globalIndex} style={currentStyles.tableRow}>
                      <Text style={currentStyles.cell}>{payment.email || payment.userId?.email || 'N/A'}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.8 }]}>{payment.contact || 'N/A'}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.8 }]}>{payment.paymentMethod || 'N/A'}</Text>
                      <Text style={currentStyles.cell}>{payment.paymentId || 'N/A'}</Text>
                      <Text style={currentStyles.cell}>{payment.orderId || 'N/A'}</Text>
                      <Text style={currentStyles.cell}>{payment.receipt || 'N/A'}</Text>
                      <Text style={[currentStyles.cell, { flex: 0.9 }]}>
                        {formatDateTime(payment.boughtAt || payment.createdAt)}
                      </Text>
                      <Text style={[currentStyles.cell, { flex: 0.7, borderRightWidth: 0 }]}>
                        {formatDate(payment.validity)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Footer */}
            <View style={currentStyles.footer} fixed>
              <Text>CollegeSecracy © {new Date().getFullYear()} | All rights reserved</Text>
            </View>
            
            {/* Page number */}
            <Text style={currentStyles.pageNumber}>
              Page {pageIndex + 1} of {paymentChunks.length}
            </Text>
          </Page>
        );
      })}
    </Document>
  );
};

export default PaymentPDFDocument;