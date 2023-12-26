import { InstanceProps } from 'react-modal-promise'
import { getEdictUrl } from '../utils'

interface EdictProps extends InstanceProps<void> {
  edictId: number
}

export default function Edict({ isOpen, onResolve, edictId }: EdictProps) {
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
    >
      <div>
        <img
          style={{
            width: 356,
          }}
          src={getEdictUrl(edictId)}
          alt="edict"
          onClick={() => onResolve()}
        />
      </div>
    </div>
  )
}
