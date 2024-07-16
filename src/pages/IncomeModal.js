import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncomeModal.css';

const IncomeModal = ({ isOpen, onClose, onSubmit, editData }) => {
  const [incomeItems, setIncomeItems] = useState([]);

  useEffect(() => {
    if (editData) {
      setIncomeItems(editData.income || []);
    } else {
      setIncomeItems([]);
    }
  }, [editData]);

  if (!isOpen) return null;

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...incomeItems];
    updatedItems[index][field] = value;
    setIncomeItems(updatedItems);
  };

  const handleAddItem = () => {
    setIncomeItems([...incomeItems, { id: null, sender_name: '', amount: '', sender_date: '' }]);
  };

  const handleRemoveItem = async (index, itemId) => {
    if (itemId) {
      try {
        await axios.delete(`http://localhost:5000/delete_income/${itemId}`);
        console.log('삭제 성공');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
    const updatedItems = [...incomeItems];
    updatedItems.splice(index, 1);
    setIncomeItems(updatedItems);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      income: incomeItems,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="closeModal" onClick={onClose}>&times;</span>
        <h2>수입 업로드</h2>
        <form onSubmit={handleFormSubmit}>
          <button type="button" onClick={handleAddItem}>항목 추가</button>
          <div className="table-container">
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
                {incomeItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.sender_name}
                        onChange={(e) => handleInputChange(index, 'sender_name', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="date" 
                        value={item.sender_date}
                        onChange={(e) => handleInputChange(index, 'sender_date', e.target.value)}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => handleRemoveItem(index, item.id)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="submit">저장</button>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
