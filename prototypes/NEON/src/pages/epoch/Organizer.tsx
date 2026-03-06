import React from 'react';
import { MOCK_INBOX } from '../../data/mock';

export default function Organizer() {
  const dustParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${3 + Math.random() * 3}s`
  }));

  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>发掘 · 整理器</h1>
        <p>Excavation Site / Organizer</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">⛏️</div>
            <div className="module-title-group">
              <h3>Excavation Site</h3>
              <p>Active Discovery Zone</p>
            </div>
          </div>
          
          <div className="excavation-workspace">
            <div className="tools-panel">
              <div className="tool-item">
                <div className="tool-icon">🖌️</div>
                <div className="tool-name">清理刷</div>
              </div>
              <div className="tool-item">
                <div className="tool-icon">🔍</div>
                <div className="tool-name">放大镜</div>
              </div>
              <div className="tool-item">
                <div className="tool-icon">📷</div>
                <div className="tool-name">记录仪</div>
              </div>
            </div>
            
            <div className="dig-site" style={{ display: 'flex', flexDirection: 'column' }}>
              {dustParticles.map(dust => (
                <div 
                  key={dust.id} 
                  className="dust" 
                  style={{ 
                    left: dust.left, 
                    top: dust.top, 
                    animationDelay: dust.animationDelay, 
                    animationDuration: dust.animationDuration 
                  }}
                ></div>
              ))}
              
              <div style={{ marginBottom: '16px', color: 'var(--epoch-bronze-dark)', fontWeight: 'bold' }}>
                未清理的思绪沉积 ({MOCK_INBOX.length})
              </div>
              
              <div className="unearthed-items">
                {MOCK_INBOX.map((item, i) => (
                  <div className="unearthed-item" key={item.id} style={{ animationDelay: `${i * 0.2}s` }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--epoch-faded)', marginBottom: '4px' }}>出土时间: {item.time}</div>
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
