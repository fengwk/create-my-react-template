import 'reset-css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Pages from './pages';
import './index.css';

// access http://localhost:9090#/demo
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Pages />);
