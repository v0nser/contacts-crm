# **Contact Management System**

---

## **Project Description**
The **Contact Management System** is a web application for managing a contact database. It allows users to perform CRUD (Create, Read, Update, Delete) operations on contact data, featuring a responsive UI built with **ReactJS** and **Material-UI (MUI)** and a backend powered by **Node.js** and **Express**.

---

## **Key Features**
- Add, view, update, and delete contacts with ease.
- Paginated and sortable contact table for better organization.
- Modern and responsive design using Material-UI.
- RESTful APIs for seamless backend communication.

---

## **Technical Overview**

### **Frontend**
- Built with **ReactJS** and **Material-UI**.
- **React Router** for client-side routing.
- State management with `useState` and `useEffect`.

### **Backend**
- Developed with **Node.js** and **Express**.
- API Endpoints for CRUD operations.
- Error handling for robust performance.

### **Database**
- **MongoDB** used for storing contact data.
- Schema-free structure allows flexibility.

---

## **Major Technical Decisions**
1. **Lightweight Stack**: Using ReactJS and Node.js ensures fast development and performance.
2. **Material-UI**: Consistent and customizable UI components.
3. **REST API**: Simplicity and compatibility with future integrations.
4. **Local State**: Chosen over Redux for this project’s scope.

---

## **Setup Instructions**

### **Prerequisites**
- **Node.js** (v16 or above)
- **MongoDB** (Local installation or Atlas)
- **npm** (Node Package Manager)

### **Installation**
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install

### **Application Structure**

**Frontend**
- Contact Form: For adding and editing contacts.
- Contact Table: Displays a paginated, sortable list of contacts.
- Navigation Bar: Links for navigating between views.

**Backend**
- **API Endpoints**:
- GET /contacts: Fetch all contacts.
- POST /contacts: Add a new contact.
- PUT /contacts/:id: Update a contact by ID.
- DELETE /contacts/:id: Delete a contact by ID.

### Happy Coding!!! 🚀 

