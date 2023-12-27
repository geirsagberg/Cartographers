import { CSSObject } from '@emotion/react'
import { PropsWithChildren, forwardRef } from 'react'
import { TextColor } from '../themes'

const buttonStyle: CSSObject = {
  backgroundColor: 'transparent',
  border: '2px solid ' + TextColor,
  padding: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:active:not(:disabled)': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  color: TextColor,
}

export interface ButtonProps extends PropsWithChildren {
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, onClick, disabled, style, type = 'button' }: ButtonProps,
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      css={{
        ...buttonStyle,
        ...(disabled ? { opacity: 0.5 } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  )
})
