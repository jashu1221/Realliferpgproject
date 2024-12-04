import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TopSectionsProvider } from './contexts/TopSectionsContext';
import { FocusModeProvider } from './contexts/FocusModeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Home } from './pages/Home';
import { Motivation } from './pages/Motivation';
import { PowerRanking } from './pages/PowerRanking';
import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <AuthProvider>
      <TopSectionsProvider>
        <FocusModeProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen bg-[#0A0B0E]">
                      <Sidebar />
                      <div className="flex-1 ml-[68px]">
                        <Home />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/motivation"
                element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen bg-[#0A0B0E]">
                      <Sidebar />
                      <div className="flex-1 ml-[68px]">
                        <Motivation />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/power-ranks"
                element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen bg-[#0A0B0E]">
                      <Sidebar />
                      <div className="flex-1 ml-[68px]">
                        <PowerRanking />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </FocusModeProvider>
      </TopSectionsProvider>
    </AuthProvider>
  );
}
