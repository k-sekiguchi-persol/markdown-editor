import * as React from 'react'
import axios from 'axios'
import {
  Link,
  useHistory,
} from 'react-router-dom'
import styled from 'styled-components'
import { Header } from '../components/header'
import { Button, DeleteButton } from '../components/button'
import { SaveModal } from '../components/save_modal'
import { DeleteModal } from '../components/delete_modal'
import { putMemo } from '../indexeddb/memos'
import {
  getMemoPageCount,
  getPageInfos,
  MemoRecord,
  PageInfo,
  deleteMemo,
} from '../indexeddb/memos'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Trash2 } from 'lucide-react';

const { useState, useEffect } = React

const HeaderArea = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
  `

const Userheader = styled.div`
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  `

const Wrapper = styled.div`
    bottom: 3rem;
    left: 0;
    position: fixed;
    right: 0;
    top: 3rem;
    padding: 0 1rem;
    overflow-y: scroll;
  `

const Memo = styled.button<{ isUpdated?: boolean }>`
    display: block;
    background-color: ${props => props.isUpdated ? '#fff67cff' : 'white'};
    border: 1px solid gray;
    width: 100%;
    padding: 1rem;
    margin: 1rem 0;
    text-align: left;
  `

const MemoTitle = styled.div`
    font-size: 1rem;
    margin-bottom: 0.5rem;
  `

const UpdText = styled.div`
    font-size: 4rem;
    margin-bottom: 0.5rem;
    color: #ee0606ff;
  `

const MemoUrl = styled.div`
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `

const Paging = styled.div`
    bottom: 0;
    height: 3rem;
    left: 0;
    line-height: 2rem;
    padding: 0.5rem;
    position: fixed;
    right: 0;
    text-align: center;
  `

const PagingButton = styled.button`
    background: none;
    border: none;
    display: inline-block;
    height: 2rem;
    padding: 0.5rem 1rem;
  
    &:disabled {
      color: silver;
    }
  `


interface Props {
  setData: (url: string) => void
}

export const History: React.FC<Props> = (props) => {
  const { setData } = props
  const [memos, setMemos] = useState<MemoRecord[]>([])
  const [pageInfo, setPageInfos] = useState<PageInfo[]>([])
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState<string>('')
  const [maxPage, setMaxPage] = useState(1)
  const history = useHistory()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saveKey, setSaveKey] = useState<string>('')
  const [deleteTitle, setDeleteTitle] = useState<string>('')
  const [deleteUrl, setDeleteUrl] = useState<string>('')
  const [deleteKey, setDeleteKey] = useState<string>('')
  const [count, setCount] = useState(0);

  const fetchPages = async () => {
    console.log("fetchPage開始")
    // getPageInfosを呼び出してデータ取得を待機
    // const data = await getPageInfos(1);
    await getPageInfos(page).then(response => {
      setPageInfos(response);
    })
    // console.log(data)
    // setPageInfos(data);
  };
  useEffect(() => {
    console.log("useEffect開始")
    // getPageInfos(page).then(setPageInfos)

    // axios.get<PageInfo>("http://localhost:8081/getPageInfos", {
    //   params: {
    //     userId: "ahoahoa"
    //   }
    // }).then(response => {
    //   //console.log(response.data)
    //   setPageInfos(response.data)

    // })
    getMemoPageCount().then(setMaxPage)

    fetchPages();
    setReload(new Date().toISOString())
    const timer = setTimeout(() => {
      setCount(count + 1);
      console.log("タイマーカウント")
    }, 10000);
    return () => clearTimeout(timer);
  }, [count]);


  const canNextPage: boolean = page < maxPage
  const canPrevPage: boolean = page > 1
  const movePage = (targetPage: number) => {
    if (targetPage < 1 || maxPage < targetPage) {
      return
    }
    setPage(targetPage)
    console.log("targetPage")
    // getPageInfos(targetPage).then(setPageInfos)
  }

  return (
    <>
      <HeaderArea>
        <Header title="サイト更新監視">
          <Userheader>{sessionStorage.getItem("userId")}</Userheader>
          <Button onClick={(e) => { e.stopPropagation(); setShowSaveModal(true) }}>
            URLを登録する
          </Button>
          <Button onClick={() => { sessionStorage.removeItem("userId"); history.push("/login") }}>
            ログアウト
          </Button>
          {/*<Link to="/editor">
            エディタに戻る
          </Link>*/}
        </Header>
      </HeaderArea>
      <Wrapper>
        <Tabs>
          <TabList>
            <Tab>登録サイト</Tab>
          </TabList>
          <TabPanel>

            {pageInfo.map(memo => (
              // <a target="_blank" href={`https://www.google.com/search?q=${memo.title}`}>
              <Memo
                //key={memo.}
                isUpdated={memo.updFlg === '1'}
                onClick={async () => {
                  /*deleteMemo(memo.datetime)*/
                  window.open(memo.pageUrl, '_blank')
                  {/*setUrl(memo.url)
                history.push('/editor')*/ }
                  console.log("更新：" + memo.userId + memo.pageUrl)
                  await axios.post("http://localhost:8081/updPageInfoFlg", {
                    userId: memo.userId,
                    pageUrl: memo.pageUrl
                  }).then(response => {
                    console.log("更新後：" + response.data)
                    getPageInfos(page).then(setPageInfos)
                  })

                }}
              >
                <MemoTitle>{memo.pageTitle}</MemoTitle>
                <MemoUrl>{memo.pageUrl}</MemoUrl>
                <DeleteButton onClick={(e) => { e.stopPropagation(); setDeleteTitle(memo.pageTitle); setDeleteUrl(memo.pageUrl); setShowDeleteModal(true) }}></DeleteButton>
                {memo.updFlg === '1' && <UpdText>NEW</UpdText>}
              </Memo>//</a>
            ))}

          </TabPanel>
          <TabPanel>
            <h2>Hello from Bar</h2>
          </TabPanel>
        </Tabs>
      </Wrapper>
      {showSaveModal && (
        <SaveModal
          initialSaveKey={saveKey}
          onSave={async (title: string, url: string): Promise<void> => {
            // セッションからユーザIDを取得
            const sessionUserId = sessionStorage.getItem("userId");
            console.log("session:" + sessionUserId)
            // セッションなかったらログイン画面に戻す
            if (sessionUserId == null) {
              history.push("./history")
            }
            await axios.post("http://localhost:8081/savePageInfo", {
              userId: sessionUserId,
              pageTitle: title,
              pageUrl: url
            }).then(response => {
              console.log("保存完了")
              console.log(response.data)
              getPageInfos(page).then(setPageInfos);
            })
            setShowSaveModal(false);
          }}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          initialTitle={deleteTitle}
          initialUrl={deleteUrl}
          onDelete={(pageUrl: string): void => {
            deleteMemo(pageUrl)
            setShowDeleteModal(false)
            getPageInfos(page).then(setPageInfos)

          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      <Paging>
        <PagingButton
          onClick={() => movePage(page - 1)}
          disabled={!canPrevPage}
        >
          ＜
        </PagingButton>
        {page} / {maxPage}
        <PagingButton
          onClick={() => movePage(page + 1)}
          disabled={!canNextPage}
        >
          ＞
        </PagingButton>
      </Paging>
    </>
  )
}
