import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-toastify';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Tab,
  Tabs,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  TablePagination
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  FileUpload as FileUploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const AdminCollegeData = () => {
  const { user, fetchCollegeData, deleteCollegeData, updateCollegeData, uploadCollegeData } = useAuthStore();
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('josaa');
  const [yearFilter, setYearFilter] = useState('');
  const [roundFilter, setRoundFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadYear, setUploadYear] = useState(new Date().getFullYear());
  const [uploadRound, setUploadRound] = useState('1');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const counsellingTypes = {
    josaa: 'JOSAA',
    csab: 'CSAB',
    uptac: 'UPTAC',
    others: 'OTHERS'
  };

  const roundOptions = ['1', '2', '3', '4', '5', '6', 'AR'];

  useEffect(() => {
    loadCollegeData();
  }, [activeTab]);

  const loadCollegeData = async () => {
    try {
      setLoading(true);
      const response = await fetchCollegeData();
      const data = response?.collegeData || [];
      setCollegeData(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
      setCollegeData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this data?')) return;
    
    try {
      await deleteCollegeData(id);
      toast.success('Data deleted successfully');
      loadCollegeData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('counsellingType', counsellingTypes[activeTab]);
      formData.append('year', uploadYear);
      formData.append('round', uploadRound);

      const validExtensions = ['.json', '.xlsx', '.xls'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(`.${fileExtension}`)) {
        throw new Error('Invalid file type. Please upload a JSON or Excel file.');
      }

      await uploadCollegeData(formData);
      toast.success('Data uploaded successfully');
      setOpenDialog(false);
      setFile(null);
      loadCollegeData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload data');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (data) => {
    setEditingId(data._id);
    setEditData(data);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await updateCollegeData(editingId, editData);
      toast.success('Data updated successfully');
      setEditingId(null);
      setEditData({});
      loadCollegeData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredData = Array.isArray(collegeData) 
    ? collegeData
        .filter(data => 
          data.counsellingType === counsellingTypes[activeTab] && 
          (yearFilter ? data.year.toString().includes(yearFilter) : true) &&
          (roundFilter ? data.round === roundFilter : true))
        .sort((a, b) => b.year - a.year || a.round.localeCompare(b.round))
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
        College Data Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            setPage(0);
          }}
          aria-label="counselling type tabs"
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label="JOSAA" value="josaa" />
          <Tab label="CSAB" value="csab" />
          <Tab label="UPTAC" value="uptac" />
          <Tab label="Others" value="others" />
        </Tabs>
      </Box>
      
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" mb={3} gap={2}>
        <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'} width={isMobile ? '100%' : 'auto'}>
          <TextField
            label="Filter by Year"
            variant="outlined"
            size="small"
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(0);
            }}
            fullWidth={isMobile}
          />
          <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 120 }}>
            <InputLabel>Round</InputLabel>
            <Select
              value={roundFilter}
              onChange={(e) => {
                setRoundFilter(e.target.value);
                setPage(0);
              }}
              label="Round"
              fullWidth={isMobile}
            >
              <MenuItem value="">All Rounds</MenuItem>
              {roundOptions.map(round => (
                <MenuItem key={round} value={round}>
                  {round === 'AR' ? 'Additional Round' : `Round ${round}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileUploadIcon />}
          onClick={() => setOpenDialog(true)}
          fullWidth={isMobile}
          sx={isMobile ? { mt: 1 } : {}}
        >
          Upload Data
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Round</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell>Entries</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                    </>
                  )}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  paginatedData.map((data) => (
                    <TableRow key={data._id}>
                      <TableCell>{data.year}</TableCell>
                      <TableCell>{data.round === 'AR' ? 'Addl Round' : `R${data.round}`}</TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>{data.data?.length || 0}</TableCell>
                          <TableCell>{new Date(data.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(data.updatedAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => startEdit(data)} size="small">
                            <EditIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(data._id)} size="small">
                            <DeleteIcon color="error" fontSize={isMobile ? 'small' : 'medium'} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 6} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      
      {editingId && (
        <Dialog 
          open={!!editingId} 
          onClose={cancelEdit} 
          maxWidth="md" 
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>Edit College Data</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Year: {editData.year}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Counselling Type: {editData.counsellingType}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Round: {editData.round === 'AR' ? 'Additional Round' : `Round ${editData.round}`}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Number of Entries: {editData.data?.length || 0}
            </Typography>
            <TextField
              label="Data (JSON)"
              variant="outlined"
              fullWidth
              multiline
              rows={isMobile ? 6 : 10}
              value={JSON.stringify(editData.data || [], null, 2)}
              onChange={(e) => {
                try {
                  const parsedData = JSON.parse(e.target.value);
                  setEditData({...editData, data: parsedData});
                } catch (error) {
                  toast.error('Invalid JSON format');
                }
              }}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelEdit} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              color="primary" 
              variant="contained" 
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      <Dialog 
        open={openDialog} 
        onClose={() => !uploading && setOpenDialog(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>Upload College Data</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Counselling Type</InputLabel>
            <Select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              label="Counselling Type"
            >
              <MenuItem value="josaa">JOSAA</MenuItem>
              <MenuItem value="csab">CSAB</MenuItem>
              <MenuItem value="uptac">UPTAC</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Year"
            type="number"
            fullWidth
            margin="normal"
            value={uploadYear}
            onChange={(e) => setUploadYear(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Round</InputLabel>
            <Select
              value={uploadRound}
              onChange={(e) => setUploadRound(e.target.value)}
              label="Round"
            >
              {roundOptions.map(round => (
                <MenuItem key={round} value={round}>
                  {round === 'AR' ? 'Additional Round' : `Round ${round}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<FileUploadIcon />}
            sx={{ mt: 2 }}
            disabled={uploading}
          >
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".json,.xlsx,.xls"
            />
          </Button>
          
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            color="primary" 
            variant="contained"
            disabled={!file || uploading}
            endIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCollegeData;