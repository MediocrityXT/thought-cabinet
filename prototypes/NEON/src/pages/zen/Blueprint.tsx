import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="zen-page zen-page-transition">
      <div className="zen-page-header">
        <h1>円 · 认知蓝图</h1>
        <p>Knowledge Blueprint / Enso Connections</p>
      </div>

      <div className="zen-modules" style={{ display: 'block' }}>
        <div className="zen-module full" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          
          <div className="enso-container" style={{ flex: 1, padding: '60px 0', flexDirection: 'column', gap: '80px' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div className="module-kanji" style={{ marginBottom: '16px' }}>円</div>
              <div className="module-name" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Enso</div>
              <div className="module-desc" style={{ fontSize: '1rem' }}>知识的圆融与连接，打破边界，形成整体。</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
              {MOCK_BLUEPRINT_NODES.map((node, index) => {
                // Different delay and dash pattern for visual variety
                const delay = index * 0.5 + 's';
                const dashoffset = node.status === 'mastered' ? '0' : (node.status === 'learning' ? '157' : '471'); // 628 is full circle
                
                return (
                  <div key={node.id} className="enso-circle">
                    <svg className="enso-svg" viewBox="0 0 200 200">
                      <circle 
                        className="enso-path" 
                        cx="100" 
                        cy="100" 
                        r="100"
                        style={{ 
                          animationDelay: delay, 
                          strokeDashoffset: node.status === 'mastered' ? 0 : 628, 
                          animation: node.status === 'mastered' ? `draw-enso 4s ease-out forwards` : 'none',
                          stroke: node.status === 'mastered' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)'
                        }}
                      />
                      {node.status !== 'mastered' && (
                         <circle 
                         className="enso-path" 
                         cx="100" 
                         cy="100" 
                         r="100"
                         style={{ 
                           strokeDashoffset: dashoffset, 
                           transition: 'stroke-dashoffset 2s ease-out',
                           stroke: node.status === 'learning' ? 'var(--paper-raw)' : 'var(--ink-mist)'
                         }}
                       />
                      )}
                    </svg>
                    <div className="enso-center">
                      <div className="enso-label" style={{ fontSize: '1rem', color: 'var(--paper-raw)', letterSpacing: '0.1em' }}>{node.label}</div>
                      <div className="enso-label" style={{ marginTop: '12px', opacity: 0.5 }}>{
                        node.status === 'mastered' ? '已掌握' : 
                        node.status === 'learning' ? '修炼中' : '未开启'
                      }</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
