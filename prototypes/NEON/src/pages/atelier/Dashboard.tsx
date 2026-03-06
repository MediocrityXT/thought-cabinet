import React from 'react';
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="atelier-page">
      <div className="atelier-page-header">
        <h1>工匠的工作台</h1>
        <p className="ink-text">Welcome back to the Atelier.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="atelier-card" style={{ textAlign: 'center', borderTop: '4px solid var(--atelier-accent-main)' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'Libre Franklin, sans-serif', fontWeight: 700, color: 'var(--atelier-text-dark)', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--atelier-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="atelier-card">
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Libre Franklin, sans-serif', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--atelier-border)', paddingBottom: '12px' }}>最近手稿 (Recent Drafts)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_NOTIFICATIONS.map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ color: 'var(--atelier-accent-main)' }}>✒️</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--atelier-text-dark)', marginBottom: '4px' }}>{note.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--atelier-text-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>{note.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--atelier-text-faint)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>{note.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="atelier-card" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Libre Franklin, sans-serif', fontWeight: 600, marginBottom: '16px', color: 'var(--atelier-accent-main)' }}>工匠便签</h3>
          <p className="ink-text" style={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
            "每一块木头都有它的纹理，每一个想法都有它的归宿。今天是个整理草稿的好日子。"
          </p>
        </div>
      </div>
    </div>
  );
}
