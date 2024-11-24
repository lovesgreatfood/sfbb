import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TemperatureLog } from './pages/TemperatureLog';
import { CleaningRecords } from './pages/CleaningRecords';
import { Suppliers } from './pages/Suppliers';
import { Documents } from './pages/Documents';
import { Staff } from './pages/Staff';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/temperature" element={<TemperatureLog />} />
                  <Route path="/cleaning" element={<CleaningRecords />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/staff" element={<Staff />} />
                </Route>
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}