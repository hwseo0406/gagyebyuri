// ExpenseModal.js

import React, { useState } from 'react';
import './ExpenseModal.css'; // CSS 파일 임포트

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue(''); // 입력 후 값 초기화
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>입력 창</h2>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button onClick={handleSubmit}>입력</button>
      </div>
    </div>
  );
};

export default Modal;
