import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const API_URL = 'https://contacts-crm.onrender.com';

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('lastName');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingContact, setEditingContact] = useState(null);
  const [tempContactData, setTempContactData] = useState({});

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`);
      if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
      }
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      showSnackbar('Failed to load contacts: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (contactId) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.statusText}`);
      }
      
      setContacts(prevContacts => 
        prevContacts.filter(contact => contact._id !== contactId)
      );
      showSnackbar('Contact deleted successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to delete contact: ' + err.message, 'error');
      console.error('Delete error:', err);
    }
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setTempContactData({ ... contact }); 
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTempContactData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const { _id, ...updatedData } = tempContactData;
  
      const response = await fetch(`${API_URL}/contacts/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        let errorMessage = `Failed to update contact: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = `Failed to update contact: ${errorData.message}`;
          }
        } catch {
          console.err(error);
        }
        throw new Error(errorMessage);
      }
  
      const updatedContact = await response.json();
  
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === _id ? { ...contact, ...updatedContact } : contact
        )
      );
  
      setEditingContact(null);
      setTempContactData({});
      showSnackbar('Contact updated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to update contact: ' + err.message, 'error');
      console.error('Update error:', err);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingContact(null);
    setTempContactData({});
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns = [
    { id: 'firstName', label: 'First Name', sortable: true },
    { id: 'lastName', label: 'Last Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phoneNumber', label: 'Phone Number', sortable: true },
    { id: 'company', label: 'Company', sortable: true },
    { id: 'jobTitle', label: 'Job Title', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
  ];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedContacts = React.useMemo(() => {
    return [...contacts].sort(getComparator(order, orderBy));
  }, [contacts, order, orderBy]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="contactsTable">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <TableRow key={contact._id} hover>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNumber}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.jobTitle}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(contact)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(contact._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {editingContact && (
        <Dialog open={Boolean(editingContact)} onClose={handleCancelEdit}>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="First Name"
              name="firstName"
              value={tempContactData.firstName || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="lastName"
              value={tempContactData.lastName || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={tempContactData.email || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Phone Number"
              name="phoneNumber"
              value={tempContactData.phoneNumber || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Company"
              name="company"
              value={tempContactData.company || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Job Title"
              name="jobTitle"
              value={tempContactData.jobTitle || ''}
              onChange={handleEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit} color="secondary">Cancel</Button>
            <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default ContactsTable;
