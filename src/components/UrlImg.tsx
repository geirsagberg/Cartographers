import { GameWidth } from '../themes'
import Modal from './Modal'

interface UrlImgProps {
  url: string
  close: () => void
}

export default function UrlImg({ url, close }: UrlImgProps) {
  return (
    <Modal onClickOutside={close}>
      <img
        onClick={close}
        style={{
          width: GameWidth,
        }}
        src={url}
        draggable={false}
      />
    </Modal>
  )
}
