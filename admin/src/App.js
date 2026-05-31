import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/layout/AdminLayout';
import './styles/admin.css';

// Pages
import AdminLogin from './pages/Login/AdminLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Chat from './pages/Chat/Chat';
import Partners from './pages/Partners/Partners';
import Pages from './pages/Pages/Pages';
import Tasks from './pages/Tasks/Tasks';
import Market from './pages/Market/Market';
import Tickets from './pages/Tickets/Tickets';
import Tournaments from './pages/Tournaments/Tournaments';
import Events from './pages/Events/Events';
import BonusBuy from './pages/BonusBuy/BonusBuy';
import BonusHunt from './pages/BonusHunt/BonusHunt';
import SpecialOdds from './pages/SpecialOdds/SpecialOdds';
import Stream from './pages/Stream/Stream';
import Wins from './pages/Wins/Wins';
import HeroSlides from './pages/HeroSlides/HeroSlides';
import PointCodes from './pages/PointCodes/PointCodes';
import SpinHistory from './pages/SpinHistory/SpinHistory';
import WheelConfig from './pages/WheelConfig/WheelConfig';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAdminAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff' }}>Yükleniyor...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="chat" element={<Chat />} />
          <Route path="partners" element={<Partners />} />
          <Route path="pages" element={<Pages />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="market" element={<Market />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="events" element={<Events />} />
          <Route path="bonus-buy" element={<BonusBuy />} />
          <Route path="bonus-hunt" element={<BonusHunt />} />
          <Route path="special-odds" element={<SpecialOdds />} />
          <Route path="stream" element={<Stream />} />
          <Route path="wins" element={<Wins />} />
          <Route path="hero-slides" element={<HeroSlides />} />
          <Route path="point-codes" element={<PointCodes />} />
          <Route path="spin-history" element={<SpinHistory />} />
          <Route path="wheel-config" element={<WheelConfig />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <AppRoutes />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
