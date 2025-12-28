import * as React from 'react'
import styled from 'styled-components'
import { Trash2 } from 'lucide-react';

const StyledButton = styled.button`
  background-color: dodgerblue;
  border: none;
  box-shadow: none;
  color: white;
  font-size: 1rem;
  height: 2rem;
  min-width: 5rem;
  padding: 0 1rem;
  cursor: pointer;
  &.cancel {
      background: white;
      border: 1px solid gray;
      color: gray;
    }
`

interface Props {
  cancel?: boolean
  children: string
  onClick: (e) => void
}

interface TestProps {
  onClick: (e) => void
}

export const Button: React.FC<Props> = (props) => (
  <StyledButton onClick={props.onClick} className={props.cancel ? 'cancel' : ''}>
    {props.children}
  </StyledButton>
)

export const DeleteButton: React.FC<TestProps> = (props) => (
  <button onClick={props.onClick} className="rounded bg-gray-200 p-2 transition-colors hover:bg-gray-300"
    type="button">
    <Trash2 className="size-5 text-gray-500" />
  </button>
)
