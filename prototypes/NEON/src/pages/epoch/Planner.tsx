import React from 'react';

export default function Planner() {
  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>考察 · 指挥室</h1>
        <p>Expedition Planning / Planner</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">🧭</div>
            <div className="module-title-group">
              <h3>Expedition Planning</h3>
              <p>Active 30-min Capsules & Tactical Roadmap</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', color: 'var(--epoch-bronze-dark)', marginBottom: '16px' }}>
              准备发掘 (30分钟胶囊)
            </h2>
            <p style={{ color: 'var(--epoch-faded)', fontSize: '1.125rem', fontStyle: 'italic', marginBottom: '40px' }}>
              "每一次深挖，都需要专注与耐心。"
            </p>

            <button style={{
              background: 'linear-gradient(145deg, var(--epoch-bronze), var(--epoch-bronze-dark))',
              color: 'var(--epoch-parchment)',
              border: '2px solid var(--epoch-parchment)',
              padding: '16px 48px',
              fontSize: '1.25rem',
              fontFamily: 'Cinzel, serif',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px var(--shadow-depth)'
            }}>
              开始考察 (Start 30:00)
            </button>
            
            <div style={{ marginTop: '60px', textAlign: 'left', background: 'var(--epoch-papyrus)', padding: '32px', borderRadius: '8px', border: '1px solid var(--epoch-clay)' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', color: 'var(--epoch-bronze)', marginBottom: '24px' }}>发掘阶梯 (技能/任务)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', background: 'var(--epoch-clay)' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--epoch-seal)', border: '4px solid var(--epoch-papyrus)' }}></div>
                  <div style={{ fontSize: '1.125rem', color: 'var(--epoch-ink)', textDecoration: 'line-through', opacity: 0.5 }}>已发掘: 建立项目基建</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--epoch-bronze)', border: '4px solid var(--epoch-papyrus)' }}></div>
                  <div style={{ fontSize: '1.125rem', color: 'var(--epoch-bronze-dark)', fontWeight: 'bold' }}>当前土层: 实现 EPOCH 主题体系</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--epoch-parchment)', border: '4px solid var(--epoch-papyrus)', boxShadow: '0 0 0 2px var(--epoch-clay)' }}></div>
                  <div style={{ fontSize: '1.125rem', color: 'var(--epoch-faded)', fontStyle: 'italic' }}>未知深层: 部署并联调后端 API</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
