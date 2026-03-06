import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './AuraApp.css';
import AuraLayout from './AuraLayout';
import Dashboard from './Dashboard';
import Refinery from './Refinery';
import Organizer from './Organizer';
import Evaluator from './Evaluator';
import Planner from './Planner';
import Blueprint from './Blueprint';

export default function AuraApp() {
  return (
    <Routes>
      <Route path="/" element={<AuraLayout />}>
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
