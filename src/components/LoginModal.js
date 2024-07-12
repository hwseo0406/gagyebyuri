import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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
          onLogin(id);
          setError('');
        } else {
          setError('Invalid id or password');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Login failed');
      });
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleSignupClose = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="사용자명" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">로그인</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div>
          계정이 없으신가요? <button onClick={handleSignupClick}>회원가입</button>
        </div>
      </div>
      {isSignupModalOpen && <SignupModal onClose={handleSignupClose} />}
    </div>
  );
};

const SignupModal = ({ onClose }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password, nickname })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('회원가입 성공!');
          onClose(); // 모달 닫기
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
    } else if (name === 'nickname') {
      setNickname(value);
    }
  };

  return (
    <div className="modal open">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <input type="text" name="id" placeholder="아이디" value={id} onChange={handleChange} required />
          <input type="password" name="password" placeholder="비밀번호" value={password} onChange={handleChange} required />
          <input type="text" name="nickname" placeholder="닉네임" value={nickname} onChange={handleChange} required />
          <button type="submit">회원가입</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
