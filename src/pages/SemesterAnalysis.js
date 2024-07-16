import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';
import moment from 'moment';

// 표의 색상 배열
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666', '#66CCCC'];

const SemesterAnalysis = () => {
  const [itemData, setItemData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/semesteranalysis');

      // items 테이블에서 item_name, amount, item_date 값 가져오기
      const formattedItemData = response.data.items.map(item => ({
        name: item.item_name,
        amount: parseFloat(item.amount),
        date: moment(item.item_date).format('YYYY-MM')
      }));
      // income 테이블에서 sender_name, amount, sender_date 값 가져오기
      const formattedIncomeData = response.data.accounts.map(account => ({
        name: account.sender_name,
        amount: parseFloat(account.amount),
        date: moment(account.sender_date).format('YYYY-MM')
      }));

      // 월 목록 설정
      const allMonths = Array.from(new Set([
        ...formattedItemData.map(item => item.date),
        ...formattedIncomeData.map(account => account.date)
      ])).sort();

      setItemData(formattedItemData);
      setIncomeData(formattedIncomeData);
      setMonths(allMonths);
      setSelectedMonth(allMonths[0] || ''); // 첫 번째 월 선택
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 선택한 월에 해당하는 데이터 필터링
  const filteredItemData = itemData.filter(item => item.date === selectedMonth);
  const filteredIncomeData = incomeData.filter(account => account.date === selectedMonth);

  // 월별 합산 금액 계산
  const calculateMonthlyTotal = (data) => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const totalItemAmount = calculateMonthlyTotal(filteredItemData);
  const totalIncomeAmount = calculateMonthlyTotal(filteredIncomeData);

  // 라벨 표시
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
    <div>
      <h1>월별 분석</h1>

      {/* 월 선택 */}
      <div className="month-selector">
        <label htmlFor="month">월 선택: </label>
        <select id="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* 수입 상세 내역 원형 그래프 */}
      <div className='charts-container'>
        <div className='chart-container'>
          <ResponsiveContainer width="100%" height={400}>
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
              >
                {filteredIncomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 지출 상세 내역 원형 그래프 */}
        <div className='chart-container'>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                dataKey="amount"
                isAnimationActive={true}
                data={filteredItemData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label={priceLabel}
              >
                {filteredItemData.map((entry, index) => (
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
          <h3 className="table-title">지출 상세 내역</h3>
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>금액 (원)</th>
              </tr>
            </thead>
            <tbody>
              {filteredItemData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
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

export default SemesterAnalysis;
