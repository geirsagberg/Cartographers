import { InstanceProps } from 'react-modal-promise'

interface UrlImgProps extends InstanceProps<void> {
  url: string
}

export default function UrlImg({ isOpen, onResolve, url }: UrlImgProps) {
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
      onClick={() => onResolve()}
    >
      <img
        style={{
          width: 356,
        }}
        src={url}
      />
    </div>
  )
}
