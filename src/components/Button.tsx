import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'soft'

const VARIANTS: Record<Variant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  soft: 'btn-soft',
}

export function Button({
  variant = 'primary',
  full = false,
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  full?: boolean
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}) {
  const sizeCls =
    size === 'lg'
      ? 'px-6 py-4 text-base'
      : size === 'sm'
        ? 'px-4 py-2 text-sm'
        : 'px-5 py-3.5 text-[15px]'
  return (
    <button
      className={`${VARIANTS[variant]} ${sizeCls} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
