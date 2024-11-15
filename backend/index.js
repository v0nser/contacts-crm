const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://raghuvanshivaibhav01:tJk2iJYiPQIutjAp@cluster0.n2ftm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  company: String,
  jobTitle: String
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/contacts', [
  body('email').isEmail(),
  body('phoneNumber').isLength({ min: 10 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const updatedContact = req.body;

  // console.log('Received update request for ID:', id);
  // console.log('Update data:', updatedContact);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid contact ID' });
    }

    const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber', 'company', 'jobTitle'];
    const sanitizedUpdate = {};
    for (const key of allowedUpdates) {
      if (updatedContact[key] !== undefined) {
        sanitizedUpdate[key] = updatedContact[key];
      }
    }

    const contact = await Contact.findByIdAndUpdate(id, sanitizedUpdate, { new: true, runValidators: true });

    if (!contact) {
      return res.status(404).send({ message: 'Contact not found' });
    }

    res.status(200).send({ message: 'Contact updated successfully', contact });
  } catch (error) {
    console.error('Failed to update contact:', error);
    res.status(500).send({ message: 'Failed to update contact', error: error.message });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).send({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));