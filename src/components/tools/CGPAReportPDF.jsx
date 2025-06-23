import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts (you'll need to provide these font files)
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Open Sans',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
  },
  userInfo: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  infoValue: {
    flex: 1,
    color: '#111827',
  },
  semesterHeader: {
    backgroundColor: '#1E3A8A',
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  semesterContainer: {
    marginBottom: 25,
  },
  semesterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  semesterLabel: {
    color: '#4B5563',
  },
  semesterValue: {
    fontWeight: 'bold',
    color: '#111827',
  },
  resultsContainer: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 6,
  },
  resultLabel: {
    fontWeight: 'bold',
    color: '#1E3A8A',
    fontSize: 14,
  },
  resultValue: {
    fontWeight: 'bold',
    color: '#F97316',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  generatedDate: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 5,
  },
  watermark: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#E5E7EB',
    fontSize: 72,
    fontWeight: 'bold',
    opacity: 0.1,
    transform: 'rotate(-30deg)',
  },
});

const CGPAReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page} size="A4">
      {/* Watermark */}
      <Text style={styles.watermark}>CollegeSecracy</Text>
      
      <View style={styles.container}>
        {/* Header with logo and title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Replace with your actual logo */}
            <Image 
              style={styles.logo} 
              src="https://via.placeholder.com/40" 
            />
            <Text style={styles.companyName}>CollegeSecracy</Text>
          </View>
          <View>
            <Text style={styles.reportTitle}>Academic Performance Report</Text>
            <Text style={styles.subtitle}>Detailed CGPA Analysis</Text>
          </View>
        </View>
        
        {/* Generation date */}
        <Text style={styles.generatedDate}>
          Generated on: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
        
        {/* User information */}
        <View style={styles.userInfo}>
          <Text style={{ 
            fontWeight: 'bold', 
            color: '#1E3A8A', 
            marginBottom: 10,
            fontSize: 14
          }}>
            Student Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>{data.user.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{data.user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID:</Text>
            <Text style={styles.infoValue}>{data.user._id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{data.user.phone || 'Not provided'}</Text>
          </View>
        </View>
        
        {/* Semester performance */}
        <Text style={{ 
          fontWeight: 'bold', 
          color: '#1E3A8A', 
          marginBottom: 10,
          fontSize: 16
        }}>
          Semester-wise Performance
        </Text>
        
        {data.semesters.map((sem, index) => (
          <View key={index} style={styles.semesterContainer}>
            <Text style={styles.semesterHeader}>Semester {index + 1}</Text>
            <View style={styles.semesterRow}>
              <Text style={styles.semesterLabel}>SGPA</Text>
              <Text style={styles.semesterValue}>{sem.sgpa}</Text>
            </View>
            <View style={styles.semesterRow}>
              <Text style={styles.semesterLabel}>Credits Completed</Text>
              <Text style={styles.semesterValue}>{sem.credits}</Text>
            </View>
          </View>
        ))}
        
        {/* Final results */}
        <View style={styles.resultsContainer}>
          <Text style={{ 
            fontWeight: 'bold', 
            color: '#1E3A8A', 
            marginBottom: 15,
            fontSize: 16
          }}>
            Cumulative Results
          </Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Final CGPA:</Text>
            <Text style={styles.resultValue}>{data.cgpa}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Equivalent Percentage:</Text>
            <Text style={styles.resultValue}>{data.percentage}%</Text>
          </View>
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          CGPA Calculator powered by CollegeSecracy • collegesecracy@gmail.com • help@collegesecracy.com • +91 9876543210
        </Text>
      </View>
    </Page>
  </Document>
);

export default CGPAReportPDF;