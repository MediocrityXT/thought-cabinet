import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>观星 · 天宫图</h1>
        <p>Astrolabe / Dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="augury-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Cinzel Decorative, serif', color: 'var(--augury-gold)', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--augury-gold-dim)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="augury-card" style={{ marginTop: '40px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Fake Astrolabe */}
        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 40px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--augury-gold)', borderRadius: '50%', opacity: 0.3, animation: 'spin 20s linear infinite' }}></div>
          <div style={{ position: 'absolute', inset: '20px', border: '1px dashed var(--augury-gold-dim)', borderRadius: '50%', animation: 'spin 30s linear infinite reverse' }}></div>
          <div style={{ position: 'absolute', inset: '60px', border: '1px solid var(--augury-mystic-blue)', borderRadius: '50%', opacity: 0.5, animation: 'spin 15s linear infinite' }}></div>
          
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', animation: 'spin 60s linear infinite' }}>
            <polygon points="150,20 280,225 20,225" fill="none" stroke="var(--augury-gold)" strokeWidth="1" opacity="0.4" />
            <polygon points="150,280 20,75 280,75" fill="none" stroke="var(--augury-gold)" strokeWidth="1" opacity="0.4" />
          </svg>

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', background: 'var(--augury-gold)', borderRadius: '50%', boxShadow: '0 0 20px var(--augury-gold)' }}></div>
        </div>

        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

        <h2 style={{ fontSize: '1.5rem', fontFamily: 'Cinzel Decorative, serif', color: 'var(--augury-starlight)', marginBottom: '16px' }}>星辰已就位</h2>
        <p style={{ color: 'var(--augury-gold-dim)', fontStyle: 'italic', letterSpacing: '0.1em' }}>今日星象适宜：深入冥想与知识精炼。</p>
      </div>
    </div>
  );
}
