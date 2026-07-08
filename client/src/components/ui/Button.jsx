import { cn } from '../../lib/utils'

export function Button({ children, variant = 'primary', size = 'md', className, loading, disabled, ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-button',
    secondary: 'bg-secondary text-white hover:bg-secondary-light',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-text-secondary hover:bg-background',
    danger: 'bg-danger text-white hover:bg-danger/90',
    accent: 'bg-accent text-white hover:bg-accent-light',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
