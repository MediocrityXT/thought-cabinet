import React, { useState, useEffect } from 'react';

export default function Planner() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>⏳ 潮汐 · 指挥室</h1>
        <p>Tides / Planner</p>
      </div>

      <div className="aura-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <p style={{ color: 'var(--aura-text-dim)', marginBottom: '60px', letterSpacing: '0.1em' }}>"跟随能量的潮汐，进入 30 分钟的深度共振。"</p>

        <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '60px' }}>
          {/* Inner Core */}
          <div style={{ position: 'absolute', inset: '40px', background: 'var(--aura-magenta)', borderRadius: '50%', filter: 'blur(10px)', opacity: pulse ? 0.8 : 0.4, transition: 'opacity 4s ease-in-out' }}></div>
          
          {/* Outer Rings */}
          <div style={{ position: 'absolute', inset: '20px', border: '2px solid var(--aura-cyan)', borderRadius: '50%', opacity: 0.5, animation: 'spin 20s linear infinite' }}></div>
          <div style={{ position: 'absolute', inset: '0px', border: '1px dashed var(--aura-purple)', borderRadius: '50%', opacity: 0.3, animation: 'spin 30s linear infinite reverse' }}></div>
          
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--aura-text)', letterSpacing: '0.1em', textShadow: '0 0 10px var(--aura-cyan)' }}>
            入定 (Start)
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ color: 'var(--aura-cyan)', marginBottom: '16px' }}>当前频率流向 (Current Task)</div>
          <div style={{ padding: '16px', background: 'rgba(0,240,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,240,255,0.2)' }}>
            完善 AURA 主题架构
          </div>
        </div>

        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
