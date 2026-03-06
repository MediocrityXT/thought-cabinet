import React, { useState, useEffect } from 'react';

export default function Planner() {
  const [sand, setSand] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setSand(prev => (prev > 0 ? prev - 1 : 0));
    }, 100); // Fast mock timer
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>祭坛 · 沙漏</h1>
        <p>The Altar / Planner</p>
      </div>

      <div className="augury-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{ color: 'var(--augury-gold-dim)', fontStyle: 'italic', letterSpacing: '0.1em', marginBottom: '40px' }}>
          "点燃熏香。在沙粒落尽前，完成你的契约。"
        </p>

        {/* Fake Hourglass */}
        <div style={{ position: 'relative', width: '120px', height: '240px', marginBottom: '40px' }}>
          {/* Top Glass */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', border: '2px solid var(--augury-gold-dim)', borderBottom: 'none', borderRadius: '60px 60px 0 0', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${sand}%`, background: 'var(--augury-gold)', transition: 'height 0.1s linear' }}></div>
          </div>
          
          {/* Bottom Glass */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', border: '2px solid var(--augury-gold-dim)', borderTop: 'none', borderRadius: '0 0 60px 60px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${100 - sand}%`, background: 'var(--augury-gold)', transition: 'height 0.1s linear' }}></div>
          </div>
          
          {/* Middle Connector */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '20px', background: 'var(--augury-night)', border: '2px solid var(--augury-gold-dim)', zIndex: 2 }}></div>
          
          {/* Falling Sand */}
          {sand > 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '120px', background: 'var(--augury-gold)', opacity: 0.8, animation: 'falling-sand 0.5s linear infinite' }}></div>}
        </div>

        <button className="augury-btn" onClick={() => setSand(100)}>重新倒转 (Start 30:00)</button>

        <div style={{ marginTop: '60px', width: '100%', maxWidth: '600px' }}>
          <h3 style={{ fontFamily: 'Cinzel Decorative, serif', color: 'var(--augury-gold)', textAlign: 'center', marginBottom: '24px' }}>登神长阶 (Skills)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '1px', background: 'var(--augury-gold-dim)', opacity: 0.3 }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, padding: '12px 24px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--augury-gold)' }}>
              <span>[当前阶层] 完善 AUGURY 占卜界面</span>
              <span style={{ color: 'var(--augury-gold)' }}>✦</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, padding: '12px 24px', background: 'var(--augury-night)', opacity: 0.5 }}>
              <span>[未知高塔] 后端 API 对接</span>
              <span>✧</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes falling-sand {
            0% { transform: translateX(-50%) translateY(0); height: 0; }
            50% { height: 120px; }
            100% { transform: translateX(-50%) translateY(120px); height: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
