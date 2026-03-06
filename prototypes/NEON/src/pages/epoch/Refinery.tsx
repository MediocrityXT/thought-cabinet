import React from 'react';
import { MOCK_PROJECTS } from '../../data/mock';

export default function Refinery() {
  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>冶炼 · 文物库</h1>
        <p>Artifact Vault / Refinery</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">🏺</div>
            <div className="module-title-group">
              <h3>Artifact Vault</h3>
              <p>Treasured Ideas Collection & Refinement</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '32px', textAlign: 'center', background: 'var(--epoch-sand)', padding: '16px', borderRadius: '4px', border: '1px dashed var(--epoch-bronze)' }}>
            <p style={{ color: 'var(--epoch-bronze-dark)', marginBottom: '8px' }}>将原始信息萃取为珍贵文物</p>
            <input 
              type="text" 
              placeholder="置入文献 (URL / 文本) ..." 
              style={{
                width: '60%',
                padding: '12px',
                background: 'var(--epoch-parchment)',
                border: '2px solid var(--epoch-clay)',
                borderRadius: '4px',
                fontFamily: 'Crimson Text, serif',
                fontSize: '1.125rem'
              }}
            />
          </div>

          <div className="vault-grid">
            {MOCK_PROJECTS.slice(0, 4).map((project, index) => (
              <div className="artifact-card" key={project.id}>
                <span className="artifact-number">NO.00{index + 1}</span>
                <div className="artifact-icon">💎</div>
                <div className="artifact-name">{project.name}</div>
                <div className="artifact-era">2025年出土 · {project.category}</div>
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--epoch-faded)', opacity: 0.8 }}>
                  {project.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
