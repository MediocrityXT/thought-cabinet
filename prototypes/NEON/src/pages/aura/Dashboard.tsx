import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="aura-page">
      <div className="aura-page-header">
        <h1>👁️ 灵核 · 概览</h1>
        <p>Aura Core / Dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="aura-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="glowing-orb" style={{ position: 'absolute', top: '-50px', right: '-50px', width: '100px', height: '100px', opacity: 0.2 }}></div>
            <div style={{ fontSize: '3rem', fontWeight: 300, color: 'var(--aura-cyan)', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--aura-text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="aura-card" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column' }}>
        <div className="glowing-orb" style={{ width: '150px', height: '150px', marginBottom: '24px', background: 'radial-gradient(circle, var(--aura-magenta) 0%, transparent 70%)' }}></div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '16px', color: 'var(--aura-text)' }}>能量场稳定</h2>
        <p style={{ color: 'var(--aura-text-dim)', letterSpacing: '0.1em' }}>直觉通道已开启，随时准备接收灵感。</p>
      </div>
    </div>
  );
}
