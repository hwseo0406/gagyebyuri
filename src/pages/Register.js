import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const RegisterPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password, name })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('회원가입 성공!');
          navigate.push('/'); // 회원가입 후 메인 페이지로 이동
        } else {
          setError('회원가입 실패');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('회원가입 중 오류가 발생했습니다.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id') {
      setId(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'name') {
      setName(value);
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <h2>회원가입</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="id" placeholder="아이디" value={id} onChange={handleChange} required />
          <input type="password" name="password" placeholder="비밀번호" value={password} onChange={handleChange} required />
          <input type="text" name="name" placeholder="이름" value={name} onChange={handleChange} required />
          <button type="submit">회원가입</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
