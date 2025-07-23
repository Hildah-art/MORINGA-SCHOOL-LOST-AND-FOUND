import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

import Dashboard from './pages/Dashboard';
import ApproveItems from './pages/ApproveItems';
import AddItems from './pages/AddItems';
import ManageUsers from './pages/ManageUsers';
import PaymentHistory from './pages/PaymentHistory';
import ResolveDisputes from './pages/ResolveDisputes';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';


function App() {
  return (
    <>
      <NavBar />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/approve-items" element={<ApproveItems />} />
          <Route path="/add-items" element={<AddItems />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/resolve-disputes" element={<ResolveDisputes />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/report-lost-item" element={<ReportLostItem />} />
          <Route path="/claim-verification" element={<ClaimVerification />} />
          <Route 
        
            path="/offer-reward"
            element={
              <OfferReward
                onSubmit={(reward) => console.log("Submitted reward:", reward)}
              />
            }
          />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/post-item" element={<PostItem />} />
          <Route path="/discover-items" element={<ItemDiscovery />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;