import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="epoch-page epoch-page-transition">
      <div className="epoch-page-header">
        <h1>遗址 · 认知蓝图</h1>
        <p>Site Map / Knowledge Blueprint</p>
      </div>

      <div className="epoch-modules" style={{ display: 'block' }}>
        <div className="epoch-module full">
          <div className="module-header">
            <div className="module-icon">🗺️</div>
            <div className="module-title-group">
              <h3>Site Map</h3>
              <p>Knowledge Domain Distribution</p>
            </div>
          </div>
          
          <div className="site-map" style={{ height: '500px' }}>
            <div className="map-grid"></div>
            
            {/* Draw connecting lines (Mocked as SVG) */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <path d="M 25% 20% L 50% 50%" stroke="var(--epoch-bronze)" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
              <path d="M 70% 30% L 50% 50%" stroke="var(--epoch-bronze)" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
              <path d="M 30% 65% L 50% 50%" stroke="var(--epoch-bronze)" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
              <path d="M 75% 60% L 50% 50%" stroke="var(--epoch-bronze)" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
            </svg>

            {/* Sites mapped to Mock Blueprint Nodes */}
            {MOCK_BLUEPRINT_NODES.map((node, index) => {
              const positions = [
                { top: '50%', left: '50%', icon: '🏛️' }, // Center Hub
                { top: '20%', left: '25%', icon: '📜' },
                { top: '30%', left: '70%', icon: '🏺' },
                { top: '65%', left: '30%', icon: '⛏️' },
                { top: '60%', left: '75%', icon: '🧭' },
              ];
              const pos = positions[index % positions.length];
              
              return (
                <div 
                  key={node.id}
                  className="site-marker" 
                  style={{ 
                    ...pos, 
                    transform: pos.left === '50%' ? 'translate(-50%, -50%)' : 'none',
                    background: node.status === 'mastered' ? 'var(--epoch-bronze)' : 'var(--epoch-clay)',
                    opacity: node.status === 'exploring' ? 0.6 : 1
                  }}
                >
                  {pos.icon}
                  <span className="site-label">{node.label}</span>
                </div>
              );
            })}
            
            {/* Fog of war / Unexplored area mock */}
            <div className="site-marker" style={{ top: '80%', left: '50%', transform: 'translate(-50%, -50%)', background: 'transparent', border: '2px dashed var(--epoch-faded)', opacity: 0.5 }}>
               ?
               <span className="site-label" style={{ background: 'transparent', border: 'none', color: 'var(--epoch-faded)' }}>未探索的深渊</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
