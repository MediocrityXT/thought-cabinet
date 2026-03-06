import React, { useState, useEffect } from 'react';

export default function Planner() {
  return (
    <div className="library-page">
      <div className="library-page-header">
        <h1>沙漏与座钟</h1>
        <p>Timepiece / Planner</p>
      </div>

      <div className="library-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '500px' }}>
        
        <p style={{ fontStyle: 'italic', color: 'var(--library-text-muted)', marginBottom: '40px' }}>翻转沙漏，沉浸在一段不被打扰的学术时光中。</p>
        
        {/* Mock vintage clock/hourglass */}
        <div style={{
          width: '200px', height: '200px',
          border: '10px solid var(--library-wood)',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.2)',
          background: '#fdfbf7',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '3rem', fontFamily: 'Times New Roman, serif', color: 'var(--library-text)' }}>
            25:00
          </div>
          {/* Hands */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '80px', background: 'var(--library-accent)', transformOrigin: 'bottom center', transform: 'translate(-50%, -100%) rotate(0deg)' }}></div>
        </div>

        <button className="library-btn" style={{ fontSize: '1.25rem', padding: '12px 40px' }}>开始研读 (Start)</button>

        <div style={{ width: '100%', marginTop: '60px', borderTop: '1px dashed #ccc', paddingTop: '40px' }}>
          <h3 style={{ color: 'var(--library-wood)', marginBottom: '16px' }}>当前研究课题</h3>
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid #ddd', fontFamily: 'Times New Roman, serif', fontSize: '1.25rem' }}>
            <span style={{ color: 'var(--library-accent)', marginRight: '8px' }}>[进行中]</span>
            系统性梳理 LIBRARY 主题的设计规范
          </div>
        </div>

      </div>
    </div>
  );
}
