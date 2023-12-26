import { CSSObject } from '@emotion/react'
import { PropsWithChildren } from 'react'
import { TextColor } from '../ScoresView'

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
  '&:active': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
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
        ...style,
      }}
    >
      {children}
    </button>
  )
}
