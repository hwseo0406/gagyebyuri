import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';


const Sidebar = ({ onLogout }) => {
  const [hovered, setHovered] = useState(false);
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div className={`sidebar ${hovered ? 'sidebar-hover' : ''}`}>
      <div className="sidebar-logo" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link to="/">
          <img src='/KakaoTalk_20240711_092137325.jpg' alt="가계뷰리 로고" className="logo-image" />
          <span>가계뷰리</span>
        </Link>
      </div>
      <div className="sidebar-links">
        <div className="sidebar-item-header">
            <span>수입 및 지출</span>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/income/list">
            <i className="icon icon-income fas fa-plus-circle"></i>
            <span>수입 내역</span>
          </Link>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/expense/list">
            <i className="icon icon-expense fas fa-minus-circle"></i>
            <span>지출 내역</span>
          </Link>
        </div>
        <div className="sidebar-item-header">
            <span>해외</span>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/ForeignCurrency">
            <i className="icon icon-expense fas fa-plane"></i>
            <span>외화 가계부</span>
          </Link>
        </div>
        <div className="sidebar-item-header">
            <span>분석</span>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/analysis/income-expense">
            <i className="icon icon-analysis fas fa-chart-pie"></i>
            <span>수입/지출 분석</span>
          </Link>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/analysis/semester">
            <i className="fas fa-calendar-alt"></i>
            <span>월별 분석</span>
          </Link>
        </div>
        <div className="sidebar-item-header">
            <span>관리</span>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/analysis/fees">
          <i className="icon icon-management fas fa-users"></i>
            <span>회비 관리</span>
          </Link>
        </div>
        {/* <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/management/excel">
            <i className="icon icon-management fas fa-file-excel"></i>
            <span>엑셀</span>
          </Link>
        </div> */}
        <div className="sidebar-item-header">
            <span>계정</span>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/account/my-page">
            <i className="icon icon-account fas fa-user-circle"></i>
            <span>마이 페이지</span>
          </Link>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/main/account/customer-service">
            <i className="icon icon-account fas fa-headset"></i>
            <span>고객센터</span>
          </Link>
        </div>
        <div
          className="sidebar-item"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
           <Link to="/" onClick={onLogout}>
            <i className="icon icon-account fas fa-sign-out-alt"></i>
            <span>로그아웃</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
