import { CSSObject } from '@emotion/react'
import { PropsWithChildren } from 'react'
import { TextColor } from '../themes'

export interface ButtonProps extends PropsWithChildren {
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
}

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

export default function Button({
  children,
  onClick,
  disabled,
  style,
}: ButtonProps) {
  return (
    <button
      type="button"
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
}
