import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactsTable from './components/ContactTables';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import axios from 'axios';

const App = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route 
          path="/" 
          element={<ContactForm fetchContacts={fetchContacts} />} 
        />
        <Route 
          path="/contactList" 
          element={<ContactsTable contacts={contacts} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
