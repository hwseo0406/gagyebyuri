import React, { useEffect, useState, useCallback } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import moment from 'moment';
import './SemesterAnalysis.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];
const DARK_MODE_COLORS = ['#1976D2', '#4CAF50', '#FFD54F', '#FF7043', '#673AB7', '#E53935', '#3B6E7E'];


const SemesterAnalysis = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [receiptsData, setReceiptsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [id, setId] = useState('');
  const [months, setMonths] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [updateId, setUpdateId] = useState(0);

  const darkModeSetting = sessionStorage.getItem('darkMode');

  useEffect(() => {
    const id = sessionStorage.getItem('id');
    if (id) {
      setId(id);
      fetchData();
    }
    setUpdateId(updateId => updateId + 1);
  }, [id]);

  useEffect(() => {
    if (darkModeSetting === 'true') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
    setUpdateId(updateId => updateId + 1);
  }, [darkModeSetting]);
  
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/semesteranalysis', { id });

      const formattedIncomeData = response.data.accounts.map(account => ({
        name: account.name,
        amount: parseFloat(account.amount),
        date: moment(account.date).format('YYYY-MM')
      }));

      const formattedReceiptsData = response.data.receipts.map(receipt => ({
        name: receipt.name,
        amount: parseFloat(receipt.amount),
        date: moment(receipt.date).format('YYYY-MM')
      }));

      const allMonths = Array.from(new Set([
        ...formattedIncomeData.map(account => account.date),
        ...formattedReceiptsData.map(receipt => receipt.date)
      ])).sort();

      setIncomeData(formattedIncomeData);
      setReceiptsData(formattedReceiptsData);
      setMonths(allMonths);
      setSelectedMonth(allMonths[0] || '');
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredIncomeData = incomeData.filter(account => account.date === selectedMonth);
  const filteredReceiptsData = receiptsData.filter(receipt => receipt.date === selectedMonth);

  const calculateMonthlyTotal = (data) => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const totalIncomeAmount = calculateMonthlyTotal(filteredIncomeData);
  const totalReceiptsAmount = calculateMonthlyTotal(filteredReceiptsData);

  const priceLabel = ({ value }) => {
    return `${value} 원`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='semester-analysis'>
      <h1>월별 분석</h1>

      <div className="month-selector">
        <label htmlFor="month" className='month-label'>월 선택: </label>
        <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className='charts-container'>
        <div className='chart-container'>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                dataKey="amount"
                isAnimationActive={true}
                data={filteredIncomeData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
                updateId={updateId} // updateId를 Pie에 전달하여 업데이트를 강제합니다.
              >
                {filteredIncomeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={darkMode ? DARK_MODE_COLORS[index % DARK_MODE_COLORS.length] : COLORS[index % COLORS.length]}
                  />
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
                dataKey="amount"
                isAnimationActive={true}
                data={filteredReceiptsData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
                updateId={updateId} // updateId를 Pie에 전달하여 업데이트를 강제합니다.
              >
                {filteredReceiptsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={darkMode ? DARK_MODE_COLORS[index % DARK_MODE_COLORS.length] : COLORS[index % COLORS.length]}
                  />
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
              {filteredIncomeData.map((account, index) => (
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
              {filteredReceiptsData.map((receipt, index) => (
                <tr key={index}>
                  <td>{receipt.name}</td>
                  <td>{receipt.amount}</td>
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

export default SemesterAnalysis;
