import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import AllJobs from './pages/AllJobs'; 
import MyApplications from './pages/MyApplications';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminJobs from './pages/AdminJobs';
import AdminRegister from './components/AdminRegister';
import PostJob from './pages/PostJob';










function App() {
  return (
    <Router>
      <Navbar /> {/* Optional: shows navbar on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Add this */}
         <Route path="/jobs" element={<AllJobs />} /> {/* ✅ route */}
         <Route path="/my-applications" element={<MyApplications />} />
           <Route path="/admin-login" element={<AdminLogin />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin-jobs" element={<AdminJobs />}/>
        
           
           <Route path="/admin-register" element={<AdminRegister />} />
             
           <Route path="/post-job" element={<PostJob />} />
          


           
      </Routes>
    </Router>
  );
}

export default App;
