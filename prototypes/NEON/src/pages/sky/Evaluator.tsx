import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="sky-page">
      <div className="sky-page-header">
        <h1>🌤️ 气象 · 评估局</h1>
        <p>Weather Forecast / Evaluator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        
        <div className="sky-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ☀️ 晴空万里 (高价值/易实现)
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now').map(e => (
            <div key={e.id} style={{ marginBottom: '8px' }}>{e.title}</div>
          ))}
        </div>

        <div className="sky-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⛅ 多云转晴 (高价值/难实现)
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Plan').map(e => (
            <div key={e.id} style={{ marginBottom: '8px' }}>{e.title}</div>
          ))}
        </div>

        <div className="sky-card" style={{ borderLeft: '4px solid #94a3b8' }}>
          <h3 style={{ color: '#94a3b8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ☁️ 阴天 (低价值/易实现)
          </h3>
          <div style={{ color: 'var(--sky-text-muted)' }}>无事项</div>
        </div>

        <div className="sky-card" style={{ borderLeft: '4px solid #64748b' }}>
          <h3 style={{ color: '#64748b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⛈️ 雷阵雨 (低价值/难实现)
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
            <div key={e.id} style={{ marginBottom: '8px', opacity: 0.5, textDecoration: 'line-through' }}>{e.title}</div>
          ))}
        </div>

      </div>

      <div className="sky-card">
        <h3 style={{ color: 'var(--sky-primary)', marginBottom: '16px' }}>风向标建议</h3>
        <p style={{ lineHeight: 1.8, opacity: 0.8 }}>
          "与其在雷暴中挣扎，不如退回港湾。放弃那些沉重的执念，让思维的云朵自然散去。"
        </p>
      </div>

    </div>
  );
}
