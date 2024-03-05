import "./Documents.css";
import { ReactComponent as DocumentIcon } from "../../icons/document-icon.svg";
import { ReactComponent as SearchIcon } from "../../icons/search.svg";
import { ReactComponent as ViewIcon } from "../../icons/eye.svg";
import { ReactComponent as DownloadIcon } from "../../icons/download.svg";
import { ReactComponent as Chat } from "../../icons/chat.svg";
import { ReactComponent as GNAiIcon } from "./chatbox.svg";
import { ReactComponent as Send } from "../GNAi/send.svg";
import {ReactComponent as CrossCircle} from "./cross-circle.svg"
import { ReactComponent as UserIcon } from "../../icons/user.svg";

import { useDispatch, useSelector } from "react-redux";
import { buildHttpReq } from "../../common";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../store/store";
import {
  DocumentModel,
  addMessage,
  setDocumentFilters,
  setDocuments,
  setGNAiVisibility,
} from "../../store/state/DocumentState";
import Select from "react-select";
import { ReactComponent as DownIcon } from "./downicon.svg";
import { DocItem, UserChat, Role } from "./Components";

export function Documents() {
  const state = useSelector((state: RootState) => state.document);
  const chatAreaRef = useRef<HTMLDivElement>(null);
const URL = "http://143.244.128.157:8003/"
  const dispatch = useDispatch();
  useEffect(() => {
    fetchDocuments();
    fetchFilters();
    create_thread();
  }, []);
  const selectionStyle = {
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: 50,
      overflowY: "auto",
    }),
    control: (base: any) => ({
      ...base,
      height: "100%",
      width: "20vw",

      border: "none",
      boxShadow: "none",
      borderRadius: "8px",
      "&:hover": {
        border: "none",
      },
    }),
    option: (base: any) => ({
      ...base,
      padding: "10px",
      "&:hover": {
        backgroundColor: "#f0f0f0",
      },
    }),
  };
  const selectedDiscoms: string[] = [];
  const selectedStates: string[] = [];
  let [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  let textSearch = "";
  const [threadId, setThreadId] = useState<string>("");
  const [fileId, setSelectedFileId] = useState<string>("");

  return (
    <div>
      <div className="p-10">
        <div className="flex document-search-container space-x-3">
          <form
            className="document-search"
            onSubmit={(e) => {
              e.preventDefault();
              const inputElement = document.querySelector(
                'input[name="search"]'
              ) as HTMLInputElement;
              textSearch = inputElement.value;
              fetchDocuments();
            }}
          >
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="document-search"
            />
          </form>
          <Select
            isMulti={true}
            styles={selectionStyle}
            onChange={(e) => {
              console.log(e);
              selectedStates.length = 0;
              e?.forEach((item: any) => {
                selectedStates.push(item.value);
              });
              fetchDocuments();
            }}
            options={state.filters.states?.map((item) => {
              return { value: item, label: item, isFixed: false };
            })}
          />
          <Select
            isMulti={true}
            onChange={(e) => {
              console.log(e);
              selectedDiscoms.length = 0;
              e?.forEach((item: any) => {
                selectedDiscoms.push(item.value);
              });
              fetchDocuments();
            }}
            styles={selectionStyle}
            options={state.filters.discoms?.map((item) => {
              return { value: item, label: item, isFixed: false };
            })}
          />
        </div>
        <div className="main-container">
          <div className="document-container">
            {state.documents.map((document: DocumentModel) => {
              return <DocItem document={document} onChat={
                ()=>{
                  setSelectedFileId(document.fileId);
                  dispatch(setGNAiVisibility(!state.gnaiActive));
                  dispatch(
                    addMessage({
                      content: `Hi, How can I help you with the document  "${document.title}" ?`,
                      role: Role.Ai,
                    }
                     ) )
                        scrollToBottom();
                }
              
              } />;
            })}
          </div>

          <div className="filter-container p-6">
            <div className="flex space-x-2">
              <DownIcon width="18px" />
              <p className="font-semibold">By Document Type</p>
            </div>
            {state.filters.types?.map((type) => {
              return (
                <div className="pl-6 mt-2">
                  <span
                    onClick={() => {
                      if (selectedTypes.includes(type)) {
                        setSelectedTypes(
                          selectedTypes.filter((item) => item !== type)
                        );
                        selectedTypes = selectedTypes.filter(
                          (item) => item !== type
                        );
                        fetchDocuments();
                      } else {
                        setSelectedTypes([...selectedTypes, type]);
                        selectedTypes.push(type);
                        fetchDocuments();
                      }

                      // fetchDocuments();
                    }}
                    className={`cursor-pointer ${
                      selectedTypes.includes(type) ? "primary text-primary" : ""
                    }`}
                  >
                    {type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="gnai-container">
         
          <div className="gnai-body">
          {state.gnaiActive && <div className="chatbox-container">
              <div className="chatbox-chat-container" ref={chatAreaRef}> 
               {
                    state.chats.map((chat)=>{
                
                        return <UserChat role={chat.role} message={chat.content} />
                    
                    })
               }
              </div>
              <form 
              onSubmit={
                (e)=>{
                  e.preventDefault();
                  let message = document.querySelector('input[name="messagebox"]') as HTMLInputElement;
                  dispatch(   addMessage({
                    content: message.value,
                    role: Role.User
                }))
                scrollToBottom();
                sendMessage({
                    content: message.value
                })
                message.value = '';

                }
              }
              className="chatbox-input-container">
                <input type="text" name="messagebox" placeholder="Type your message" required />
                <button type="submit">
                  <Send />
                </button>
              </form>
            </div>}
            <div className="flex justify-end">
                {
            !state.gnaiActive ?
              <GNAiIcon width={"6vw"} height={"6vw"} onClick={
                ()=>{
                  dispatch(setGNAiVisibility(!state.gnaiActive));
                  scrollToBottom()
                }
              
              } /> :
               <CrossCircle width={"6vw"} height={"6vw"} onClick={
                ()=>{
                  dispatch(setGNAiVisibility(!state.gnaiActive));
                }
              
              } />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function create_thread(){
    fetch(URL + "gnai/create_thread").then((response)=>{    
        return response.json();
        }).then((data)=>{
            console.log(data);
            console.log(data.thread_id);
        setThreadId(data.thread_id);
  })
  }
  async  function scrollToBottom() {
    await new Promise(r => setTimeout(r, 100));
    chatAreaRef!.current!.scrollTop! = chatAreaRef!.current!.scrollHeight!;



}
  function sendMessage({
    content
  }: {content: string}){
    fetch(URL + "gnai/generate_response/", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: content,
            thread_id: threadId,
            file_id: fileId
        }),
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        console.log(data.message);
    dispatch( addMessage({
        content: data.message,
        role: Role.Ai
    }))
    scrollToBottom();   
    })
  }

  function fetchDocuments() {
    fetch(URL + "gnai/fetchDocuments/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discoms: selectedDiscoms,
        states: selectedStates,
        types: selectedTypes,
        text_search: textSearch,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(setDocuments(data.data));
      });
  }
  function fetchFilters() {
    fetch(URL + "gnai/fetchDocumentFilters/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Filters");
        console.log(data);
        dispatch(setDocumentFilters(data));
      });
  }
}
