import React from 'react';
import { MOCK_EVALUATIONS } from '../../data/mock';

export default function Evaluator() {
  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="SYSTEM_DIAGNOSIS">SYSTEM_DIAGNOSIS</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>Value Assessment Matrix / Evaluator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="glitch-module glitch-hover" style={{ borderLeft: '4px solid var(--channel-green)' }}>
          <h3 style={{ color: 'var(--channel-green)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>⚡ CRITICAL_SUCCESS</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>HIGH/EASY</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Do Now').map(e => (
             <div key={e.id} style={{ color: 'var(--glitch-white)' }}>&gt; {e.title}</div>
          ))}
        </div>

        <div className="glitch-module glitch-hover" style={{ borderLeft: '4px solid var(--channel-yellow)' }}>
          <h3 style={{ color: 'var(--channel-yellow)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🔧 BUG_TO_FEATURE</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>HIGH/HARD</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Plan').map(e => (
             <div key={e.id} style={{ color: 'var(--glitch-white)' }}>&gt; {e.title}</div>
          ))}
        </div>

        <div className="glitch-module glitch-hover" style={{ borderLeft: '4px solid var(--channel-cyan)' }}>
          <h3 style={{ color: 'var(--channel-cyan)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>📋 LOW_PRIORITY</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>LOW/EASY</span>
          </h3>
          <div style={{ color: 'var(--glitch-dim)' }}>[EMPTY_SET]</div>
        </div>

        <div className="glitch-module glitch-hover" style={{ borderLeft: '4px solid var(--channel-red)' }}>
          <h3 style={{ color: 'var(--channel-red)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🗑️ DEPRECATED</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>LOW/HARD</span>
          </h3>
          {MOCK_EVALUATIONS.filter(e => e.status === 'Drop').map(e => (
             <div key={e.id} style={{ color: 'var(--glitch-dim)', textDecoration: 'line-through' }}>&gt; {e.title}</div>
          ))}
        </div>
      </div>

      <div className="glitch-module" style={{ border: '2px solid var(--channel-red)', animation: 'border-glitch 4s infinite' }}>
        <h3 className="glitch-text" data-text="FATAL_ERROR_DETECTED" style={{ color: 'var(--channel-red)', marginBottom: '16px' }}>
          FATAL_ERROR_DETECTED
        </h3>
        <div style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '24px' }}>
          "This concept has already been implemented in 1,042 concurrent instances across the network. If your objective is merely marginal optimization of a note-taking application, <span style={{ color: 'var(--channel-red)', textDecoration: 'underline' }}>ABORT_PROCESS</span> immediately."
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glitch-btn" style={{ borderColor: 'var(--channel-red)', color: 'var(--channel-red)' }}>ACCEPT_TERMINATION</button>
          <button className="glitch-btn" style={{ borderColor: 'var(--channel-cyan)' }}>OVERRIDE_WARNING (PLAN)</button>
        </div>
      </div>

    </div>
  );
}
