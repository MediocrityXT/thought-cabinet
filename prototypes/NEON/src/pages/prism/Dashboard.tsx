import React from 'react';
import { MOCK_STATS, MOCK_NOTIFICATIONS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="prism-page">
      <div className="prism-page-header">
        <h1>全景光谱</h1>
        <p>Spectrum Dashboard / Overview</p>
      </div>

      {/* Spectrum Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { label: '紧急', val: 12, color: 'red' },
          { label: '创意', val: 24, color: 'orange' },
          { label: '知识', val: 45, color: 'yellow' },
          { label: '完成', val: 89, color: 'green' },
          { label: '思考', val: 32, color: 'blue' },
          { label: '连接', val: 18, color: 'purple' },
        ].map((item, i) => (
          <div key={i} className={`prism-card spectrum-bg-${item.color}`} style={{ padding: '16px', textAlign: 'center' }}>
            <div className={`spectrum-text-${item.color}`} style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '4px' }}>{item.val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Spectrum Bar */}
        <div className="prism-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', marginBottom: '24px' }}>当前认知光谱分布</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
               { color: 'red', name: '高能/紧急', percent: '15%' },
               { color: 'orange', name: '发散/创意', percent: '20%' },
               { color: 'yellow', name: '沉淀/知识', percent: '35%' },
               { color: 'green', name: '结晶/完成', percent: '10%' },
               { color: 'blue', name: '深潜/思考', percent: '15%' },
               { color: 'purple', name: '网状/连接', percent: '5%' }
            ].map((bar, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bar.name}</span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: bar.percent, height: '100%', background: `var(--spectrum-${bar.color})`, boxShadow: `0 0 10px var(--spectrum-${bar.color})` }}></div>
                </div>
                <span className={`spectrum-text-${bar.color}`} style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontFamily: 'JetBrains Mono' }}>{bar.percent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Activity */}
        <div className="prism-card">
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', marginBottom: '24px', color: 'var(--spectrum-red)' }}>光谱警报</h3>
          <div style={{ padding: '16px', background: 'rgba(255, 77, 77, 0.1)', borderLeft: '4px solid var(--spectrum-red)', borderRadius: '4px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>"你的紫色光谱（连接）偏低，当前知识存在碎片化孤岛，建议进入蓝图视图建立联系。"</div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Space Grotesk', marginBottom: '16px' }}>最新折射</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_NOTIFICATIONS.slice(0,3).map((note, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{note.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{note.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
