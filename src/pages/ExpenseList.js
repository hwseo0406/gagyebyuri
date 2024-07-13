import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseModal from './ExpenseModal';

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
      fetchExpenses(nickname)
    }
  }, [nickname]);

  const fetchExpenses = async (nickname) => {
    try {
      const response = await axios.get(`http://localhost:5000/ExpenseList/${nickname}`);
      setExpenses(response.data.receipts);
      setTotal(response.data.total);
      console.log(response.data.total)
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
          gptResult: data
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

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <h1>지출 내역</h1>

      <button onClick={() => handleOpenModal()}>추가</button>
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editData={editData}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>가게 이름</th>
              <th>구매 날짜</th>
              <th>총 가격</th>
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
        <h3>총 합계: {total}원</h3>
      </div>
    </div>
  );
};

export default ExpenseList;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid date' : date.toISOString().split('T')[0];
};
