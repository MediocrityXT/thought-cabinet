import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>工坊仪表板</h1>
        <p>Forge Dashboard / Status: HOT</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="forge-card heat-hot" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontFamily: 'Oswald', color: 'var(--heat-hot)' }}>850°C</div>
          <div style={{ color: 'var(--text-ash)', fontFamily: 'Share Tech Mono' }}>[炉火温度]</div>
        </div>
        {MOCK_STATS.slice(0,3).map((stat, i) => (
          <div key={i} className="forge-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Oswald', color: 'var(--text-ember)' }}>{stat.value}</div>
            <div style={{ color: 'var(--text-ash)', fontFamily: 'Share Tech Mono' }}>[{stat.label}]</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="forge-card">
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'var(--text-ember)', marginBottom: '24px', borderBottom: '2px solid var(--forge-steel)', paddingBottom: '8px' }}>
            熔炉队列 (Active Queue)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--forge-charcoal)', border: '1px solid var(--heat-hot)', borderLeft: '4px solid var(--heat-hot)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-ember)', fontWeight: 'bold' }}>React性能优化研究</span>
                <span style={{ color: 'var(--heat-hot)', fontFamily: 'Share Tech Mono' }}>[高热]</span>
              </div>
              <div style={{ height: '4px', background: 'var(--forge-iron)' }}><div style={{ width: '80%', height: '100%', background: 'var(--heat-hot)' }}></div></div>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--forge-charcoal)', border: '1px solid var(--heat-warming)', borderLeft: '4px solid var(--heat-warming)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-ember)', fontWeight: 'bold' }}>设计系统文档</span>
                <span style={{ color: 'var(--heat-warming)', fontFamily: 'Share Tech Mono' }}>[中热]</span>
              </div>
              <div style={{ height: '4px', background: 'var(--forge-iron)' }}><div style={{ width: '40%', height: '100%', background: 'var(--heat-warming)' }}></div></div>
            </div>
          </div>
        </div>

        <div className="forge-card">
          <h2 style={{ fontFamily: 'Oswald', fontSize: '1.5rem', color: 'var(--heat-forged)', marginBottom: '24px', borderBottom: '2px solid var(--forge-steel)', paddingBottom: '8px' }}>
            最近出炉 (Forged)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-ash)' }}>
            <div style={{ paddingBottom: '16px', borderBottom: '1px dashed var(--forge-steel)' }}>
              ✨ FORGE 设计方案 <br/> <span style={{ fontSize: '0.8rem', fontFamily: 'Share Tech Mono' }}>- 刚刚</span>
            </div>
            <div style={{ paddingBottom: '16px', borderBottom: '1px dashed var(--forge-steel)' }}>
              ✨ PRISM 色彩系统 <br/> <span style={{ fontSize: '0.8rem', fontFamily: 'Share Tech Mono' }}>- 2小时前</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
