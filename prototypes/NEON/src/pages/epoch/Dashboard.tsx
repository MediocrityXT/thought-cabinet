import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>地层 · 概览</h1>
        <p>Stratigraphy / Dashboard</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">🏛️</div>
            <div className="module-title-group">
              <h3>Stratigraphy</h3>
              <p>Temporal Layer Analysis</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
            {MOCK_STATS.map((stat, i) => (
              <div key={i} style={{ padding: '16px', border: '1px dashed var(--epoch-bronze)', borderRadius: '4px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontFamily: 'Cinzel, serif', color: 'var(--epoch-bronze-dark)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--epoch-faded)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="strata-timeline">
            <div className="strata-layer">
              <div className="strata-date">2025年 · 表层 (近期)</div>
              <div className="strata-content">最新发掘的主题设计与系统架构研究。</div>
              <div className="strata-artifacts">
                <span className="artifact-tag">设计文档</span>
                <span className="artifact-tag">React原型</span>
              </div>
            </div>
            <div className="strata-layer">
              <div className="strata-date">2024年 · 中层 (中期)</div>
              <div className="strata-content">知识管理体系框架建立。</div>
              <div className="strata-artifacts">
                <span className="artifact-tag">思维导图</span>
                <span className="artifact-tag">概念笔记</span>
              </div>
            </div>
            <div className="strata-layer">
              <div className="strata-date">2023年 · 深层 (远古)</div>
              <div className="strata-content">早期的碎片化思考。</div>
              <div className="strata-artifacts">
                <span className="artifact-tag">未整理手稿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
