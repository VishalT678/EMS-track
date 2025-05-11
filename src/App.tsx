import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Hospitals from './pages/Hospitals';
import Ambulances from './pages/Ambulances';
import Map from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import AmbulanceDetails from './pages/AmbulanceDetails';
import Patients from './pages/Patients';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Role-based Protected Route component
const RoleProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospitals"
            element={
              <RoleProtectedRoute roles={['admin', 'hospital']}>
                <Hospitals />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/ambulances"
            element={
              <RoleProtectedRoute roles={['admin', 'ambulance']}>
                <Ambulances />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ambulances/:id"
            element={
              <RoleProtectedRoute roles={['admin', 'ambulance']}>
                <AmbulanceDetails />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <RoleProtectedRoute roles={['admin', 'ambulance']}>
                <Patients />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <RoleProtectedRoute roles={['admin', 'hospital']}>
                <Staff />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <RoleProtectedRoute roles={['admin', 'hospital']}>
                <Reports />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <RoleProtectedRoute roles={['admin', 'hospital']}>
                <Settings />
              </RoleProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="ambulances" element={<Ambulances />} />
            <Route path="ambulances/:id" element={<AmbulanceDetails />} />
            <Route path="patients" element={<Patients />} />
            <Route path="hospitals" element={<Hospitals />} />
            <Route path="staff" element={<Staff />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
