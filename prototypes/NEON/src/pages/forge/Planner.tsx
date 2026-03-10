import React, { useState } from 'react';

export default function Planner() {
  const [isForging, setIsForging] = useState(false);

  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>锻造日程</h1>
        <p>Execution Schedule / Planner</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Active Timer */}
        <div className="forge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'var(--text-ash)', marginBottom: '40px' }}>[ 专注锻造模式 ]</h2>
          
          <div style={{ 
            width: '240px', height: '240px', 
            borderRadius: '50%', background: 'var(--forge-charcoal)',
            border: `8px solid ${isForging ? 'var(--heat-hot)' : 'var(--forge-steel)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isForging ? 'inset 0 0 40px rgba(229, 62, 62, 0.4), 0 0 40px rgba(229, 62, 62, 0.2)' : 'inset 0 0 20px #000',
            transition: 'all 0.5s ease', position: 'relative'
          }}>
            {isForging && <div className="flame-anim" style={{ position: 'absolute', bottom: '0', width: '100%', height: '50%', background: 'var(--heat-hot)', filter: 'blur(30px)', opacity: 0.5, borderRadius: '0 0 120px 120px' }}></div>}
            
            <div style={{ fontSize: '4rem', fontFamily: 'Share Tech Mono', color: isForging ? 'var(--text-ember)' : 'var(--text-ash)', zIndex: 1 }}>
              {isForging ? '29:59' : '30:00'}
            </div>
          </div>

          <button 
            className={`forge-btn ${isForging ? '' : 'forge-btn-hot'}`}
            style={{ marginTop: '40px', width: '200px' }}
            onClick={() => setIsForging(!isForging)}
          >
            {isForging ? '停止锻打 (STOP)' : '拉起风箱 (START)'}
          </button>
        </div>

        {/* Schedule */}
        <div className="forge-card">
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'var(--text-ember)', marginBottom: '24px', borderBottom: '2px solid var(--forge-steel)', paddingBottom: '8px' }}>
            今日工单
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Share Tech Mono' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.5 }}>
              <div style={{ color: 'var(--text-ash)' }}>06:00</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--forge-steel)' }}></div>
              <div style={{ color: 'var(--text-ash)' }}>预热炉火</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: 'var(--heat-hot)', fontWeight: 'bold' }}>08:00</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--heat-hot)' }}></div>
              <div style={{ color: 'var(--text-ember)', background: 'var(--heat-hot)', padding: '4px 8px', borderRadius: '2px' }}>
                高温锻造: FORGE 主题开发
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: 'var(--heat-quenched)' }}>12:00</div>
              <div style={{ flex: 1, height: '2px', background: 'var(--heat-quenched)', strokeDasharray: '4,4' }}></div>
              <div style={{ color: 'var(--heat-quenched)' }}>淬火冷却 / 休息</div>
            </div>
          </div>

          <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--forge-steel)' }}>
             <h3 style={{ color: 'var(--heat-forged)', marginBottom: '8px', fontFamily: 'Oswald' }}>⚙️ 技能台 (Skill Tree)</h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-ash)' }}>
               <span>■</span> <span style={{ textDecoration: 'line-through' }}>设计系统架构</span> <span style={{ color: 'var(--heat-forged)' }}>[OK]</span>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-ember)', marginTop: '8px' }}>
               <span style={{ color: 'var(--heat-hot)' }}>▶</span> <span>实现所有主题组件</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
