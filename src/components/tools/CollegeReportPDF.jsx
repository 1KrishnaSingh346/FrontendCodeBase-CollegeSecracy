import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Create premium styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    marginLeft: 12,
    letterSpacing: 1,
  },

  subText: {
    fontSize: 8,
    color: '#64748b',
    top: 15,
    fontStyle: 'italic',
    fontWeight:'semibold',


  },

  reportTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginVertical: 25,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailsContainer: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#1e40af',
    width: '30%',
    fontSize: 12,
  },
  detailValue: {
    width: '70%',
    fontSize: 12,
    fontWeight: 'normal',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    letterSpacing: 0.5,
  },
  table: {
    width: "100%",
    marginTop: 15,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#1e40af',
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 8,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    minHeight: 30,
  },

  tableCol: {
    padding: 5,
    fontSize: 8,
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    textAlign: 'center', // Ensure text is centered
  },

 // Updated chance styles with better padding and alignment
 chanceHigh: {
  color: '#047857',
  fontWeight: 'bold',
  backgroundColor: '#d1fae5',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 8,
  textAlign: 'center',
  width: '100%', // Take full width of cell
  margin: 'auto', // Center in cell
},
chanceMedium: {
  color: '#92400e',
  fontWeight: 'bold',
  backgroundColor: '#fef3c7',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 8,
  textAlign: 'center',
  width: '100%',
  margin: 'auto',
},
chanceLow: {
  color: '#991b1b',
  fontWeight: 'bold',
  backgroundColor: '#fee2e2',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 8,
  textAlign: 'center',
  width: '100%',
  margin: 'auto',
},
  
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 10,
  },

  watermarkAbove: {
    position: 'absolute',
    opacity: 0.2,
    fontSize: 65,
    color: '#1e40af',
    top: '20%',   // above center
    left: '10%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontWeight: 'bold',
    letterSpacing: 5,
    zIndex: -1,
  },

  watermark: {
    position: 'absolute',
    opacity: 0.2,
    fontSize: 65,
    color: '#1e40af',
    top: '50%',   // center
    left: '10%',
    transform: 'translate(-50%, -50%) rotate(-45deg)', // center and tilt
    fontWeight: 'bold',
    letterSpacing: 5,
    zIndex: -1,
  },
  
  
  watermarkBelow: {
    position: 'absolute',
    opacity: 0.2,
    fontSize: 65,
    color: '#1e40af',
    top: '80%',   // below center
    left: '10%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontWeight: 'bold',
    letterSpacing: 5,
    zIndex: -1,
  },
  

 
  disclaimer: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 10,
    fontStyle: 'italic',
    lineHeight: 1.4,
    fontWeight: 'normal',
  },
  reportId: {
    position: 'absolute',
    top: 20,
    right: 40,
    fontSize: 9,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  premiumBadge: {
    backgroundColor: '#f59e0b',
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },

    // Updated college type tags with better visibility
    collegeTypeTag: {
      fontSize: 6,
      fontWeight: 'bold',
      paddingHorizontal: 8, // Increased padding
      paddingVertical: 4, // Increased padding
      borderRadius: 4,
      textAlign: 'center',
      width: '100%',
      margin: 'auto',
    },
    iitTag: {
      backgroundColor: '#1e40af',
      color: 'white',
    },
    nitTag: {
      backgroundColor: '#047857',
      color: 'white',
    },
    iiitTag: {
      backgroundColor: '#7c3aed',
      color: 'white',
    },
    otherTag: {
      backgroundColor: '#64748b',
      color: 'white',
      paddingHorizontal: 6, // Slightly less padding for "OTHER"
    },

  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 15,
  },
  footerLink: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  footerContact: {
    marginTop: 8,
    fontSize: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
  },
});

// Generate a random report ID
const generateReportId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CS-${result}`;
};

// Logo component with premium styling
const Logo = () => (
  <View style={styles.logoContainer}>
    <View style={{ 
      width: 42, 
      height: 42, 
      backgroundColor: '#1e40af', 
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>CS</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.logoText}>CollegeSecracy</Text>
      <Text style={styles.premiumBadge}>PREMIUM</Text>
    </View>
    <Text style={styles.subText}>Powered by ACStudyCentre</Text>
  </View>
);

const getCollegeType = (collegeName) => {
  if (!collegeName) return 'OTHER';
  
  const lowerName = collegeName.toLowerCase();
  
  // Check for IIIT first since it's a subset of IIT
  if (lowerName.includes('indian institute of information technology') || 
      lowerName.includes('iiit')) {
    return 'IIIT';
  }
  if (lowerName.includes('indian institute of technology') || 
      lowerName.includes('iit')) {
    return 'IIT';
  }
  if (lowerName.includes('national institute of technology') || 
      lowerName.includes('nit')) {
    return 'NIT';
  }
  return 'OTHER';
};

const CollegeReportPDF = ({ data }) => {
  if (!data || !data.colleges || data.colleges.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.watermarkAbove}>ACStudyCentre</Text>
          <Text style={styles.watermark}>ACStudyCentre</Text>
          <Text style={styles.watermarkBelow}>ACStudyCentre</Text>
          <Logo />
          <Text style={{ marginTop: 30, fontSize: 14, color: '#64748b' }}>
            No college data available for the selected criteria.
          </Text>
          <Text style={styles.disclaimer}>
            Try adjusting your rank or category filters for better results.
          </Text>
        </Page>
      </Document>
    );
  }

  const { rank, category, seatType, gender, quota, colleges, counsellingType, round } = data;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const reportId = generateReportId();

  const getChanceStyle = (chance) => {
    if (chance.includes("High")) return styles.chanceHigh;
    if (chance.includes("Medium")) return styles.chanceMedium;
    return styles.chanceLow;
  };

  const getCollegeTagStyle = (collegeName) => {
    const type = getCollegeType(collegeName);
    switch (type) {
      case 'IIT': return [styles.collegeTypeTag, styles.iitTag];
      case 'NIT': return [styles.collegeTypeTag, styles.nitTag];
      case 'IIIT': return [styles.collegeTypeTag, styles.iiitTag];
      default: return [styles.collegeTypeTag, styles.otherTag];
    }
  };

  // Calculate how many rows can fit on each page
  const calculateRowsPerPage = () => {
    const headerHeight = 200; // Approximate height of header content
    const rowHeight = 30; // Approximate height of each row
    const pageHeight = 700; // Approximate usable page height
    return Math.floor((pageHeight - headerHeight) / rowHeight);
  };

  const rowsPerPage = calculateRowsPerPage();
  const collegePages = [];
  for (let i = 0; i < colleges.length; i += rowsPerPage) {
    collegePages.push(colleges.slice(i, i + rowsPerPage));
  }

  return (
    <Document>
      {collegePages.map((collegesChunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} wrap={false}>
          {/* Watermark - Show on every page */}
          <Text style={styles.watermarkAbove}>ACStudyCentre</Text>
          <Text style={styles.watermark}>ACStudyCentre</Text>
          <Text style={styles.watermarkBelow}>ACStudyCentre</Text>
          

          {/* Report ID - Only on first page */}
          {pageIndex === 0 && (
            <Text style={styles.reportId}>Report ID: {reportId}</Text>
          )}

          {/* Header - Only on first page */}
          {pageIndex === 0 && (
            <>
              <View style={styles.header}>
                <Logo />
                <Text style={{ fontSize: 10, color: '#64748b' }}>
                  Generated on: {currentDate}
                </Text>
              </View>
              <Text style={styles.reportTitle}>Admission Probability Analysis</Text>
              <View style={[styles.detailsContainer, { borderLeftWidth: 4, borderLeftColor: '#1e40af' }]}>
                <Text style={[styles.sectionTitle, { color: '#1e40af', borderBottomColor: '#1e40af' }]}>
                  Candidate Profile
                </Text>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: '#1e3a8a' }]}>JEE Rank:</Text>
                  <Text style={[styles.detailValue, { fontWeight: 'bold', color: '#1e40af' }]}>
                    #{rank || 'Not provided'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={[
                    styles.detailValue, 
                    { 
                      backgroundColor: '#e0e7ff', 
                      padding: 3,
                      borderRadius: 4,
                      color: '#3730a3'
                    }
                  ]}>
                    {seatType || category || 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Gender:</Text>
                  <Text style={styles.detailValue}>
                    {gender || 'Gender-Neutral'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Seat Preference:</Text>
                  <Text style={[
                    styles.detailValue,
                    { 
                      color: quota === 'HS' ? '#065f46' : 
                            quota === 'AI' ? '#92400e' : '#1e40af'
                    }
                  ]}>
                    {quota || 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: '#7c3aed' }]}>Counselling Type:</Text>
                  <Text style={[
                    styles.detailValue, 
                    { 
                      fontWeight: 'bold',
                      color: counsellingType === 'UPTAC' ? '#1e40af' : '#7c3aed'
                    }
                  ]}>
                    {counsellingType || 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Round:</Text>
                  <Text style={[
                    styles.detailValue,
                    {
                      backgroundColor: '#f3f4f6',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 10,
                      fontWeight: 'bold',
                      color: '#1e40af'
                    }
                  ]}>
                    {round ? `Round ${round}` : 'Not specified'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Admission Chances:</Text>
                  <Text style={[
                    styles.detailValue,
                    { 
                      color: colleges.length > 10 ? '#065f46' :
                            colleges.length > 5 ? '#92400e' : '#991b1b',
                      fontWeight: 'bold'
                    }
                  ]}>
                    {colleges.length || 0} colleges matched
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>College Predictions</Text>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: "35%" }]}>
                  <Text>Institute</Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text>Program</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text>Open</Text>
                </View>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text>Close</Text>
                </View>
                <View style={[styles.tableCol, { width: "12%" }]}>
                  <Text>Chance</Text>
                </View>
                <View style={[styles.tableCol, { width: "8%" }]}>
                  <Text>Type</Text>
                </View>
              </View>
            </>
          )}

          {/* Table Rows */}
          <View style={styles.table}>
            {collegesChunk.map((college, index) => {
              const tagStyle = getCollegeTagStyle(college.name);
              const collegeType = getCollegeType(college.name);
              
              return (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: "35%" }]}>
                    <Text>{college.name}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "25%" }]}>
                    <Text>{college.branch}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text>{college.openingRank}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "10%" }]}>
                    <Text>{college.closingRank}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "12%" }]}>
                    <Text style={getChanceStyle(college.chance)}>
                      {college.chance}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, { width: "8%" }]}>
                    <Text style={tagStyle}>{collegeType}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Footer - Only on last page */}
          {pageIndex === collegePages.length - 1 && (
            <View style={styles.footer}>
              <Text style={styles.disclaimer}>
                *This report is generated based on historical data and predictive algorithms. Actual admission results may vary based on current year competition and seat availability.
              </Text>
              <View style={styles.footerLinks}>
                <Text style={styles.footerLink}>collegesecracy@gmail.com</Text>
                <Text style={styles.footerLink}>help@collegesecracy.com</Text>
              </View>
              <Text style={styles.footerContact}>
                For personalized counseling, contact our admission experts
              </Text>
              <Text style={{ marginTop: 5 }}>
                © {new Date().getFullYear()} CollegeSecracy Powered by ACStudyCentre | All Rights Reserved
              </Text>
            </View>
          )}

          {/* Page Number */}
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} fixed />
        </Page>
      ))}
    </Document>
  );
};

// Keep this for backward compatibility with email functionality
export const generatePDFBuffer = async (data) => {
  const { pdf } = await import('@react-pdf/renderer');
  const blob = await pdf(<CollegeReportPDF data={data} />).toBlob();
  return await blob.arrayBuffer();
};


export default CollegeReportPDF;