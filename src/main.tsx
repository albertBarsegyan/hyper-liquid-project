import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import App from './App.tsx';
import { WalletProvider } from '@/modules/wallet';
import { QueryProvider } from '@/providers/QueryProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryProvider>
  </StrictMode>
);
