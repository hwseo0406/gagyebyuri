import React, {useState, useEffect} from 'react'
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
import './App.css'; // App 컴포넌트의 스타일링을 위한 CSS 파일을 import

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data);
      }
    )
  }, [])

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <Sidebar />
        <div className="main-content">
          <header className="header">
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="login-button">로그인</button>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}

export default App;
