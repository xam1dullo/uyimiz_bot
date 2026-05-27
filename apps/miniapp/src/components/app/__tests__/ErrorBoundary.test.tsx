import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

function BrokenChild(): never {
  throw new Error('Kaboom');
}

describe('ErrorBoundary', () => {
  it('renders the default recovery UI when a child crashes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'Xatolik yuz berdi' })).toBeTruthy();
    expect(screen.getByText('Kaboom')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Qayta yuklash' })).toBeTruthy();
  });
});
