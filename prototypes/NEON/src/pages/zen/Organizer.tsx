import React, { useState } from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  let rippleCount = 0;

  const handleGardenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('stone')) return;
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
        <h1>理 · 整理器</h1>
        <p>The Organizer / Sandbox</p>
      </div>

      <div className="zen-modules" style={{ display: 'block' }}>
        <div className="zen-module full" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <div className="module-kanji" style={{ marginBottom: '8px' }}>沙</div>
          <div className="module-name">Sandbox</div>
          <div className="module-desc">沙盘推演 · 拖拽重组散落的思绪</div>
          
          <div className="karesansui-garden" onClick={handleGardenClick} style={{ flex: 1, minHeight: '400px', marginTop: '24px' }}>
            <div className="sand-pattern"></div>
            
            {/* Draggable Mock Items */}
            {MOCK_INBOX.map((item, index) => {
              const pos = [
                { top: '20%', left: '30%', width: '90px', height: '60px' },
                { top: '40%', left: '50%', width: '120px', height: '70px' },
                { top: '60%', left: '20%', width: '100px', height: '60px' },
              ][index % 3];

              return (
                <div 
                  key={item.id} 
                  className="stone" 
                  title={item.content}
                  style={{...pos, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px'}}
                >
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.content}
                  </span>
                </div>
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
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px' }}>
            <button className="zen-btn">全部铺开</button>
            <button className="zen-btn">按时间流</button>
            <button className="zen-btn">按主题</button>
          </div>
        </div>
      </div>
    </div>
  );
}
