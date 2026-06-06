import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import MembershipPage from './pages/MembershipPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-menus" element={<Navigate to="/?tab=my-menus" />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/editor/:templateId" element={<Editor />} />
          <Route path="/preview/:menuId" element={<Preview />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
