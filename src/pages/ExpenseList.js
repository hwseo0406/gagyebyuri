// ExpenseList.js

import React, { useState } from 'react';
import Modal from './ExpenseModal';
import './ExpenseModal.css'; // ExpenseModal.css 파일을 임포트

const ExpenseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseData, setExpenseData] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data) => {
    setExpenseData(data);
    console.log("입력된 값:", data);
  };

  return (
    <div>
      <h1>지출 내역</h1>
      {/* 지출 내역을 표시하는 코드 */}
      <button onClick={handleOpenModal}>추가</button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} />
      {expenseData && <p>입력된 값: {expenseData}</p>}
    </div>
  );
};

export default ExpenseList;
