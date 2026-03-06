import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="augury-page">
      <div className="augury-page-header">
        <h1>审判 · 灵魂天平</h1>
        <p>The Judgment / Evaluator</p>
      </div>

      <div className="augury-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Fake Scales of Anubis */}
        <div style={{ position: 'relative', width: '400px', height: '200px', marginBottom: '40px' }}>
          {/* Stand */}
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '10px', height: '150px', background: 'var(--augury-gold)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '10px', background: 'var(--augury-gold)' }}></div>
          
          {/* Beam */}
          <div style={{ position: 'absolute', top: '50px', left: '10%', right: '10%', height: '4px', background: 'var(--augury-gold)', transform: 'rotate(5deg)', transition: 'transform 1s' }}>
            {/* Left Pan (Feather - Easy) */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: '60px', height: '80px', border: '2px solid var(--augury-gold)', borderTop: 'none', borderRadius: '0 0 30px 30px', transform: 'translateX(-50%)' }}>
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--augury-starlight)' }}>羽</div>
            </div>
            
            {/* Right Pan (Heart - High Value) */}
            <div style={{ position: 'absolute', right: 0, top: 0, width: '60px', height: '80px', border: '2px solid var(--augury-gold)', borderTop: 'none', borderRadius: '0 0 30px 30px', transform: 'translateX(50%)', boxShadow: '0 10px 20px rgba(212, 175, 55, 0.4)' }}>
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--augury-crimson)', textShadow: '0 0 10px var(--augury-crimson)' }}>心</div>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '40px', justifyContent: 'center' }}>
          <div style={{ flex: 1, border: '1px solid var(--augury-gold-dim)', padding: '24px', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--augury-gold)', marginBottom: '16px', textAlign: 'center' }}>值得供奉 (Do / Plan)</h3>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now' || e.status === 'Plan').map(e => (
               <div key={e.id} style={{ marginBottom: '8px', borderBottom: '1px dashed rgba(212, 175, 55, 0.2)', paddingBottom: '8px' }}>{e.title}</div>
            ))}
          </div>
          
          <div style={{ flex: 1, border: '1px solid rgba(139, 0, 0, 0.5)', padding: '24px', borderRadius: '8px', background: 'rgba(139, 0, 0, 0.05)' }}>
            <h3 style={{ color: 'var(--augury-crimson)', marginBottom: '16px', textAlign: 'center' }}>神谕裁决 (Drop)</h3>
            <div style={{ color: 'var(--augury-starlight)', fontStyle: 'italic', lineHeight: 1.6, textAlign: 'center', marginBottom: '24px' }}>
              "诸神认为你的执念毫无意义，你的心脏轻如鸿毛。<br/>建议立刻将此计划献祭。"
            </div>
            {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
               <div key={e.id} style={{ color: 'rgba(249, 245, 232, 0.5)', textDecoration: 'line-through', textAlign: 'center' }}>{e.title}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
