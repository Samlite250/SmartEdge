import { cn } from '../../lib/utils'

export function Card({ children, className, hover, ...props }) {
  return (
    <div
      className={cn(
        'bg-card rounded-[20px] p-6 shadow-card border border-border/50',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-lg font-semibold text-text-primary', className)}>{children}</h3>
}

export function CardContent({ children, className }) {
  return <div className={cn('', className)}>{children}</div>
}
