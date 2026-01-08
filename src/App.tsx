import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { DonorList } from './components/DonorList';
import { DonorProfile } from './components/DonorProfile';
import { DonorForm } from './components/DonorForm';
import { DonationForm } from './components/DonationForm';
import { CampaignPage } from './components/CampaignPage';
import { TasksView } from './components/TasksView';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route - redirect to /login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route - shown to unauthenticated users */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="donors" element={<DonorList />} />
            <Route path="donors/new" element={<DonorForm />} />
            <Route path="donors/:id" element={<DonorProfile />} />
            <Route path="donors/:id/edit" element={<DonorForm />} />
            <Route path="donations/new" element={<DonationForm />} />
            <Route path="campaigns/:id" element={<CampaignPage />} />
            <Route path="tasks" element={<TasksView />} />
          </Route>
          
          {/* Catch-all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
