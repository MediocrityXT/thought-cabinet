import React from 'react';
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>Overview</h1>
        <p>Your digital atmosphere is clear today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="aura-card" style={{ padding: '32px' }}>
            <div style={{ color: 'var(--aura-text-muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '16px' }}>{stat.label}</div>
            <div style={{ 
              fontSize: '3rem', fontWeight: 300, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--aura-purple) 0%, var(--aura-pink) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="aura-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '24px' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {MOCK_NOTIFICATIONS.map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '16px', borderBottom: i !== MOCK_NOTIFICATIONS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: note.read ? 'var(--aura-text-muted)' : 'var(--aura-blue)', marginTop: '8px' }}></div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--aura-text)', marginBottom: '4px' }}>{note.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--aura-text-muted)', lineHeight: 1.5 }}>{note.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--aura-text-muted)', marginTop: '8px', opacity: 0.7 }}>{note.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="aura-card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '24px' }}>Focus Time</h2>
           <p style={{ color: 'var(--aura-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
             You have 30 minutes available. The environment is optimal for deep work.
           </p>
           <button className="aura-btn" style={{ width: '100%' }}>Enter Flow State</button>
        </div>
      </div>
    </div>
  );
}
