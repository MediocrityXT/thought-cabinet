import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>价值批注</h1>
        <p>Annotations / Evaluator</p>
      </div>

      <div className="library-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Mocking a book index style */}
        <div>
          <h3 style={{ color: 'var(--library-wood)', borderBottom: '2px solid var(--library-wood)', paddingBottom: '8px', marginBottom: '16px' }}>第一卷：核心议题 (Do / Plan)</h3>
          <ul style={{ listStyleType: 'decimal', paddingLeft: '24px', lineHeight: 2 }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
               <li key={e.id}>
                 <span style={{ fontWeight: 'bold' }}>{e.title}</span> 
                 <span style={{ color: 'var(--library-text-muted)', fontStyle: 'italic', marginLeft: '8px' }}>— 优先级 {e.status === 'Do Now' ? '极高' : '高'}</span>
               </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{ color: 'var(--library-text-muted)', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px' }}>附录：已废弃卷宗 (Drop)</h3>
          <ul style={{ listStyleType: 'circle', paddingLeft: '24px', lineHeight: 2, opacity: 0.6 }}>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
               <li key={e.id}>
                 <del>{e.title}</del>
               </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '24px', padding: '24px', background: '#fdfbf7', border: '1px solid var(--library-wood)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '24px', background: '#fdfbf7', padding: '0 8px', color: 'var(--library-accent)', fontStyle: 'italic' }}>馆长批注 (Review)</div>
          <p style={{ fontFamily: 'Georgia, serif', lineHeight: 1.8, color: 'var(--library-text)' }}>
            "学术的严谨在于知道哪些论题不值得深入。此案已有前人详述，不具备研究价值，建议归档。"
          </p>
        </div>

      </div>
    </div>
  );
}
