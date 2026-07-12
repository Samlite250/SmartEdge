import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          style={{ color: '#1A1D2A', WebkitTextFillColor: '#1A1D2A' }}
          className={cn(
            'w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
            Icon && 'pl-11',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
