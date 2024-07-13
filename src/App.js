import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import Register from './pages/Register';
import LoginPage from './pages/LoginPage';
import './App.css'; // App 컴포넌트의 스타일링을 위한 CSS 파일을 import

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const checkSession = () => {
    const id = sessionStorage.getItem('id');
    const name = sessionStorage.getItem('name');
    if (id && name) {
      setIsLoggedIn(true);
      setName(name);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);


  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setName(name);
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(false);
          setName('');
          sessionStorage.clear();
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
                <span>Welcome, {name}</span>
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="login-button">로그인</button>
            )}
          </header>
          <div className="content">
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/analysis/income-expense" element={<Analysis />} />
              <Route path="/account/customer-service" element={<CustomerService />} />
              <Route path="/management/excel" element={<Excel />} />
              <Route path="/expense/list" element={<ExpenseList />} />
              <Route path="/analysis/fees" element={<FeeManagement />} />
              <Route path="/income/list" element={<IncomeList />} />
              <Route path="/account/my-page" element={<MyPage />} />
              <Route path="/analysis/semester" element={<SemesterAnalysis />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}

export default App;
