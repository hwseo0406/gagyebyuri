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
    <Routes>
      {/* 로그인 상태에 따라 라우팅 처리 */}
      <Route path="/home" element={isLoggedIn ? <Navigate to="/main" /> : <Home />} />
      <Route path="/main/*" element={isLoggedIn ? <Main /> : <Navigate to="/home" />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/main" : "/home"} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
    </Routes>
  );
}

export default App;
