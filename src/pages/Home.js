import React, { useEffect, useRef, useState } from 'react';
import './Home.css'; // Home 컴포넌트의 스타일링을 위한 CSS 파일을 import
import background2 from '../images/KakaoTalk_20240715_100431572.png';

function Home() {
  const sectionRef1 = useRef(null);
  const sectionRef2 = useRef(null);
  const [opacity1, setOpacity1] = useState(1); // 첫 번째 섹션의 배경 이미지 투명도 상태 (처음에는 0.7로 설정)
  const [opacity2, setOpacity2] = useState(0); // 두 번째 섹션의 배경 이미지 투명도 상태

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // 현재 스크롤 위치

      // 첫 번째 섹션의 배경 이미지 투명도 계산
      // 예시로 스크롤이 300px 이하이면 배경 이미지가 완전히 보이도록 설정
      // 그 이상일 때는 스크롤 위치에 따라 투명도 조절
      const opacityValue1 = scrollPosition <= 300 ? 1 : (300 - scrollPosition) / 300;
      setOpacity1(opacityValue1);

      // 두 번째 섹션의 배경 이미지 투명도 계산
      // 예시로 스크롤이 300px 이상이면 배경 이미지가 완전히 보이도록 설정
      // 600px 이상일 때는 두 번째 이미지가 완전히 보이도록 설정
      const opacityValue2 = scrollPosition < 300 ? 0 : (scrollPosition - 300) / 300;
      setOpacity2(opacityValue2 > 1 ? 1 : opacityValue2);
    };

    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 등록

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div ref={sectionRef1} className="home-content1" style={{ opacity: opacity1 }}>
        <h1>사진으로 가계부 쓰기</h1>
        <a href="/login" className="start-button">시작하기</a>
      </div>
      <div ref={sectionRef2} className="home-content" style={{ backgroundImage: `url(${background2})`, opacity: opacity2 }}>
        {/* 두 번째 섹션 내용 */}
      </div>
    </div>
  );
}

export default Home;