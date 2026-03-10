import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="forge-page">
      <div className="forge-page-header">
        <h1>铁砧审判</h1>
        <p>The Anvil / Evaluator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        
        <div className="forge-card" style={{ borderLeft: '4px solid var(--heat-hot)' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.25rem', color: 'var(--heat-hot)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🔥 精钢 (Do / Plan)</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-ash)' }}>HIGH VALUE</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
               <div key={e.id} style={{ padding: '12px', background: 'var(--forge-charcoal)', border: '1px solid rgba(229, 62, 62, 0.3)' }}>
                 <div style={{ color: 'var(--text-ember)', fontWeight: 'bold' }}>{e.title}</div>
               </div>
            ))}
          </div>
        </div>

        <div className="forge-card" style={{ borderLeft: '4px solid var(--heat-cold)' }}>
          <h3 style={{ fontFamily: 'Oswald', fontSize: '1.25rem', color: 'var(--heat-cold)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🗑️ 矿渣 (Drop)</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-ash)' }}>LOW VALUE</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
               <div key={e.id} style={{ padding: '12px', background: 'var(--forge-charcoal)', border: '1px dashed var(--forge-steel)', opacity: 0.6 }}>
                 <div style={{ color: 'var(--text-ash)', textDecoration: 'line-through' }}>{e.title}</div>
               </div>
            ))}
          </div>
          
          <div style={{ marginTop: '32px', padding: '16px', background: 'var(--forge-charcoal)', borderLeft: '4px solid var(--forge-rust)' }}>
            <h4 style={{ color: 'var(--forge-rust)', marginBottom: '8px', fontFamily: 'Oswald' }}>工匠的忠告 (Harsh Truth)</h4>
            <p style={{ color: 'var(--text-ash)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              "这块铁已经废了。再怎么敲打也成不了气候。直接扔进废料堆，把精力留给真正的神兵利器。"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
