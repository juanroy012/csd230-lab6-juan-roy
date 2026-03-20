// Source - https://stackoverflow.com/a/40333120
// Posted by Akshat Gupta
// Retrieved 2026-03-19, License - CC BY-SA 3.0

import {StrictMode} from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AuthProvider from './provider/authProvider' // NEW
import './index.css'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
