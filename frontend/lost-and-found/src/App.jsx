import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import Layout from './components/Layout';

import ChatWindow from './components/chatwindow';
import ClaimVerification from './components/claimverification';
import LoginForm from './components/LoginForm';
import OfferReward from './components/offerReward';
import ReportLostItem from './components/ReportLostItem';
import PostItem from './components/PostItem';
import ItemDiscovery from './components/ItemDiscovery';
import Signup from './components/SignUp';
import Profile from './components/Profile';

// Admin or dashboard pages
import Dashboard from './pages/Dashboard';
import ApproveItems from './pages/ApproveItems';
import AddItems from './pages/AddItems';
import ManageUsers from './pages/ManageUsers';
import PaymentHistory from './pages/PaymentHistory';
import ResolveDisputes from './pages/ResolveDisputes';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';

function App() {
  // Check login state (based on user or token in localStorage)
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <>
      <NavBar />
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginForm />} />

          <Route path="/report-lost-item" element={<ReportLostItem />} />
          <Route path="/claim/:id" element={<ClaimVerification />} />
          <Route path="/offer-reward" element={<OfferReward onSubmit={(reward) => console.log("Submitted reward:", reward)} />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/post-item" element={<PostItem />} />
          <Route path="/discover-items" element={<ItemDiscovery />} />

          {/* Protected route: Profile */}
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
          />

          {/* Admin or dashboard pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/approve-items" element={<ApproveItems />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/resolve-disputes" element={<ResolveDisputes />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
