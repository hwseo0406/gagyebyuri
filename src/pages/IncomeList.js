import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncomeModal from './IncomeModal';
import './IncomeList.css';

const IncomeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('id');
    if (storedNickname) {
      setNickname(storedNickname);
      fetchIncomes(nickname);
    }
  }, [nickname]);
  
  const fetchIncomes = async (nickname) => {
    try {
      const response = await axios.get(`http://localhost:5000/income_list/${nickname}`);
      setIncomes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/incomesave', {
        nickname: nickname,
        gptResult_income: data,
      });
      setIsModalOpen(false);
      fetchIncomes(nickname); // 새 데이터 저장 후 수입 내역 갱신
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete_income/${id}`);
      fetchIncomes(nickname); // 데이터 삭제 후 수입 내역 갱신
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid date' : date.toISOString().split('T')[0];
  };

  return (
    <div className="income-list">
      <h1>수입 내역</h1>
      <button onClick={() => handleOpenModal()} className="add-button">
        내역 추가
      </button>
      <IncomeModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleModalSubmit} editData={editData} />
      <table>
        <thead>
          <tr>
            <th>수입 출처</th>
            <th>금액</th>
            <th>날짜</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income, index) => (
            <tr key={index}>
              <td>{income.sender_name}</td>
              <td>{income.amount}원</td>
              <td>{formatDate(income.sender_date)}</td>
              <td>
                <button onClick={() => handleDelete(income.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
