import React, { useState } from 'react';

export default function Planner() {
  const [active, setActive] = useState(false);

  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>聚焦透镜</h1>
        <p>Focus Lens / Planner</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Timer */}
        <div className="prism-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '40px' }}>
            {/* Base Ring */}
            <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            
            {/* Active Rings */}
            {active && (
              <>
                <div style={{ position: 'absolute', inset: '-10px', border: '2px solid var(--spectrum-blue)', borderRadius: '50%', opacity: 0.5, animation: 'spin 4s linear infinite' }}></div>
                <div style={{ position: 'absolute', inset: '-20px', border: '1px solid var(--spectrum-purple)', borderRadius: '50%', opacity: 0.3, animation: 'spin 8s linear infinite reverse' }}></div>
              </>
            )}

            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'JetBrains Mono', color: active ? 'var(--spectrum-blue)' : 'var(--text-primary)', textShadow: active ? '0 0 20px var(--spectrum-blue)' : 'none' }}>
                {active ? '29:59' : '30:00'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>MINUTES</div>
            </div>
          </div>

          <button className="prism-btn" onClick={() => setActive(!active)} style={{ width: '200px', background: active ? 'transparent' : 'var(--text-primary)', color: active ? 'var(--text-primary)' : 'var(--bg-lab-deep)', borderColor: active ? 'rgba(255,255,255,0.2)' : 'transparent', fontWeight: 'bold' }}>
            {active ? '中止聚焦 (ABORT)' : '启动聚焦 (ENGAGE)'}
          </button>
        </div>

        {/* Tasks */}
        <div className="prism-card">
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--spectrum-blue)' }}>■</span> 当前解析目标
          </h2>
          
          <div className="spectrum-bg-blue" style={{ padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>完成 PRISM 光谱主题的组件开发</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--spectrum-blue)' }}>预期投入: 30 分钟</div>
          </div>
          
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>后续队列 (Queue)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-lab-input)', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>检查 NEON 居中问题</span>
              <span style={{ color: 'var(--spectrum-yellow)' }}>■</span>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-lab-input)', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>开发 FORGE 主题</span>
              <span style={{ color: 'var(--spectrum-orange)' }}>■</span>
            </div>
          </div>
        </div>

        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
