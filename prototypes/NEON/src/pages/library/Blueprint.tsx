import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>知识图谱</h1>
        <p>Knowledge Graph / Blueprint</p>
      </div>

      <div className="library-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Vintage Map Background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34l-.83.83H5.373l-.83-.83V.83l.83-.83h49.254zM53.5 58.5V1.5H6.5v57h47zM30 30c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z\' fill=\'%235c4033\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

        {/* Drawn Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <path d="M 50% 20% L 30% 50%" stroke="var(--library-wood)" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M 50% 20% L 70% 50%" stroke="var(--library-wood)" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M 30% 50% L 50% 80%" stroke="var(--library-wood)" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.5" />
          <path d="M 70% 50% L 50% 80%" stroke="var(--library-wood)" strokeWidth="2" fill="none" strokeDasharray="5,5" opacity="0.5" />
        </svg>

        {/* Book Nodes */}
        {MOCK_BLUEPRINT_NODES.map((node, index) => {
          const positions = [
            { top: '20%', left: '50%' },
            { top: '50%', left: '30%' },
            { top: '50%', left: '70%' },
            { top: '80%', left: '50%' }
          ];
          const pos = positions[index % positions.length];
          const isMastered = node.status === 'mastered';

          return (
            <div key={node.id} style={{ 
              position: 'absolute', top: pos.top, left: pos.left, 
              transform: 'translate(-50%, -50%)', zIndex: 1,
              background: 'var(--library-paper)',
              padding: '12px 24px',
              border: `2px solid ${isMastered ? 'var(--library-accent)' : 'var(--library-wood)'}`,
              borderRadius: '2px',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
              fontFamily: 'Times New Roman, serif',
              fontSize: '1.1rem',
              fontWeight: isMastered ? 'bold' : 'normal',
              color: isMastered ? 'var(--library-accent)' : 'var(--library-text)'
            }}>
              {node.label}
              {!isMastered && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--library-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>(待阅卷宗)</span>}
            </div>
          );
        })}

      </div>
    </div>
  );
}
