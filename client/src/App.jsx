import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

import LoginForm from './components/auth/Login/LoginForm';
import RegisterForm from './components/auth/register/RegisterForm';
import ProfileFields from './components/auth/ProfileFields/ProfileFields';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Home Feed Base */}
            <Route path="/" element={
              <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Assistant' }}>
                <h2>BuildUp Home Feed (Under Construction)</h2>
                <p>Project cards and category filters will be rendered here.</p>
              </div>
            } />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* Step 2 Route */}
            <Route path="/register/info" element={<ProfileFields />} />

            {/* Edit Profile Route (Uses the exact same component!) */}
            <Route path="/profile/edit" element={<ProfileFields />} />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;