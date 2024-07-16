import React from 'react';
import './CustomerService.css';

const CustomerService = () => {
  return (
    <div className="customer-service-root">
      <img src='/KakaoTalk_20240711_092137325.jpg' alt="가계뷰리 배경화면" className="background-image" />
      <div className="customer-service-content">
        <h1>고객센터</h1>
        
        <section className="customer-service-faq">
          <h2>자주 묻는 질문</h2>
          <div className="customer-service-question">
            <h3>Q1: 지출내역을 어떻게 만드나요?</h3>
            <p>A1: 지출내역 페이지에서 영수증을 업로드하거나 내역을 입력하세요.</p>
          </div>
          <div className="customer-service-question">
            <h3>Q2: 비밀번호를 어떻게 재설정하나요?</h3>
            <p>A2: 로그인 페이지에서 "비밀번호 재설정" 링크를 클릭하고 지시에 따라 진행하세요.</p>
          </div>
          <div className="customer-service-question">
            <h3>Q3: 고객센터에 어떻게 연락하나요?</h3>
            <p>A3: 아래 제공된 전화번호로 연락하시거나 kdigital@bu.ac.kr으로 이메일을 보내주세요.</p>
          </div>
        </section>
        
        <section className="customer-service-contact">
          <h2>연락처</h2>
          <p>다른 질문이 있으시거나 추가 도움이 필요하시면 고객센터로 연락해 주세요:</p>
          <p><strong>전화번호:</strong> 010-1234-5678</p>
          <p><strong>이메일:</strong> kdigital@bu.ac.kr</p>
        </section>
      </div>
    </div>
  );
};

export default CustomerService;
