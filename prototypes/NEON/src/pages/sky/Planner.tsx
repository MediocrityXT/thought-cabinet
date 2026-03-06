import React, { useState, useEffect } from 'react';

export default function Planner() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Mock sun dial progress
    setProgress(30);
  }, []);

  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>☀️ 日轨 · 指挥室</h1>
        <p>Sun Dial / Planner</p>
      </div>

      <div className="sky-card" style={{ textAlign: 'center', padding: '60px 20px', minHeight: '400px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '16px', color: '#f59e0b' }}>30 分钟阳光胶囊</h2>
        <p style={{ color: 'var(--sky-text-muted)', marginBottom: '40px' }}>让专注如同日光般温暖而持续</p>

        <div style={{ position: 'relative', width: '300px', height: '150px', margin: '0 auto', overflow: 'hidden' }}>
          {/* Sun arc background */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '300px', height: '300px', borderRadius: '50%', border: '2px dashed var(--sky-text-muted)', opacity: 0.3 }}></div>
          
          {/* Active sun arc */}
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '300px', height: '300px', borderRadius: '50%', 
            border: '4px solid #f59e0b', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
            transform: `rotate(${progress * 1.8 - 90}deg)`, transition: 'transform 1s ease-out'
          }}></div>

          {/* The Sun */}
          <div style={{
            position: 'absolute', bottom: '-15px', left: '135px', width: '30px', height: '30px',
            background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 20px #f59e0b',
            transform: `rotate(${progress * 1.8}deg) translateX(-150px)`, transformOrigin: '15px 15px',
            transition: 'transform 1s ease-out'
          }}></div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <button className="sky-btn" style={{ background: '#f59e0b', color: 'white' }}>升起太阳 (Start)</button>
        </div>
      </div>
    </div>
  );
}
