import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Analysis from './Analysis';
import CustomerService from './CustomerService';
import ExpenseList from './ExpenseList';
import IncomeList from './IncomeList';
import MyPage from './MyPage';
import SemesterAnalysis from './SemesterAnalysis';
import Main from './DashBoard';
import NotFound from './NotFound';
import ForeignCurrency from './ForeignCurrency'
import './Mainpage.css'; // App 컴포넌트의 스타일링을 위한 CSS 파일을 import

function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const checkSession = () => {
    const id = sessionStorage.getItem('id');
    const name = sessionStorage.getItem('name');
    const darkModeSetting = sessionStorage.getItem('darkMode');
    if (id && name) {
      setIsLoggedIn(true);
      setName(name);
        if (darkModeSetting === 'true') {
          setDarkMode(true);
          document.body.classList.add('dark-mode');
        }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);


  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(prevMode => !prevMode);
    sessionStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
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
          navigate('/home');
          window.location.reload();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <Sidebar onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="main-content">
          <div className="content">
            <Routes>
              <Route path="/analysis/income-expense" element={<Analysis />} />
              <Route path="/account/customer-service" element={<CustomerService />} />
              <Route path="/expense/list" element={<ExpenseList />} />
              <Route path="/income/list" element={<IncomeList />} />
              <Route path="/ForeignCurrency" element={<ForeignCurrency />} />
              <Route path="/account/my-page" element={<MyPage name={name}/>} />
              <Route path="/analysis/semester" element={<SemesterAnalysis/>} />
              <Route path="/" element={<Main name={name} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}

export default Home;
