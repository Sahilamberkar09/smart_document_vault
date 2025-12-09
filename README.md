# Smart Document Vault

Smart Document Vault is a full-stack web application designed to securely store, manage, and organize your important documents. It leverages OCR (Optical Character Recognition) to automatically extract text from uploaded document images and categorizes them intelligently.

## 🚀 Features

* **Secure Storage**: Upload and store documents securely using Cloudinary.
* **Automatic OCR**: Extracts text from uploaded images using **Tesseract.js** to enable content-based search.
* **Smart Categorization**: Automatically categorizes documents based on extracted text. Optimized for:
    * **Indian IDs**: Aadhaar, PAN Card, Voter ID.
    * **General**: Passports, Invoices, Driving Licences, Insurance Policies, Receipts, Contracts, and Academic records.
* **Search & Filter**:
    * Full-text search on extracted OCR content, titles, and tags.
    * Filter documents by categories (e.g., Medical, Insurance, Academic).
* **User Dashboard**:
    * Visual statistics for total documents, recent uploads, and active categories.
    * Manage documents: Upload, View, Update, Delete, and Reprocess.
* **Authentication**: Secure user registration and login functionality.

## 🛠️ Tech Stack

### Frontend
* **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Icons**: [Lucide React](https://lucide.dev/)
* **HTTP Client**: Axios

### Backend
* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
* **OCR Engine**: [Tesseract.js](https://tesseract.projectnaptha.com/)
* **File Storage**: [Cloudinary](https://cloudinary.com/)
* **Authentication**: JSON Web Token (JWT) & bcryptjs

## 📂 Project Structure

```text
smart_document_vault/
├── backend/                # Express backend API
│   ├── src/
│   │   ├── config/         # DB and Cloudinary configuration
│   │   ├── controllers/    # Request handlers (Auth, Document)
│   │   ├── middlewares/    # Auth and Upload middlewares
│   │   ├── models/         # Mongoose models (User, Document)
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions (OCR, Categorization)
│   │   └── server.js       # Entry point
│   └── package.json
│
└── frontend/               # React frontend application
    ├── public/
    ├── src/
    │   ├── api/            # API connection setup
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React Context (Auth, Toast)
    │   ├── pages/          # Page views (Dashboard, Login, Register)
    │   └── utils/          # Utility functions
    └── package.json
```

⚙️ Installation & Setup
Prerequisites
Node.js (v16+ recommended)
MongoDB Instance (Local or Atlas)
Cloudinary Account
1. Backend Setup
Navigate to the backend directory:
Bash
```
cd backend
```
Install dependencies:
Bash
```
npm install
```
Create a .env file in the backend root and add the following variables:
Code snippet:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
1. Start the server:
Bash
```
npm run dev
```
2. Frontend Setup
Navigate to the frontend directory:
Bash
```
cd frontend
```
3. Install dependencies:
Bash
```
npm install
```
4. Start the development server:
Bash
```
npm run dev
```
🔌 API Endpoints
* **Authentication**
* POST /api/auth/register - Register a new user
* POST /api/auth/login - Login user
* **Documents**
* POST /api/document/upload - Upload a new document (Multipart/Form-Data)
* GET /api/document - Get all documents (supports query params: search, category)
* GET /api/document/:id - Get a specific document
* PUT /api/document/:id - Update document details
* DELETE /api/document/:id - Delete a document
* PATCH /api/document/:id/reprocess - Trigger OCR reprocessing

**📜 License**
* This project is licensed under the ISC License.
