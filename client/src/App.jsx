import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
/* src/index.css */

/* הגדרת ברירת מחדל לכל האתר */
import { AuthProvider } from './context/authContext';

import LoginForm from './components/auth/Login/LoginForm';
import RegisterForm from './components/auth/register/RegisterForm';
import ProfileFields from './components/auth/ProfileFields/ProfileFields';

import './App.css';
import Logo from './components/UI/logo.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Home Feed Base */}
            <Route path="/" element={<Logo />} />

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