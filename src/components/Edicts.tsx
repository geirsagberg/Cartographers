import { FaX } from 'react-icons/fa6'
import { edicts } from '../rules'

import { InstanceProps } from 'react-modal-promise'

interface EdictsProps extends InstanceProps<number> {}

export default function Edicts({ isOpen, onResolve }: EdictsProps) {
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
              }}
              src={`https://www.happymeeple.com/img/CTG/scoring/${edict.id}.jpg`}
              alt={edict.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
