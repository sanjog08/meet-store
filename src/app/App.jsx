import { Toaster } from 'react-hot-toast';
import QueryProvider from './providers/QueryProvider';
import AppRouter from './router';

const App = () => (
  <QueryProvider>
    <AppRouter />
    <Toaster
      position="bottom-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-sans)',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: 'var(--bg-elevated)' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: 'var(--bg-elevated)' },
        },
      }}
    />
  </QueryProvider>
);

export default App;
