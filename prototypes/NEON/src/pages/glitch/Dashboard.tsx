import React, { useState, useEffect } from 'react';
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '../../data/mock';

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const defaultLogs = [
      '[14:32:23] Thought_#8921 imported with errors',
      '[14:28:01] Connection lost between Node_A and Node_B',
      '[14:15:47] Unexpected insight generated',
      '[13:58:12] System recovered from cognitive overload'
    ];
    setLogs(defaultLogs);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev];
        if (Math.random() > 0.7) {
          newLogs.unshift(`[${new Date().toLocaleTimeString()}] Random entropy spike detected`);
          if (newLogs.length > 8) newLogs.pop();
        }
        return newLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glitch-page">
      <div className="glitch-page-header">
        <h1 className="glitch-text" data-text="SYSTEM_STATUS">SYSTEM_STATUS</h1>
        <p style={{ color: 'var(--channel-red)', textTransform: 'uppercase' }}>Operational (With Errors) / Dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="glitch-module" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontFamily: 'Orbitron', color: 'var(--channel-magenta)', marginBottom: '8px' }}>
            23
          </div>
          <div style={{ color: 'var(--glitch-dim)', letterSpacing: '0.2em' }}>UNREAD</div>
        </div>
        <div className="glitch-module" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontFamily: 'Orbitron', color: 'var(--channel-cyan)', marginBottom: '8px' }}>
            8
          </div>
          <div style={{ color: 'var(--glitch-dim)', letterSpacing: '0.2em' }}>PROCESSING</div>
        </div>
        <div className="glitch-module" style={{ textAlign: 'center' }}>
          <div className="glitch-text" data-text="5" style={{ fontSize: '3rem', fontFamily: 'Orbitron', color: 'var(--channel-red)', marginBottom: '8px', animationDuration: '0.5s' }}>
            5
          </div>
          <div style={{ color: 'var(--channel-red)', letterSpacing: '0.2em' }}>CORRUPTED</div>
        </div>
      </div>

      <div className="glitch-module" style={{ marginBottom: '40px' }}>
        <h3 style={{ color: 'var(--channel-cyan)', marginBottom: '16px', borderBottom: '1px solid var(--glitch-muted)', paddingBottom: '8px' }}>
          RECENT_ACTIVITY_LOG
        </h3>
        <div style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.875rem', color: 'var(--glitch-bright)', lineHeight: 1.8 }}>
          {logs.map((log, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.15, color: log.includes('error') || log.includes('spike') ? 'var(--channel-red)' : 'inherit' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="glitch-module" style={{ borderLeft: '4px solid var(--channel-yellow)', background: 'rgba(255, 255, 0, 0.05)' }}>
        <div style={{ color: 'var(--channel-yellow)', fontWeight: 'bold', marginBottom: '8px' }}>⚠️ WARNING: High entropy detected in Knowledge Graph</div>
        <div style={{ color: 'var(--glitch-dim)' }}>💡 SUGGESTION: Embrace the chaos</div>
      </div>
    </div>
  );
}
