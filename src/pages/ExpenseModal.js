import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExpenseModal.css';

const ExpenseModal = ({ isOpen, onClose, onSubmit, editData }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // 이미지 URL 상태 추가
  const [storeName, setStoreName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (editData) {
      setStoreName(editData.store_name);
      setPurchaseDate(editData.purchase_date);
      setTotalCost(editData.total_cost);
      fetchItems(editData.id);
    } else {
      setStoreName('');
      setPurchaseDate('');
      setTotalCost('');
      setItems([]);
    }
  }, [editData]);

  const fetchItems = async (receiptId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_receipt/${receiptId}`);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile)); // 이미지 URL 생성

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { gptResult } = response.data;
      setStoreName(gptResult.store_name);
      setPurchaseDate(gptResult.purchase_date);
      setTotalCost(gptResult.total_cost);
      setItems(gptResult.items);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    const newItem = { id: null, item_name: '', quantity: '', amount: '' };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = async (index, itemId) => {
    if (itemId) {
      try {
        await axios.delete(`http://localhost:5000/delete_item/${itemId}`);
        console.log('삭제 성공');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      store_name: storeName,
      purchase_date: purchaseDate,
      total_cost: totalCost,
      items: items,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="exmodal">
      <div className="exmodal-content">
        <span className="excloseModal" onClick={onClose}>&times;</span>
        <h2>영수증 업로드</h2>
        <hr />
        <form onSubmit={handleFormSubmit}>
          <h4>날짜</h4>
          <input type="date" className="exmodal-input" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}  />
          <h4>가게 이름</h4>
          <input type="text" className="exmodal-input" placeholder="가게 이름" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
          <h4>카테고리</h4>
          {/* 카테고리 입력 필드 */}
          <h4>총 가격</h4>
          <input type="number" className="exmodal-input" placeholder="총 가격" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} required />
          <h4>영수증 업로드</h4>
          <input type="file" className="exmodal-input" onChange={handleFileChange} />
          {fileUrl && <img src={fileUrl} alt="Uploaded file" style={{ width: '200px', marginTop: '10px' }} />}
          <hr />
          <div className="exmodal-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ textAlign: 'left' }}>상세내역</h4>
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={handleAddItem}>추가</button>
              </div>
            </div>
              <table className="exmodal-table">
                <thead>
                  <tr>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>가격</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.item_name}
                          onChange={(e) => handleInputChange(index, 'item_name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
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
                        <button type="button" onClick={() => handleRemoveItem(index, item.id)}>삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br></br>
            </div>
            <button type="submit">저장</button>
          </form>
        </div>
      </div>
  );
};

export default ExpenseModal;
