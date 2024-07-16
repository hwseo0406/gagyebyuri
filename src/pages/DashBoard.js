import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashBoard.css'; // CSS 파일 추가

const DashBoard = ({name}) => {
  const [nickname, setNickname] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedNickname = sessionStorage.getItem('id');
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  const fetchAnalysis = async () => {
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await axios.post('http://localhost:5000/analyze', { nickname });
      setAnalysisResult(response.data.analysisResult);
    } catch (error) {
      setError('분석 중 오류가 발생했습니다.');
      console.error('Error analyzing data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">대쉬보드</h1>
      <div className="dashboard-content">
        <button className="analyze-button" onClick={fetchAnalysis}>
          {name} 분석하기
        </button>
        {error && <p className="error-message">{error}</p>}
        {analysisResult ? (
          <div className="analysis-result">
            <h2>분석 결과</h2>
            <p>{analysisResult}</p>
          </div>
        ) : (
          analysisResult === null && <p className="loading-message">분석 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
