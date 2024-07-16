import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseModal from './ExpenseModal';
import './ExpenseList.css'; // 수정된 CSS 파일을 import

const ExpenseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [nickname, setNickname] = useState('');
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('id');
    if (storedNickname) {
      setNickname(storedNickname);
      fetchExpenses(storedNickname); // 수정: nickname 대신 storedNickname 사용
    }
  }, []);

  const fetchExpenses = async (nickname) => {
    try {
      const response = await axios.get(`http://localhost:5000/ExpenseList/${nickname}`);
      setExpenses(response.data.receipts);
      setTotal(response.data.total);
      console.log(response.data.total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleOpenModal = (data = null) => {
    setEditMode(!!data);
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/update_receipt/${editData.id}`, data);
      } else {
        await axios.post('http://localhost:5000/save', {
          nickname: nickname,
          gptResult: data,
          category: data.category, // 카테고리 값 추가
        });
      }
      setIsModalOpen(false);
      fetchExpenses(nickname); // 새 데이터 저장 후 지출 내역 갱신
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete_receipt/${id}`);
      fetchExpenses(nickname); // 데이터 삭제 후 지출 내역 갱신
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid date' : date.toISOString().split('T')[0];
  };

  return (
    <div className="expense-list">
      <h1>지출 내역</h1>
        <button onClick={() => handleOpenModal()} className="add-button">
          내역추가
        </button>
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          editData={editData}
        />

        <table>
          <thead>
            <tr>
              <th>가게 이름</th>
              <th>구매 날짜</th>
              <th>총 가격</th>
              <th>카테고리</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.store_name}</td>
                <td>{formatDate(expense.purchase_date)}</td>
                <td>{expense.total_cost}원</td>
                <td>{expense.category}</td> {/* 카테고리 값 표시 */}
                <td>
                  <button onClick={() => handleOpenModal(expense)}>수정</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(expense.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 style={{ textAlign: 'right' }}>총 합계: {total}원</h3>
      </div>
  );
};

export default ExpenseList;
