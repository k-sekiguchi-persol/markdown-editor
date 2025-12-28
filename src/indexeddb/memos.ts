import Dexie from 'dexie';
import axios from 'axios';
// import { useHistory } from "react-router-dom";

export interface MemoRecord {
  datetime: string
  title: string
  url: string
}

export interface PageInfo {
  userId: string
  pageTitle: string
  pageUrl: string
  pageHash: string
  updFlg: string
}

const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' })
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')
// const history = useHistory();

export const registUser = async (id: string, pw: string, mail: string): Promise<void> => {
  axios.post("http://localhost:8081/registUserInfo", {
    userId: id,
    password: pw,
    eMailAddress: mail
  }).then(response => {
    console.log(response.data)
  })
}

export const putMemo = async (title: string, url: string): Promise<void> => {
  // セッションからユーザIDを取得
  const sessionUserId = sessionStorage.getItem("userId");
  console.log("session:" + sessionUserId)
  // セッションなかったらログイン画面に戻す
  // if (sessionUserId == null) {
  //   history.push("./history")
  // }
  axios.post("http://localhost:8081/savePageInfo", {
    userId: sessionUserId,
    pageTitle: title,
    pageUrl: url
  }).then(response => {
    console.log("保存完了")
    console.log(response.data)
  })
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
  const totalCount = await memos.count()
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
  return pageCount > 0 ? pageCount : 1
}

export const getMemos = async (page: number): Promise<MemoRecord[]> => {
  // セッションからユーザIDを取得
  const sessionUserId = sessionStorage.getItem("userId");
  console.log("session:" + sessionUserId)

  // ページ情報をAPIから取得
  axios.get("http://localhost:8081/getPageInfos", {
    params: {
      userId: sessionUserId
    }
  }).then(response => {
    //console.log(response.data)
    // return response.data

  })
  await memos.delete("")

  const offset = (page - 1) * NUM_PER_PAGE
  console.log(memos.orderBy('datetime')
    .reverse()
    .offset(offset)
    .limit(NUM_PER_PAGE)
    .toArray())
  return memos.orderBy('datetime')
    .reverse()
    .offset(offset)
    .limit(NUM_PER_PAGE)
    .toArray()
}

export const getPageInfos = async (page: number): Promise<PageInfo[]> => {
  // セッションからユーザIDを取得
  const sessionUserId = sessionStorage.getItem("userId");
  console.log("session:" + sessionUserId)

  // ページ情報をAPIから取得
  const response = await axios.get<PageInfo[]>("http://localhost:8081/getPageInfos", {
    params: {
      userId: sessionUserId
    }
  });
  console.log("レスポンス")
  console.log(response.data.length)
  if (response.data.length == 0) {
    return [];
  }
  return response.data
}

/**
 * 指定された主キー（datetime）に一致するメモを削除する関数
 * @param datetime 削除するメモの主キー
 */
export const deleteMemo = async (pageUrl: string): Promise<void> => {
  // セッションからユーザIDを取得
  const sessionUserId = sessionStorage.getItem("userId");
  console.log("session:" + sessionUserId)
  axios.post("http://localhost:8081/deletePageInfo", {
    userId: sessionUserId,
    pageUrl: pageUrl
  }).then(response => {
    console.log(response.data)
  })
  // await memos.delete(pageUrl)
}
