import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

const ContactForm = ({ fetchContacts }) => {
  ContactForm.propTypes = {
    fetchContacts: PropTypes.func.isRequired,
  };

  const [contact, setContact] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', company: '', jobTitle: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://contacts-crm.onrender.com/contacts', contact);
      fetchContacts();
      setSnackbarOpen(true); 
      setContact({ firstName: '', lastName: '', email: '', phoneNumber: '', company: '', jobTitle: '' }); // Reset form
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <TextField fullWidth name="firstName" label="First Name" value={contact.firstName} onChange={handleChange} required />
          </Box>
          <Box>
            <TextField fullWidth name="lastName" label="Last Name" value={contact.lastName} onChange={handleChange} required />
          </Box>
          <Box>
            <TextField fullWidth name="email" label="Email" value={contact.email} onChange={handleChange} required />
          </Box>
          <Box>
            <TextField fullWidth name="phoneNumber" label="Phone Number" value={contact.phoneNumber} onChange={handleChange} required />
          </Box>
          <Box>
            <TextField fullWidth name="company" label="Company" value={contact.company} onChange={handleChange} required />
          </Box>
          <Box>
            <TextField fullWidth name="jobTitle" label="Job Title" value={contact.jobTitle} onChange={handleChange} required />
          </Box>
          <Box>
            <Button type="submit" variant="contained">Add Contact</Button>
          </Box>
        </Box>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Contact added successfully!"
      />
    </>
  );
};

export default ContactForm;
