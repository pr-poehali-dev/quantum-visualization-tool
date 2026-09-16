import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { captureUtmFromUrl } from './lib/utm'

captureUtmFromUrl()

createRoot(document.getElementById("root")!).render(<App />);