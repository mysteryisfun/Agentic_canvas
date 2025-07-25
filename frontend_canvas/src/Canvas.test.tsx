import { render, screen } from '@testing-library/react';
import UnifiedCanvas from './UnifiedCanvas';
import { test, expect } from 'vitest';

test('renders UnifiedCanvas', () => {
  render(<UnifiedCanvas />);
  const button3D = screen.getByText('3D');
  const button2D = screen.getByText('2D');
  expect(button3D).toBeInTheDocument();
  expect(button2D).toBeInTheDocument();
});