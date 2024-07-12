import React, { useState } from 'react';
import './ExpenseModal.css';


const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

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
