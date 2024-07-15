import React, { useState } from 'react';
// import axios from 'axios';
import './IncomeModal.css';

const IncomeModal = ({ isOpen, onClose, onSubmit }) => {
  // const [file, setFile] = useState(null);
  // const [fileUrl, setFileUrl] = useState(null);
  // const [ownerName, setOwnerName] = useState('');
  // const [accountBalance, setAccountBalance] = useState('');
  const [incomeItems, setIncomeItems] = useState([]);

  if (!isOpen) return null;

  // const handleFileChange = async (e) => {
  //   const uploadedFile = e.target.files[0];
  //   setFile(uploadedFile);
  //   setFileUrl(URL.createObjectURL(uploadedFile));

  //   const formData = new FormData();
  //   formData.append('file', uploadedFile);

  //   try {
  //     const response = await axios.post('http://localhost:5000/income', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     const { gptResult_income } = response.data;
  //     setIncomeItems(gptResult_income.income);
      
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...incomeItems];
    updatedItems[index][field] = value;
    setIncomeItems(updatedItems);
  };

  const handleAddItem = () => {
    setIncomeItems([...incomeItems, { sender_name: '', amount: '' , sender_date: ''}]);
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
                        type = "date" 
                        value = {item.sender_date}
                        onChange={(e) => handleInputChange(index, 'sender_date', e.target.value)}
                      />
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
