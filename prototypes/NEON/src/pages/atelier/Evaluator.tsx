import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>鉴定室</h1>
        <p className="ink-text">The Appraisal Room / Evaluator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left: Wood Box Style */}
        <div className="atelier-card" style={{ border: '2px solid #8B7355', background: '#Fdfbf7' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Libre Franklin', fontWeight: 600, color: 'var(--atelier-accent-main)', marginBottom: '24px', borderBottom: '1px dashed #8B7355', paddingBottom: '12px' }}>
            匠心之作 (Do / Plan)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
               <div key={e.id} style={{ padding: '16px', background: 'white', border: '1px solid var(--atelier-border)', borderRadius: '4px', boxShadow: '2px 2px 0 rgba(180,83,9,0.1)' }}>
                 <div style={{ fontFamily: 'Source Serif 4', fontWeight: 600, marginBottom: '8px' }}>{e.title}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--atelier-text-muted)', fontFamily: 'Libre Franklin' }}>难度: {e.difficulty} | 价值: {e.value}</div>
               </div>
            ))}
          </div>
        </div>

        {/* Right: Scrap Paper Style */}
        <div className="atelier-card" style={{ background: '#F5F5F0' }}>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Libre Franklin', fontWeight: 600, color: 'var(--atelier-text-muted)', marginBottom: '24px', borderBottom: '1px dashed var(--atelier-border)', paddingBottom: '12px' }}>
            废弃草图 (Drop)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.6 }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
               <div key={e.id} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--atelier-border)', borderRadius: '4px', textDecoration: 'line-through' }}>
                 {e.title}
               </div>
            ))}
          </div>
          
          <div style={{ marginTop: '40px', padding: '24px', background: 'white', borderLeft: '4px solid var(--atelier-red)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'Libre Franklin', fontWeight: 600, color: 'var(--atelier-red)', marginBottom: '12px' }}>老工匠的忠告</h3>
            <p className="ink-text" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              "不是每一块木头都适合雕刻。这块料子质地不纯，强行下刀只会浪费你的时间。"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
