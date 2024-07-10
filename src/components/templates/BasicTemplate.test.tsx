import { render, screen } from '@testing-library/react';
import BasicTemplate from './BasicTemplate';

// Header コンポーネントのモック
jest.mock('../../components/molecules/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Mock Header</div>;
  };
});

describe('BasicTemplate', () => {
  it('renders the header', () => {
    render(<BasicTemplate>Test Content</BasicTemplate>);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<BasicTemplate><div>Test Child Content</div></BasicTemplate>);
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<BasicTemplate>Test Content</BasicTemplate>);
    expect(container.firstChild).toHaveClass('main-container');
    expect(container.querySelector('main')).toHaveClass('content');
  });

  it('structures the layout correctly', () => {
    const { container } = render(<BasicTemplate>Test Content</BasicTemplate>);
    const mainContainer = container.firstChild;
    expect(mainContainer).toContainElement(screen.getByTestId('mock-header'));
    expect(mainContainer).toContainElement(screen.getByText('Test Content'));
  });
});