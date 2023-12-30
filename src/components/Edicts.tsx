import { FaX } from 'react-icons/fa6'
import { edicts } from '../rules/edicts'

import { InstanceProps } from 'react-modal-promise'
import { TextColor } from '../themes'
import { getEdictUrl } from '../utils'

interface EdictsProps extends InstanceProps<number> {
  currentEdict?: number | null
}

export default function Edicts({
  isOpen,
  onResolve,
  currentEdict,
}: EdictsProps) {
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
      <div
        css={{
          background: 'url(background.jpg)',
          padding: '20px',
          borderRadius: '4px',
          width: 356,
        }}
      >
        <h2
          css={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Select Edict</span>

          <div onClick={() => onResolve()}>
            <FaX />
          </div>
        </h2>
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}
        >
          {edicts.map((edict) => (
            <img
              onClick={() => onResolve(edict.id)}
              key={edict.id}
              style={{
                width: '100%',
                boxShadow:
                  currentEdict === edict.id ? '0 0 2px 6px ' + TextColor : '',
              }}
              src={getEdictUrl(edict.id)}
              alt={edict.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
