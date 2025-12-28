import { useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useHistory } from "react-router-dom";
import './login.css';
import * as React from "react";
import axios from 'axios';
import { Header } from '../components/header';
import styled from 'styled-components'
import { Button } from "../components/button";
import { SaveUserModal } from '../components/save_user_modal';
import { registUser } from '../indexeddb/memos'

const HeaderArea = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
  `

//型宣言
type Inputs = {
  username: string;
  password: string;
}

interface Props {
  //setData: (url: string) => void
}

export const Login: React.FC<Props> = (props) => {
  const history = useHistory();
  //errorMsg という名前のstate関数を宣言、初期値 null をセット
  const [errorMsg, setErrorMsg] = useState("")
  const [showSaveModal, setShowSaveModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    mode: 'onChange',
  });

  //ログインボタンを押した際の処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    //if (data.username === "user" && data.password === "password") {  //仮ID・パスワード
    const ss = await isLogin(data.username, data.password);
    console.log(ss);
    if (ss == 'ok') {  //仮ID・パスワード
      console.log("ログイン成功aaaaa")
      // ユーザIDを保存
      sessionStorage.setItem("userId", data.username);
      loginSuccess();
    } else {
      console.log("ログイン失敗aaaaa")
      loginErrorMsg();
    }
    reset();
  };

  const isLogin = async (id: String, pass: String): Promise<String> => {
    var result = "";
    await axios.get("http://localhost:8081/getUserInfo", {
      params: {
        userId: id,
        password: pass
      }
    }).then((response) => {
      console.log("ログイン成功")
      console.log(response.data)
      result = "ok";

    }).catch((response) => {
      console.log("ログイン失敗")
      result = "ng";
    });
    return result;

  }

  //ログインに成功した場合、次のページへ遷移
  const loginSuccess = () => {
    history.push("./history")
  }

  //ログインに失敗した場合のエラーメッセージをセット
  const loginErrorMsg = () => {
    //setErrorMsg()でerrorMsgの値を更新
    setErrorMsg("ユーザーIDもしくはパスワードが間違っています。");
  }

  //入力内容をクリア
  const clearForm = () => {
    reset();
  }

  return (
    <><HeaderArea>
      <Header title="">
        <Button onClick={() => setShowSaveModal(true)}>
          URLを登録する
        </Button>
        {/*<Link to="/editor">
      エディタに戻る
    </Link>*/}
      </Header>
    </HeaderArea><div className="formContainer">
        {showSaveModal && (
          <SaveUserModal
            onSave={(title: string, url: string, mail: string): void => {
              registUser(title, url, mail)
              setShowSaveModal(false)
            }}
            onCancel={() => setShowSaveModal(false)}
          />
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>ログイン</h1>
          <hr />
          <div className='uiForm'>
            <p className="errorMsg">{errorMsg}</p>
            <div className='formField'>
              <label htmlFor="userID">ユーザーID</label>
              <input
                id="userID"
                type="text"
                placeholder='userID'
                {...register('username', {
                  required: 'ユーザーIDを入力してください。',
                  maxLength: {
                    value: 15,
                    message: '15文字以内で入力してください。'
                  },
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/i,
                    message: 'ユーザーIDの形式が不正です。',
                  },
                })} />
            </div>
            <ErrorMessage errors={errors} name="username" render={({ message }) => <span>{message}</span>} />
            <div className='formField'>
              <label htmlFor="password">パスワード</label>
              <input
                id="password"
                type="password"
                placeholder='password'
                role='password'
                {...register('password', {
                  required: 'パスワードを入力してください。',
                  minLength: {
                    value: 8,
                    message: '8~24文字以内で入力してください',
                  },
                  maxLength: {
                    value: 24,
                    message: '8~24文字以内で入力してください',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!@#$%^&*()\\\\-_+=]+$/i,
                    message: 'パスワードの形式が不正です。',
                  },
                })} />
            </div>
            <ErrorMessage errors={errors} name="password" render={({ message }) => <span>{message}</span>} />
            <div className="loginButton">
              <button
                type="submit"
                className="submitButton"
              >ログイン
              </button>
              <button
                type="button"
                className="clearButton"
                onClick={clearForm}
              >クリア
              </button>
            </div>
          </div>
        </form>
      </div></>
  );
}
