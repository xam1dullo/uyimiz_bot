import { act, useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from '../Toast';

function ToastButton() {
  const { toast } = useToast();

  return (
    <button type="button" onClick={() => toast('Saved')}>
      Show toast
    </button>
  );
}

function ToastOnMount() {
  const { toast } = useToast();

  useEffect(() => {
    toast('Mounted');
  }, [toast]);

  return null;
}

describe('ToastProvider', () => {
  it('shows toast messages through the public hook and removes them after the timeout', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastButton />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }));

    expect(screen.getByText('Saved')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('announces toast messages from an aria-live region', () => {
    render(
      <ToastProvider>
        <ToastOnMount />
      </ToastProvider>,
    );

    const liveRegion = screen.getByText('Mounted').parentElement;

    expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
  });
});
