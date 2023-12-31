import { PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClickOutside?: () => void
}

export default function Modal({
  children,
  isOpen,
  onClickOutside,
}: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      css={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClickOutside?.()
        }
      }}
    >
      {children}
    </div>
  )
}
