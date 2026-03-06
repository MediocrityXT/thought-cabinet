import React, { useState } from 'react';

export default function Planner() {
  const [active, setActive] = useState(false);

  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>时间沙漏</h1>
        <p className="ink-text">The Hourglass / Planner</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Analog Timer / Hourglass Mock */}
        <div className="atelier-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <p style={{ fontFamily: 'Libre Franklin', fontSize: '0.85rem', color: 'var(--atelier-text-muted)', marginBottom: '40px', letterSpacing: '0.1em' }}>30 MINUTE FOCUS SESSION</p>
          
          <div style={{ 
            width: '200px', height: '200px', 
            borderRadius: '50%', border: '8px solid var(--atelier-border)',
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)',
            background: 'white'
          }}>
             <div style={{ fontSize: '3.5rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--atelier-text-dark)' }}>
               {active ? '29:59' : '30:00'}
             </div>
             
             {/* Fake clock hand */}
             {active && <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '90px', background: 'var(--atelier-accent-main)', transformOrigin: 'bottom center', transform: 'translate(-50%, -100%) rotate(45deg)', borderRadius: '2px' }}></div>}
          </div>

          <div style={{ marginTop: '40px' }}>
            <button className={active ? 'atelier-btn-secondary' : 'atelier-btn-primary'} onClick={() => setActive(!active)}>
              {active ? '暂停打磨 (Pause)' : '开始雕刻 (Start)'}
            </button>
          </div>
        </div>

        {/* Task & Skills */}
        <div className="atelier-card">
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'Libre Franklin', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--atelier-border)', paddingBottom: '12px' }}>当前正在打造的工件</h3>
          
          <div style={{ padding: '20px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '4px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--atelier-accent-main)' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--atelier-accent-main)', fontWeight: 600, fontFamily: 'Libre Franklin' }}>IN PROGRESS</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontFamily: 'Source Serif 4', lineHeight: 1.5 }}>
              构建 ATELIER 手工艺风格的 Planner 页面
            </div>
          </div>
          
          <h3 style={{ fontSize: '1rem', fontFamily: 'Libre Franklin', fontWeight: 600, color: 'var(--atelier-text-muted)', marginBottom: '16px' }}>技能阶梯 (Blueprint)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'Source Serif 4' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--atelier-text-muted)' }}>
               <span style={{ color: 'var(--atelier-accent-green)' }}>✓</span> <span>构思主题核心隐喻</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--atelier-text-dark)' }}>
               <span style={{ color: 'var(--atelier-accent-main)', fontWeight: 'bold' }}>→</span> <span>实现所有 React Router 页面</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--atelier-text-faint)' }}>
               <span>○</span> <span>进行代码审查与优化</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
