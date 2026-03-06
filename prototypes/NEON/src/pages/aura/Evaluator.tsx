import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>⚖️ 共振 · 评估局</h1>
        <p>Resonance / Evaluator</p>
      </div>

      <div className="aura-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{ color: 'var(--aura-text-dim)', marginBottom: '40px', letterSpacing: '0.1em' }}>感知事务的能量层级。摒弃消耗你的，留存滋养你的。</p>

        <div style={{ width: '100%', display: 'flex', gap: '40px' }}>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--aura-cyan)', marginBottom: '24px', textAlign: 'center', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '12px' }}>高频共振 (Do / Plan)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
                 <div key={e.id} style={{ padding: '16px', background: 'rgba(0,240,255,0.05)', borderLeft: '2px solid var(--aura-cyan)', borderRadius: '0 8px 8px 0' }}>
                   {e.title}
                 </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--aura-text-dim)', marginBottom: '24px', textAlign: 'center', borderBottom: '1px solid rgba(154,134,181,0.3)', paddingBottom: '12px' }}>能量消耗 (Drop)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
                 <div key={e.id} style={{ padding: '16px', background: 'rgba(154,134,181,0.05)', borderLeft: '2px solid var(--aura-text-dim)', borderRadius: '0 8px 8px 0', opacity: 0.5 }}>
                   <del>{e.title}</del>
                 </div>
              ))}
            </div>
            
            <div style={{ marginTop: '40px', padding: '24px', border: '1px dashed var(--aura-magenta)', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ color: 'var(--aura-magenta)', marginBottom: '16px' }}>灵体警告 (Harsh Truth)</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--aura-text-dim)' }}>
                "这个执念正在严重消耗你的能量场。放下它，或者被它吞噬。"
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
