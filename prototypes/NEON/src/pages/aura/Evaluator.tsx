import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Evaluator</h1>
        <p>Assess value and clarity.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        
        <div className="aura-card" style={{ background: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '24px', color: 'var(--aura-purple)' }}>High Impact (Do / Plan)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
               <div key={e.id} style={{ padding: '20px', borderRadius: '16px', background: 'var(--aura-bg-base)', border: '1px solid rgba(0,0,0,0.05)' }}>
                 <div style={{ fontWeight: 500, marginBottom: '8px' }}>{e.title}</div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--aura-purple)', borderRadius: '4px' }}>Value: {e.value}</span>
                   <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--aura-blue)', borderRadius: '4px' }}>Diff: {e.difficulty}</span>
                 </div>
               </div>
            ))}
          </div>
        </div>

        <div className="aura-card" style={{ background: 'var(--aura-bg-base)', border: 'none' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '24px', color: 'var(--aura-text-muted)' }}>Low Impact (Drop)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
               <div key={e.id} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(0,0,0,0.02)', opacity: 0.6 }}>
                 <div style={{ textDecoration: 'line-through', marginBottom: '8px' }}>{e.title}</div>
               </div>
            ))}
          </div>
          
          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', color: '#F43F5E', marginBottom: '12px' }}>Harsh Truth AI</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--aura-text)' }}>
              "You are overcomplicating the theme switching mechanism. Drop the idea of custom parsing engines and stick to standard CSS variables. It's a low-value sinkhole."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
