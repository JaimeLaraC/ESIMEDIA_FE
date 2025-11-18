import '../styles/customcomponents/ProgressIndicator.css'

interface ProgressIndicatorProps {
  readonly currentStep: number
  readonly totalSteps: number
  readonly stepTitles: readonly string[]
}

export default function ProgressIndicator({ currentStep, totalSteps, stepTitles }: ProgressIndicatorProps) {
  return (
    <div className="progress-indicator">
      <div className="steps-container">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          return (
            <div key={stepNumber} className="step-item">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <div className="step-title">
                {stepTitles[index]}
              </div>
              {stepNumber < totalSteps && <div className="step-line" />}
            </div>
          )
        })}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}