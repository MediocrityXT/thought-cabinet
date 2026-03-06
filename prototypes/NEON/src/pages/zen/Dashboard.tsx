import React, { useState } from 'react';
import { MOCK_STATS, MOCK_INBOX } from '../../data/mock';

export default function Dashboard() {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  let rippleCount = 0;

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = rippleCount++;
    setRipples([...ripples, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 4000);
  };

  return (
    <div className="zen-page zen-page-transition">
      <div className="zen-page-header">
        <h1>庭 · 概览</h1>
        <p>Dashboard / Karesansui</p>
      </div>
      
      <div className="zen-modules">
        {/* Module: Ma (間) */}
        <div className="zen-module">
          <div className="module-kanji">間</div>
          <div className="module-name">Ma</div>
          <div className="module-desc">系统状态 · 呼吸的空间</div>
          <div className="ma-space">
            <div className="breath-circle">
              <div className="breath-inner"></div>
            </div>
            <span className="breath-text">健康度 {MOCK_STATS.find(s => s.label === 'System Health')?.value}</span>
          </div>
        </div>

        {/* Module: Karesansui (枯山水) */}
        <div className="zen-module wide">
          <div className="module-kanji">庭</div>
          <div className="module-name">Karesansui</div>
          <div className="module-desc">枯山水 · 今日待办 ({MOCK_INBOX.length})</div>
          <div className="karesansui-garden" onClick={handleGardenClick}>
            <div className="sand-pattern"></div>
            {MOCK_INBOX.map((item, index) => {
              const positions = [
                { top: '30%', left: '20%', width: '60px', height: '50px' },
                { top: '50%', left: '40%', width: '45px', height: '40px' },
                { top: '25%', left: '70%', width: '70px', height: '55px' },
              ];
              const pos = positions[index % positions.length];
              return (
                <div 
                  key={item.id} 
                  className="stone" 
                  title={item.content}
                  style={pos}
                ></div>
              );
            })}
            {ripples.map(ripple => (
              <div 
                key={ripple.id} 
                className="ripple" 
                style={{ left: ripple.x, top: ripple.y, transform: 'translate(-50%, -50%)' }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
