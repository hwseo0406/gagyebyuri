import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
//import './Analysis.css';
import axios from 'axios';

// 표의 색상 배열
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];

const Analysis = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/income2');
      const formattedData = response.data.map(item => ({
        name: item.name,
        price: parseFloat(item.price)
      }));
      setIncomeData(formattedData);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const priceLabel = ({ value }) => {
    return `${value} 만원`;
  };

  const totalIncome = incomeData.reduce((sum, item) => sum + item.price, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>수입 내역</h2>
      <div className='chart-container'>
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie
              dataKey="price"
              isAnimationActive={true}
              data={incomeData}
              cx="50%"
              cy="50%"
              outerRadius={230}
              fill="#8884d8"
              label={priceLabel}
            >
              {
                incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              }
            </Pie>
            <Tooltip />
            <Legend align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <h3 className="table-title">수입 상세 내역</h3>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>금액 (만원)</th>
            </tr>
          </thead>
          <tbody>
            {incomeData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="total-income">총 금액 : {totalIncome} 만원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analysis;
