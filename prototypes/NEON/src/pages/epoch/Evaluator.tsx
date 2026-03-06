import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>铭文 · 评估局</h1>
        <p>Inscription Wall / Evaluator</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">📜</div>
            <div className="module-title-group">
              <h3>Inscription Wall</h3>
              <p>Important Chronicles & Judgments</p>
            </div>
          </div>
          
          <div className="inscription-scroll" style={{ maxHeight: 'none', height: 'auto', padding: '24px 0' }}>
            
            {/* Toxic VC / Harsh Truth as a special inscription */}
            <div className="inscription-item" style={{ borderLeftColor: 'var(--epoch-seal)', background: 'linear-gradient(90deg, rgba(165,42,42,0.05), transparent)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--epoch-seal)', marginBottom: '8px', letterSpacing: '0.2em', fontWeight: 'bold' }}>毒舌先知鉴言</div>
              <div className="inscription-text">"你这个想法市面上已经有成千上万个了。如果仅仅是想做一个‘更好用一点的备忘录’，建议立刻放弃。"</div>
              <div className="inscription-meta" style={{ justifyContent: 'space-between', borderTopColor: 'rgba(165,42,42,0.2)' }}>
                <span className="inscription-date">刻于 当前发掘期</span>
                <span className="inscription-seal" style={{ width: 'auto', height: 'auto', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>反驳 (Plan)</span>
              </div>
            </div>

            {MOCK_EVALUATIONS.map(item => (
              <div className="inscription-item" key={item.id}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'Cinzel, serif', color: 'var(--epoch-bronze-dark)', marginBottom: '8px' }}>
                  {item.title}
                </div>
                <div className="inscription-text" style={{ fontSize: '1rem' }}>
                  价值: {item.value} / 难度: {item.difficulty}
                </div>
                <div className="inscription-meta">
                  <span className="inscription-date">判定: {item.status}</span>
                  <span className="inscription-seal">印</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
