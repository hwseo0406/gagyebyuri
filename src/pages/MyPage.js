import React, { useState } from 'react';
import './MyPage.css';

const MyPage = () => {
  const [password, setPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const verifyPassword = () => {
    const id = sessionStorage.getItem('id');
    fetch('http://localhost:5000/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsPasswordVerified(true);
          setError('');
        } else {
          setError('Invalid password');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Verification failed');
      });
  };

  const handleChangeName = () => {
    const id = sessionStorage.getItem('id');
    fetch('http://localhost:5000/change-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, newName })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          sessionStorage.setItem('name', newName);
          setMessage('Name changed successfully');
          setError('');
        } else {
          setError('Failed to change name');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Name change failed');
      });
  };

  const handleDeleteAccount = () => {
    const id = sessionStorage.getItem('id');
    fetch('http://localhost:5000/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          sessionStorage.clear();
          setMessage('아이디가 삭제되었습니다.');
          setError('');
        } else {
          setError('Failed to delete account');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Account deletion failed');
      });
  };

  return (
    <div className="mypage-container">
      <h1>마이 페이지</h1>
      {!isPasswordVerified ? (
        <div className="verification-section">
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={verifyPassword}>확인</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="update-section">
          <input
            type="text"
            placeholder="새 이름을 입력하세요"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleChangeName}>이름 변경</button>
          <button className="delete-button" onClick={handleDeleteAccount}>아이디 삭제</button>
          {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MyPage;
