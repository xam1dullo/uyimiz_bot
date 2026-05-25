// ─── Uyimiz Mini App — Entry Point ───
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 2 * 60 * 1000, retry: 1 } },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
