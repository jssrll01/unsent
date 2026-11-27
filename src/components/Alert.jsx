import { RotateCw, TriangleAlert } from 'lucide-react';

export default function Alert({ message, onRetry }) {
  return (
    <div className="alert" role="alert">
      <TriangleAlert size={18} />
      <span>{message || 'Something went wrong.'}</span>
      {onRetry && (
        <button className="btn ghost" onClick={onRetry}>
          <RotateCw size={16} /> Retry
        </button>
      )}
    </div>
  );
}
