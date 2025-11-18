// src/components/ErrorState.tsx
interface ErrorStateProps {
  readonly message: string
  readonly onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <p className="error-message">{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        Reintentar
      </button>
    </div>
  )
}