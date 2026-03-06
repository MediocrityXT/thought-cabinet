import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>☁️ 云端 · 概览</h1>
        <p>Dashboard / Overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="sky-card float-anim" style={{ animationDelay: `${i * 0.5}s`, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 300, color: 'var(--sky-primary)', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--sky-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="sky-card" style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '24px' }}>今日气象预报</h2>
        <div style={{ color: 'var(--sky-text)', lineHeight: 1.8 }}>
          <p>天空晴朗，微风。适合进行深度思考与高价值的任务发掘。</p>
          <p style={{ opacity: 0.7, marginTop: '12px' }}>* 有 3 朵积雨云 (待处理项) 正在靠近，建议提前凝结。</p>
        </div>
      </div>
    </div>
  );
}
