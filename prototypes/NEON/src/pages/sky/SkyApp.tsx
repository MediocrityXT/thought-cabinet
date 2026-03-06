import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './SkyApp.css';
import SkyLayout from './SkyLayout';
import Dashboard from './Dashboard';
import Refinery from './Refinery';
import Organizer from './Organizer';
import Evaluator from './Evaluator';
import Planner from './Planner';
import Blueprint from './Blueprint';

export default function SkyApp() {
  return (
    <Routes>
      <Route path="/" element={<SkyLayout />}>
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
