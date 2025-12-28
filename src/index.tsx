import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Login } from './pages/login'
import { History } from './pages/history'
import { useStateWithStorage } from './hooks/use_state_with_storage'

const GlobalStyle = createGlobalStyle`
    body * {
      box-sizing: border-box;
    }
  `

const StorageKey = '/editor:text'

const Main: React.FC = () => {
  const [text, setText] = useStateWithStorage('', StorageKey)

  return (
    <>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path="/history">
            <History
              setData={setText}
            />
          </Route>
          <Route exact path="/login">
            <Login
            />
          </Route>
          <Redirect to="/login" path="*" />
        </Switch>
      </Router>
    </>
  )
}

render(<Main />, document.getElementById('app'))
