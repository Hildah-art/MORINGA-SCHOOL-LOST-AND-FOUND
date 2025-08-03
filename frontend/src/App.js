import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import ApproveItems from "./pages/ApproveItems";
import AddItems from "./pages/AddItems";
import ManageUsers from "./pages/ManageUsers";
import PaymentHistory from "./pages/PaymentHistory";
import ResolveDisputes from "./pages/ResolveDisputes";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approve-items"
            element={
              <ProtectedRoute>
                <ApproveItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-items"
            element={
              <ProtectedRoute>
                <AddItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resolve-disputes"
            element={
              <ProtectedRoute>
                <ResolveDisputes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
