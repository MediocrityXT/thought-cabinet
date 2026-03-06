import React from 'react';
import { MOCK_STATS } from '../../data/mock';

export default function Dashboard() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>图书目录</h1>
        <p>Library Catalog / Dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="library-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Times New Roman, serif', color: 'var(--library-wood)', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--library-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', borderTop: '1px solid #eee', paddingTop: '8px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="library-card" style={{ marginTop: '40px', minHeight: '300px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'normal', color: 'var(--library-wood)', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>最新入库 (Recent Arrivals)</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ padding: '12px 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span>《论 AI 原型设计的工程化路径》</span>
            <span style={{ color: 'var(--library-text-muted)' }}>今日</span>
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span>《AUGURY：神性界面的隐喻系统》</span>
            <span style={{ color: 'var(--library-text-muted)' }}>昨日</span>
          </li>
          <li style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>《知识图谱的三维可视化研究》</span>
            <span style={{ color: 'var(--library-text-muted)' }}>3天前</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
