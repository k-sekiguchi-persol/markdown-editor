import * as React from 'react'
import styled from 'styled-components'
import { Button } from './button'

const { useState } = React

const Wrapper = styled.div`
  align-items: center;
  background-color: #0002;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`

const Modal = styled.div`
  background: #fff;
  padding: 1rem;
  width: 32rem;
`

const TitleInput = styled.input`
  width: 29rem;
  padding: 0.5rem;
`

const Control = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 1rem;
`

interface Props {
  initialTitle: string
  initialUrl: string
  onDelete: (key: string) => void
  onCancel: () => void
}

export const DeleteModal: React.FC<Props> = props => {
  const { onCancel, onDelete, initialTitle, initialUrl } = props
  const [title, setTitle] = useState(initialTitle)
  const [url, setUrl] = useState(initialUrl)

  return (
    <Wrapper>
      <Modal>
        <p>以下のデータを削除します。</p>
        <p>問題無ければ「削除」ボタンを押してください。</p>
        <p>■タイトル</p>
        <p>
          <TitleInput
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled
          />
        </p>
        <p>■URL</p>
        <p>
          <TitleInput
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled
          />
        </p>
        <Control>
          <Button onClick={onCancel} cancel>
            キャンセル
          </Button>
          <Button onClick={() => onDelete(url)}>
            削除
          </Button>
        </Control>
      </Modal>
    </Wrapper>
  )
}
