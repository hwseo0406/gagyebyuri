import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncomeModal from './IncomeModal';

const IncomeList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('id');
    if (storedNickname) {
      setNickname(storedNickname);
      fetchIncomes(nickname)
    }
  }, [nickname]);
  const fetchIncomes = async (nickname) => {
    try {
      const response = await axios.get(`http://localhost:5000/income_list/${nickname}`);
      setIncomes(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching incomes:', error);
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
        await axios.put(`http://localhost:5000/update_income/${editData.id}`, data);
      } else {
        await axios.post('http://localhost:5000/incomesave', {
          nickname: nickname,
          gptResult_income: data
        });
      }
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

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <h1>수입 내역</h1>
      <button onClick={() => handleOpenModal()}>추가</button>
      <IncomeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editData={editData}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>송신자 이름</th>
              <th>금액</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income, index) => (
              <tr key={index}>
                <td>{income.sender_name}</td>
                <td>{income.amount}원</td>
                <td>
                  <button onClick={() => handleOpenModal(income)}>수정</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(income.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeList;
