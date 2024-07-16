import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './Analysis.css';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];

const Analysis = () => {
  const [itemData, setItemData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/item');

      console.log('API Response:', response.data);

      const formattedItemData = response.data.items.map(item => ({
        name: item.item_name,
        price: parseFloat(item.amount)
      }));

      const formattedIncomeData = response.data.accounts.map(account => ({
        name: account.sender_name,
        amount: parseFloat(account.amount)
      }));

      console.log('Formatted Item Data:', formattedItemData);
      console.log('Formatted Income Data:', formattedIncomeData);

      setItemData(formattedItemData);
      setIncomeData(formattedIncomeData);
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

  const totalItemAmount = itemData.reduce((sum, item) => sum + item.price, 0);
  const totalIncomeAmount = incomeData.reduce((sum, account) => sum + account.amount, 0);

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
          <ResponsiveContainer width="100%" height={400}>
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
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                dataKey="price"
                isAnimationActive={true}
                data={itemData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
              >
                {itemData.map((entry, index) => (
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
                <th>송신자</th>
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
          <h3 className="table-title">지출 상세 내역</h3>
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {itemData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="total-income">총 금액 : {totalItemAmount} 원</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
