import React, { useState, useEffect, useRef } from 'react';

const Airdrop = ({ stakingBalance }) => {
  const [seconds, setSeconds] = useState(20);
  const [time, setTime] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 시간 설정
    setTime(secondsToTime(seconds));
  }, []);

  useEffect(() => {
    // seconds가 0이면 타이머 멈춤
    if (seconds === 0 && timerRef.current) {
      clearInterval(timerRef.current);
    } else {
      setTime(secondsToTime(seconds));
    }
  }, [seconds]);

  useEffect(() => {
    // stakingBalance가 기준 이상이면 타이머 시작
    if (stakingBalance >= '50000000000000000000') {
      startTimer();
    }

    return () => clearInterval(timerRef.current); // 언마운트 시 정리
  }, [stakingBalance]);

  const startTimer = () => {
    if (!timerRef.current && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
  };

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor((secs % 3600) / 60);
    let seconds = Math.ceil(secs % 60);

    return { h: hours, m: minutes, s: seconds };
  };

  return (
    <div style={{ color: 'black' }}>
      {time.m}:{time.s}
    </div>
  );
};

export default Airdrop;
