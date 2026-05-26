import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <section className="empty-state hero-card">
          <div className="icon icon-red icon-large">⚠</div>
          <h1>Xatolik yuz berdi</h1>
          <p>{this.state.error?.message ?? "Noma'lum xatolik"}</p>
          <button className="button primary" onClick={() => window.location.reload()}>Qayta yuklash</button>
        </section>
      );
    }
    return this.props.children;
  }
}
