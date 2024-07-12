import React, { useState } from 'react';
import Modal from './IncomeModal';

const IncomeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeData, setIncomeData] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data) => {
    setIncomeData(data);
    console.log("입력된 값:", data);
  };

  return (
    <div>
      <h1>수입 내역</h1>
      {/* 수입 내역을 표시하는 코드 */}
      <button onClick={handleOpenModal}>추가</button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} />
      {incomeData && <p>입력된 값: {incomeData}</p>}
    </div>
  );
};

export default IncomeList;
