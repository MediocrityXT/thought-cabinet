import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>光谱矩阵</h1>
        <p>Spectrum Matrix / Evaluator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        
        <div className="prism-card spectrum-bg-green">
          <h3 className="spectrum-text-green" style={{ fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'Space Grotesk', display: 'flex', justifyContent: 'space-between' }}>
            <span>高能 / 易实现 (Do)</span>
            <span>🟢</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now').map(e => (
             <div key={e.id} style={{ marginBottom: '8px' }}>- {e.title}</div>
          ))}
        </div>

        <div className="prism-card spectrum-bg-red">
          <h3 className="spectrum-text-red" style={{ fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'Space Grotesk', display: 'flex', justifyContent: 'space-between' }}>
            <span>高能 / 难实现 (Plan)</span>
            <span>🔴</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Plan').map(e => (
             <div key={e.id} style={{ marginBottom: '8px' }}>- {e.title}</div>
          ))}
        </div>

        <div className="prism-card spectrum-bg-yellow">
          <h3 className="spectrum-text-yellow" style={{ fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'Space Grotesk', display: 'flex', justifyContent: 'space-between' }}>
            <span>低能 / 易实现 (Delegate)</span>
            <span>🟡</span>
          </h3>
          <div style={{ color: 'var(--text-secondary)' }}>[ 空 ]</div>
        </div>

        <div className="prism-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '16px', fontFamily: 'Space Grotesk', display: 'flex', justifyContent: 'space-between' }}>
            <span>无光区 (Drop)</span>
            <span>⚫</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
             <div key={e.id} style={{ marginBottom: '8px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>- {e.title}</div>
          ))}
        </div>

      </div>

      <div className="prism-card spectrum-bg-blue" style={{ borderLeft: '4px solid var(--spectrum-blue)' }}>
        <h3 className="spectrum-text-blue" style={{ fontSize: '1rem', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>系统建议 (System Advice)</h3>
        <p style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
          "检测到该计划位于无光区。投入精力将产生严重的能量衰减。建议立即终止并回收资源。"
        </p>
      </div>

    </div>
  );
}
