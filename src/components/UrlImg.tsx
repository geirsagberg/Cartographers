import { InstanceProps } from 'react-modal-promise'
import Modal from './Modal'

interface UrlImgProps extends InstanceProps<void> {
  url: string
  secondUrl?: string
}

export default function UrlImg({ isOpen, onResolve, url }: UrlImgProps) {
  return (
    <Modal isOpen={isOpen} onClickOutside={() => onResolve()}>
      <img
        onClick={() => onResolve()}
        style={{
          width: 356,
        }}
        src={url}
        draggable={false}
      />
    </Modal>
  )
}
