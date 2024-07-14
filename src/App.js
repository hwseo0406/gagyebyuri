import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Analysis from './pages/Analysis';
import CustomerService from './pages/CustomerService';
import Excel from './pages/Excel';
import ExpenseList from './pages/ExpenseList';
import FeeManagement from './pages/FeeManagement';
import IncomeList from './pages/IncomeList';
import MyPage from './pages/MyPage';
import SemesterAnalysis from './pages/SemesterAnalysis';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginModal from './components/LoginModal';
import './App.css'; // App 컴포넌트의 스타일링을 위한 CSS 파일을 import
import ForeignCurrency from './pages/ForeignCurrency';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/session', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.is_logged_in) {
          setIsLoggedIn(true);
          setUsername(data.username);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

   const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(false);
          setUsername('');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <Sidebar />
        <div className="main-content">
          <header className="header">
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isLoggedIn ? (
              <>
                <span>Welcome, {username}</span>
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="login-button">로그인</button>
            )}
          </header>
          <div className="content">
            <Routes>
              <Route path="/analysis/income-expense" element={<Analysis />} />
              <Route path="/account/customer-service" element={<CustomerService />} />
              <Route path="/management/excel" element={<Excel />} />
              <Route path="/expense/list" element={<ExpenseList />} />
              <Route path="/analysis/fees" element={<FeeManagement />} />
              <Route path="/income/list" element={<IncomeList />} />
              <Route path="/account/my-page" element={<MyPage />} />
              <Route path="/analysis/semester" element={<SemesterAnalysis />} />
              <Route path="/" element={<Home />} />
              <Route path="/expense/register" element={<ForeignCurrency />} />
            </Routes>
          </div>
        </div>
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleLogin} />
      </div>
  );
}

export default App;
