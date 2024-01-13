import { useNavigate } from 'react-router'
import Modal from './Modal'

interface UrlImgProps {
  url: string
  secondUrl?: string
}

export default function UrlImg({ url }: UrlImgProps) {
  const navigate = useNavigate()
  const close = () => navigate('../', { replace: true })
  return (
    <Modal isOpen={true} onClickOutside={close}>
      <img
        onClick={close}
        style={{
          width: 356,
        }}
        src={url}
        draggable={false}
      />
    </Modal>
  )
}
