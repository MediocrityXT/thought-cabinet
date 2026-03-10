import React from 'react';

export default function Refinery() {
  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>熔炉控制</h1>
        <p>The Furnace / Refinery</p>
      </div>

      <div className="forge-card" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--forge-steel)', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'var(--text-ember)' }}>🔥 控制面板</h2>
          <div style={{ display: 'flex', gap: '16px', fontFamily: 'Share Tech Mono', color: 'var(--heat-warming)' }}>
            <span>TEMP: 850°C</span>
            <span>PRESSURE: NORMAL</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ fontFamily: 'Oswald', color: 'var(--text-ash)' }}>原材料投入口</label>
            <textarea 
              placeholder="[ 投入未经处理的文本、想法或链接 ]"
              style={{
                width: '100%', height: '200px',
                background: 'var(--forge-charcoal)', border: '2px solid var(--forge-steel)',
                color: 'var(--text-ember)', padding: '16px', resize: 'none', outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button className="forge-btn forge-btn-hot">投入熔炉 (MELT DOWN)</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ fontFamily: 'Oswald', color: 'var(--text-ash)' }}>熔炼观察窗</label>
            <div style={{ 
              width: '100%', height: '200px', 
              background: '#000', border: '4px solid var(--forge-iron)',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(255, 107, 53, 0.2)'
            }}>
               <div className="flame-anim" style={{ position: 'absolute', bottom: '-20px', left: '0', width: '100%', height: '100px', background: 'var(--heat-hot)', filter: 'blur(20px)' }}></div>
               <div style={{ position: 'absolute', inset: 0, padding: '16px', color: 'var(--heat-forged)', fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}>
                 &gt; 正在分离杂质...<br/>
                 &gt; 提取核心论点...<br/>
                 &gt; 发现高纯度知识点...
               </div>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--forge-charcoal)', border: '1px solid var(--heat-forged)' }}>
               <h4 style={{ color: 'var(--heat-forged)', marginBottom: '8px' }}>熔炼产物</h4>
               <ul style={{ color: 'var(--text-ember)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '20px' }}>
                 <li>核心论点 (纯度 95%)</li>
                 <li>创新发现 (纯度 82%)</li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
