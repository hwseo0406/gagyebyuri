import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Main from './pages/Mainpage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Home from './pages/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const id = sessionStorage.getItem('id');
      const name = sessionStorage.getItem('name');
      if (id && name) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsSessionChecked(true);
    };

    checkSession(); // 페이지가 처음 렌더링될 때 세션 체크

    // 세션 확인이 완료되면 더 이상 체크하지 않음
    return () => {
      setIsSessionChecked(false);
    };
  }, []);

  // 세션 확인이 완료되기 전까지 로딩 중 화면 표시
  if (!isSessionChecked) {
    return <div>Loading...</div>; 
  }
  
  return (
<<<<<<< HEAD
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
=======
    <Routes>
      {/* 로그인 상태에 따라 라우팅 처리 */}
      <Route path="/home" element={isLoggedIn ? <Navigate to="/main" /> : <Home />} />
      <Route path="/main/*" element={isLoggedIn ? <Main /> : <Navigate to="/home" />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/main" : "/home"} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
    </Routes>
>>>>>>> b2aa420c9d9fd8e43c54bc52f00d352721c6f1f9
  );
}

export default App;
