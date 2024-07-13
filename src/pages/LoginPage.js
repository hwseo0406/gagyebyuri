import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('id', data.id);
          localStorage.setItem('name', data.name);
          onLogin(data.name);
          setError('');
          navigate('/');
        } else {
          setError('Invalid id or password');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Login failed');
      });
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">로그인</button>
        {error && <p className="error">{error}</p>}
      </form>
      <div>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginPage;
