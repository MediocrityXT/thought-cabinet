import React, { useState, useEffect } from 'react';

export default function Planner() {
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="EXECUTION_OVERRIDE">EXECUTION_OVERRIDE</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>Tactical Roadmap / Planner</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div className="glitch-module" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ color: 'var(--channel-cyan)', letterSpacing: '0.2em', marginBottom: '24px' }}>
            [ACTIVE_TIME_CAPSULE]
          </div>
          
          <div className="glitch-text" data-text={formatTime(timeLeft)} style={{ fontSize: '5rem', fontFamily: 'Orbitron', color: 'var(--glitch-white)', marginBottom: '40px' }}>
            {formatTime(timeLeft)}
          </div>
          
          <div style={{ width: '100%', background: 'var(--glitch-dark)', height: '4px', marginBottom: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${((1500 - timeLeft) / 1500) * 100}%`, background: 'var(--channel-cyan)' }}></div>
            {/* Fake glitches on progress bar */}
            <div style={{ position: 'absolute', top: '-2px', left: '30%', height: '8px', width: '4px', background: 'var(--channel-red)' }}></div>
            <div style={{ position: 'absolute', top: '-2px', left: '70%', height: '8px', width: '4px', background: 'var(--channel-magenta)' }}></div>
          </div>
          
          <button className="glitch-btn" style={{ width: '80%' }}>FORCE_START</button>
        </div>

        <div className="glitch-module">
          <h3 style={{ color: 'var(--channel-magenta)', marginBottom: '24px', borderBottom: '1px solid var(--glitch-muted)', paddingBottom: '8px' }}>
            SKILL_TREE_CORRUPTION
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: 'var(--channel-green)' }}>[OK]</div>
              <div style={{ color: 'var(--glitch-dim)', textDecoration: 'line-through' }}>Initialize Project Architecture</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,0,255,0.1)', padding: '8px', borderLeft: '2px solid var(--channel-magenta)' }}>
              <div style={{ color: 'var(--channel-magenta)', animation: 'blink 1s infinite' }}>[&gt;&gt;]</div>
              <div style={{ color: 'var(--glitch-white)' }}>Implement GLITCH Theme UI</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.5 }}>
              <div style={{ color: 'var(--glitch-dim)' }}>[--]</div>
              <div style={{ color: 'var(--glitch-dim)' }}>Connect to Backend Systems</div>
            </div>
            
            <div style={{ marginTop: '40px', padding: '16px', border: '1px dashed var(--channel-red)', color: 'var(--channel-red)', fontSize: '0.875rem' }}>
              ⚠️ WARNING: PROCRASTINATION DETECTED IN SECTOR [FITNESS]. 
              RECOMMEND IMMEDIATE PHYSICAL ACTIVITY TO PREVENT SYSTEM HALT.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
