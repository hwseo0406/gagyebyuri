import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './Analysis.css';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];

const Analysis = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [receiptsData, setReceiptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseItem = await axios.get('http://localhost:9000/api/item');
      const responseReceipts = await axios.get('http://localhost:9000/api/receipts');
  
      console.log('Item API Response:', responseItem.data);
      console.log('Receipts API Response:', responseReceipts.data);
  
      const formattedIncomeData = responseItem.data.accounts.map(account => ({
        name: account.name,
        amount: parseFloat(account.amount)
      }));
  
      const formattedReceiptsData = responseReceipts.data.map(receipt => ({
        name: receipt.name,
        price: parseFloat(receipt.amount) // Adjust this based on actual field name
      }));
  
      console.log('Formatted Income Data:', formattedIncomeData);
      console.log('Formatted Receipts Data:', formattedReceiptsData);
  
      setIncomeData(formattedIncomeData);
      setReceiptsData(formattedReceiptsData);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };
  

  const priceLabel = ({ value }) => {
    return `${value} 원`;
  };

  const totalIncomeAmount = incomeData.reduce((sum, account) => sum + account.amount, 0);
  const totalReceiptsAmount = receiptsData.reduce((sum, receipt) => sum + receipt.price, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>수입/지출 분석</h1>

      <div className='charts-container'>
        <div className='chart-container'>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                dataKey="amount"
                isAnimationActive={true}
                data={incomeData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='chart-container'>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                dataKey="price"
                isAnimationActive={true}
                data={receiptsData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
              >
                {receiptsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tables-container">
        <div className="table-container">
          <h3 className="table-title">수입 상세 내역</h3>
          <table>
            <thead>
              <tr>
                <th>수입출처</th>
                <th>금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((account, index) => (
                <tr key={index}>
                  <td>{account.name}</td>
                  <td>{account.amount}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="total-income">총 금액 : {totalIncomeAmount} 원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h3 className="table-title">영수증 상세 내역</h3>
          <table>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {receiptsData.map((receipt, index) => (
                <tr key={index}>
                  <td>{receipt.name}</td>
                  <td>{receipt.price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="total-income">총 금액 : {totalReceiptsAmount} 원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
