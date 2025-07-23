import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ApproveItems from './pages/ApproveItems'
import AddItems from './pages/AddItems';
import ManageUsers from './pages/ManageUsers';
import PaymentHistory from './pages/PaymentHistory';
import ResolveDisputes from './pages/ResolveDisputes';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/approve-items" element={<ApproveItems />} />
          <Route path="/add-items" element={<AddItems />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/resolve-disputes" element={<ResolveDisputes />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;