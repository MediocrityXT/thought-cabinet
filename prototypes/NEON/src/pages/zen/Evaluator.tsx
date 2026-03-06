import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="zen-page zen-page-transition">
      <div className="zen-page-header">
        <h1>判 · 评估局</h1>
        <p>The Evaluator / Calligraphy Matrix</p>
      </div>

      <div className="zen-modules">
        <div className="zen-module wide" style={{ minHeight: '500px' }}>
          <div className="module-kanji">判</div>
          <div className="module-name">Judgment</div>
          <div className="module-desc">价值矩阵 · 断舍离的智慧</div>
          
          <div style={{ position: 'relative', height: '400px', width: '100%', marginTop: '40px' }}>
            {/* Minimalist Grid */}
            <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: 'var(--ink-mist)', opacity: 0.3 }}></div>
            <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: '1px', background: 'var(--ink-mist)', opacity: 0.3 }}></div>
            
            <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--ink-mist)' }}>高价值</div>
            <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--ink-mist)' }}>低价值</div>
            <div style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--ink-mist)' }}>易实现</div>
            <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--ink-mist)' }}>难实现</div>

            {MOCK_EVALUATIONS.map((evalItem, index) => {
              // Map mock data roughly to quadrants
              const positions = [
                { top: '30%', left: '30%' }, // High value, easy (top left)
                { top: '25%', right: '25%' }, // High value, hard (top right)
                { bottom: '20%', right: '35%' }, // Low value, hard (bottom right)
              ];
              const pos = positions[index % positions.length];
              
              return (
                <div key={evalItem.id} style={{
                  position: 'absolute',
                  ...pos,
                  padding: '12px 24px',
                  background: 'var(--ink-medium)',
                  border: '1px solid var(--ink-light)',
                  borderRadius: '4px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s'
                }} className="hover:scale-105">
                  <div style={{ fontSize: '1rem', marginBottom: '8px' }}>{evalItem.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>{evalItem.status}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="zen-module">
          <div className="module-kanji">毒</div>
          <div className="module-name">Harsh Truth</div>
          <div className="module-desc">毒舌顾问 · 一针见血</div>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '32px', 
            background: 'var(--ink-void)', 
            borderLeft: '4px solid var(--accent-seal)',
            fontFamily: 'Noto Serif JP, serif',
            fontSize: '1.25rem',
            lineHeight: 1.8,
            opacity: 0.9
          }}>
            "你这个想法市面上已经有成千上万个了。如果仅仅是想做一个‘更好用一点的备忘录’，建议立刻放弃。"
          </div>
          
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
            <button className="zen-btn" style={{ flex: 1 }}>虚心接受 (Drop)</button>
            <button className="zen-btn" style={{ flex: 1, borderColor: 'var(--accent-seal)' }}>誓死捍卫 (Plan)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
