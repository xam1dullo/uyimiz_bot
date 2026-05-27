import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FloatingSheet, SegmentedControl, SkeletonList } from '../premium';

describe('premium app components', () => {
  it('renders a segmented control as accessible radio options and reports selection changes', () => {
    const onChange = vi.fn();

    render(
      <SegmentedControl
        label="Task filter"
        value="open"
        onChange={onChange}
        options={[
          { value: 'open', label: 'Open' },
          { value: 'done', label: 'Done' },
        ]}
      />,
    );

    expect(screen.getByRole('radiogroup', { name: 'Task filter' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Open' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Done' }).getAttribute('aria-checked')).toBe('false');

    fireEvent.click(screen.getByRole('radio', { name: 'Done' }));

    expect(onChange).toHaveBeenCalledWith('done');
  });

  it('renders floating sheet content only while open and closes from visible controls', () => {
    const onClose = vi.fn();

    const { rerender } = render(
      <FloatingSheet open={false} title="Create task" onClose={onClose}>
        <p>Task form</p>
      </FloatingSheet>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(
      <FloatingSheet open title="Create task" description="Assign a family task" onClose={onClose}>
        <p>Task form</p>
      </FloatingSheet>,
    );

    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Create task' })).toBeTruthy();
    expect(screen.getByText('Assign a family task')).toBeTruthy();

    const closeButtons = screen.getAllByRole('button', { name: 'Close Create task' });

    fireEvent.click(closeButtons[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the requested number of skeleton list placeholders', () => {
    const { container } = render(<SkeletonList count={4} />);

    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(4);
  });
});
