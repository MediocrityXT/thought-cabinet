import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './ZenApp.css';
import ZenLayout from './ZenLayout';
import Dashboard from './Dashboard';
import Refinery from './Refinery';
import Organizer from './Organizer';
import Evaluator from './Evaluator';
import Planner from './Planner';
import Blueprint from './Blueprint';

export default function ZenApp() {
  return (
    <Routes>
      <Route path="/" element={<ZenLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="refinery" element={<Refinery />} />
        <Route path="organizer" element={<Organizer />} />
        <Route path="evaluator" element={<Evaluator />} />
        <Route path="planner" element={<Planner />} />
        <Route path="blueprint" element={<Blueprint />} />
      </Route>
    </Routes>
  );
}
