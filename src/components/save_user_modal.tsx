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
  onSave: (id: string, pw: string, mail: String) => void
  onCancel: () => void
}

export const SaveUserModal: React.FC<Props> = props => {
  const { onCancel, onSave } = props
  const [id, setId] = useState(String)
  const [pw, setPw] = useState(String)
  const [mail, setMail] = useState(String)

  return (
    <Wrapper>
      <Modal>
        <p>ユーザ登録を行います。</p>
        <p>ID・パスワード・メールアドレスを入力して「保存」ボタンを押してください。</p>
        <p>■ID</p>
        <p>
          <TitleInput
            type="text"
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
        </p>
        <p>■パスワード</p>
        <p>
          <TitleInput
            type="text"
            value={pw}
            onChange={(event) => setPw(event.target.value)}
          />
        </p>
        <p>■メールアドレス</p>
        <p>
          <TitleInput
            type="text"
            value={mail}
            onChange={(event) => setMail(event.target.value)}
          />
        </p>
        <Control>
          <Button onClick={onCancel} cancel>
            キャンセル
          </Button>
          <Button onClick={() => onSave(id, pw, mail)}>
            保存
          </Button>
        </Control>
      </Modal>
    </Wrapper>
  )
}
