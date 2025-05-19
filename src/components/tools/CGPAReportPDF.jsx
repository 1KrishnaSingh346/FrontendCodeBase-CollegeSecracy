import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, color: '#F97316' },
  result: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 15
  },
  semester: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 12
  }
});

const CGPAReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>CGPA Calculation Report</Text>
      <Text>Generated on: {new Date().toLocaleDateString()}</Text>
      
      <View style={{ marginTop: 20 }}>
        {data.semesters.map((sem, index) => (
          <View key={index} style={styles.semester}>
            <Text>Semester {index + 1}:</Text>
            <Text>SGPA: {sem.sgpa} (Credits: {sem.credits})</Text>
          </View>
        ))}
      </View>
      
      <View style={{ marginTop: 20 }}>
        <View style={styles.result}>
          <Text style={{ fontWeight: 'bold' }}>Final CGPA:</Text>
          <Text style={{ fontWeight: 'bold' }}>{data.cgpa}</Text>
        </View>
        <View style={styles.result}>
          <Text style={{ fontWeight: 'bold' }}>Equivalent Percentage:</Text>
          <Text style={{ fontWeight: 'bold' }}>{data.percentage}%</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default CGPAReportPDF;