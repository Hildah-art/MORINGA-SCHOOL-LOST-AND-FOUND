## Moringa Lost and Found Platform
A full-stack web application that allows users to report and discover lost or found items. Users must sign up or log in to interact with the system, enabling authenticated access to submit reports, view items, and manage their profiles.

## Features
User authentication (Signup / Login)

Report lost or found items (with image upload)

View discovered items

Secure form handling

RESTful API backend

Image upload support (e.g., profile pics, item images)

Persistent data storage (e.g., SQLite/PostgreSQL)

Clear separation of frontend and backend responsibilities

## Tech Stack
Frontend
React.js

React Router DOM

Axios

HTML/CSS

Backend
Flask (Python)

Flask-CORS

Flask-SQLAlchemy

Flask-Migrate

Werkzeug (for password hashing)

SQLite / PostgreSQL (depending on environment)

## Setup Instructions
## Backend Setup
Clone the repo
git clone 
cd lost-and-found-platform/backend
Create a virtual environment
pipenv install $ pipenv shell


flask db init
flask db migrate
flask db upgrade
Start the server
flask run
Server runs on: http://localhost:5000

## Frontend Setup
Navigate to frontend

cd ../frontend/lost-and-found
Install dependencies
npm install
Run development server
npm run dev
App will be available at: http://localhost:5173

## Project Structure
MORINGA-SCHOOL-LOST-AND-FOUND/
├── backend/
│   └── lost_and_found/
│       ├── __init__.py
│       ├── app.py                # Main Flask application entry point
│       ├── config.py             # Configuration (CORS, DB, secret keys)
│       ├── controllers/
│       │   └── __init__.py       # Controller logic for routes
│       ├── models.py             # SQLAlchemy models
│       ├── routes.py             # All route definitions
│       ├── utils.py              # Helper/utility functions
│       └── static/
│           └── uploads/          # Uploaded images for items
│               └── [...images]
│
└── frontend/
    └── lost-and-found/
        └── src/
            ├── App.jsx
            ├── App.css
            ├── main.jsx
            ├── index.css
            ├── Styles/
            │   └── index.css     # Custom styling
            ├── assets/
            │   ├── react.svg
            │   └── postingItem.webp
            ├── components/
            │   ├── NavBar.jsx
            │   ├── Layout.jsx
            │   ├── LoginForm.jsx
            │   ├── SignUp.jsx
            │   ├── ReportLostItem.jsx
            │   ├── PostItem.jsx
            │   ├── ItemDiscovery.jsx
            │   ├── LandingPage.jsx
            │   ├── PrivateRoute.jsx
            │   ├── Profile.jsx
            │   ├── sidebar.jsx
            │   ├── chatwindow.jsx
            │   ├── offerReward.jsx
            │   └── claimverification.jsx
            └── pages/
                ├── AddItems.jsx
                ├── ApproveItems.jsx
                ├── Dashboard.jsx
                ├── ManageUsers.jsx
                ├── Notifications.jsx
                ├── PaymentHistory.jsx
                ├── Reports.jsx
                └── ResolveDisputes.jsx





