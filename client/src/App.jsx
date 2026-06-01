import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
/* src/index.css */

/* הגדרת ברירת מחדל לכל האתר */
import { AuthProvider } from './context/AuthContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx';

import LoginForm from './components/auth/Login/LoginForm';
// import RegisterForm from './components/auth/Register/RegisterForm.jsx';
// import ProfileFields from './components/auth/ProfileFields/ProfileFields';

import Register from './components/auth/Register/Register.jsx';


import './App.css';
import Logo from './components/UI/logo.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <div className="App">
            <Routes>
              {/* Home Feed Base */}
              <Route path="/" element={<Logo />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginForm />} />

              {/* <Route path="/register" element={<RegisterForm />} />
              <Route path="/register/info" element={<ProfileFields />} /> */}
              <Route path="/register" element={<Register />} />

              {/* Edit Profile Route (Uses the exact same component!) */}
              <Route path="/profile/edit" element={<></>} />

              {/* Default Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;