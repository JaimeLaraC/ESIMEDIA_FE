// src/components/LoadingState.tsx
interface LoadingStateProps {
  readonly message?: string
}

export default function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  )
}