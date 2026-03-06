import React from 'react';
import { MOCK_BLUEPRINT_NODES } from '../../data/mock';

export default function Blueprint() {
  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>生命树 · 认知蓝图</h1>
        <p>Tree of Life / Blueprint</p>
      </div>

      <div className="augury-card" style={{ minHeight: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <p style={{ color: 'var(--augury-gold-dim)', fontStyle: 'italic', letterSpacing: '0.1em', marginBottom: '60px' }}>
          "知识的升阶，如同攀登卡巴拉生命之树。"
        </p>

        <div style={{ position: 'relative', width: '300px', height: '500px' }}>
          
          {/* Paths (Connections) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
            {/* Crown to Wisdom */}
            <line x1="50%" y1="10%" x2="20%" y2="30%" stroke="var(--augury-gold-dim)" strokeWidth="2" opacity="0.4" />
            {/* Crown to Understanding */}
            <line x1="50%" y1="10%" x2="80%" y2="30%" stroke="var(--augury-gold-dim)" strokeWidth="2" opacity="0.4" />
            {/* Wisdom to Understanding */}
            <line x1="20%" y1="30%" x2="80%" y2="30%" stroke="var(--augury-gold-dim)" strokeWidth="2" opacity="0.4" />
            {/* Wisdom to Beauty */}
            <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="var(--augury-gold)" strokeWidth="2" strokeDasharray="5,5" />
            {/* Understanding to Beauty */}
            <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="var(--augury-gold-dim)" strokeWidth="2" opacity="0.4" />
            {/* Beauty to Foundation */}
            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="var(--augury-gold)" strokeWidth="2" />
          </svg>

          {/* Sephiroth (Nodes) */}
          {MOCK_BLUEPRINT_NODES.map((node, index) => {
            const positions = [
              { top: '10%', left: '50%', size: '60px', name: 'Kether' }, // Crown
              { top: '30%', left: '20%', size: '40px', name: 'Chokhmah' }, // Wisdom
              { top: '30%', left: '80%', size: '40px', name: 'Binah' }, // Understanding
              { top: '50%', left: '50%', size: '50px', name: 'Tiferet' }, // Beauty
              { top: '80%', left: '50%', size: '40px', name: 'Yesod' }  // Foundation
            ];
            
            const pos = positions[index % positions.length];
            const isMastered = node.status === 'mastered';
            
            return (
              <div key={node.id} style={{ 
                position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1
              }}>
                <div style={{
                  width: pos.size, height: pos.size,
                  background: isMastered ? 'radial-gradient(circle, var(--augury-starlight) 0%, var(--augury-gold) 100%)' : 'var(--augury-night)',
                  border: `2px solid ${isMastered ? 'var(--augury-starlight)' : 'var(--augury-gold-dim)'}`,
                  borderRadius: '50%',
                  boxShadow: isMastered ? '0 0 30px var(--augury-gold)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.3s'
                }} className="hover:scale-110">
                  {isMastered && <span style={{ color: 'var(--augury-void)', fontSize: '0.8rem' }}>✦</span>}
                </div>
                <div style={{ 
                  marginTop: '12px', fontSize: '0.75rem', fontFamily: 'Cinzel Decorative, serif',
                  color: isMastered ? 'var(--augury-gold)' : 'var(--augury-gold-dim)',
                  textShadow: isMastered ? '0 0 5px var(--augury-gold)' : 'none',
                  textAlign: 'center', background: 'var(--augury-void)', padding: '2px 8px', borderRadius: '4px'
                }}>
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
