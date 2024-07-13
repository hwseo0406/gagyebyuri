import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './ForeignCurrency.css'

function ForeignCurrency() {
  const [exchangeRates, setExchangeRates] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('KRW');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [conversionAmount, setConversionAmount] = useState('');
  const [expenseDetail, setExpenseDetail] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [conversionCurrency, setConversionCurrency] = useState('USD');
  const [budget, setBudget] = useState('');
  const [remainingBudget, setRemainingBudget] = useState(null);

  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/KRW')
      .then(response => {
        const { USD, JPY, KRW } = response.data.rates;
        setExchangeRates({ USD, JPY, KRW });
      })
      .catch(error => {
        console.error('Error fetching exchange rates:', error);
      });
  }, []);

  //새로운 지출 등록 함수
  const handleAddTransaction = () => {
    if (amount === '') {
      alert('금액을 입력해주세요.');
      return;
    }

    const newTransaction = {
      currency,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleString(),
      expenseDetail,
    };

    if (remainingBudget !== null) {
      const expenseInKRW = newTransaction.amount / exchangeRates[currency];
      if (remainingBudget - expenseInKRW < 0) {
        alert('예산을 초과할 수 없습니다.');
        return;
      } else {
        setRemainingBudget(remainingBudget - expenseInKRW);
      }
    }

    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setExpenseDetail('');
  };

  const handleConvertCurrency = () => {
    if (conversionAmount && exchangeRates[conversionCurrency]) {
      const result = (parseFloat(conversionAmount) * exchangeRates[conversionCurrency]).toFixed(2);
      setConversionResult(result);
    }
  };

  //예산 설정 함수
  const handleSetBudget = () => {
    if (budget === '') {
      alert('예산을 입력해주세요.');
      return;
    }
    setRemainingBudget(parseFloat(budget));
    setBudget('true');
  };

  return (
    <div>
      <h1>외화 가계부</h1>

      <div>
        <h2>실시간 환율 정보 (기준: KRW 1원)</h2>
        {Object.keys(exchangeRates).length > 0 ? (
          <ul>
            {Object.keys(exchangeRates).map(key => (
              <li key={key}>
                1 KRW = {exchangeRates[key]} {key}
              </li>
            ))}
          </ul>
        ) : (
          <p>환율 정보를 불러오는 중...</p>
        )}
      </div>

      <div>
        <h2>여행 예산 설정</h2>
        <input
          type="number"
          step={100}
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="KRW 예산"
        />
        <button onClick={handleSetBudget} className='ForeignButton'>예산 설정</button>
        {remainingBudget !== null && (
          <div>
            <p>남은 예산: {remainingBudget.toFixed(2)} KRW</p>
          </div>
        )}
      </div>

      <div>
        <h2>예상 지출 등록</h2>
        {/* <select value={currency} onChange={e => setCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select> */}
        <input type='text'
        value={expenseDetail}
        onChange={e => setExpenseDetail(e.target.value)}
        placeholder='예상 지출 내역' />

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="KRW 금액"
        />
        {/* <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select> */}
        <button onClick={handleAddTransaction} className='ForeignButton'>추가</button>
      </div>

      <div>
        <h2>예상 지출 기록 & 남은 예산</h2>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index}>
              {transaction.expenseDetail} - {transaction.date} - {transaction.currency} {transaction.amount}<br />              
            </li>           
          ))}
        </ul>
        {/* {remainingBudget !== null && (
          <div>
            <p>남은 예산: {remainingBudget.toFixed(2)} KRW</p>
          </div>
        )} */}
      </div>
      
      <div>
        <h2>환율 계산기</h2>
        <input
          type="number"
          step={10}
          value={conversionAmount}
          onChange={e => setConversionAmount(e.target.value)}
          placeholder="KRW 금액"
          min={0}
        />
        <select value={conversionCurrency} onChange={e => setConversionCurrency(e.target.value)}>
          {Object.keys(exchangeRates).map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button onClick={handleConvertCurrency} className='ForeignButton'>변환</button>
        {conversionResult !== null && (
          <div>
            <p>변환 결과: {conversionResult} {conversionCurrency}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForeignCurrency;
