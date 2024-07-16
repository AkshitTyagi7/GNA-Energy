import "./Documents.css";
import { ReactComponent as DocumentIcon } from "../../icons/document-icon.svg";
import { ReactComponent as SearchIcon } from "../../icons/search.svg";
import { ReactComponent as ViewIcon } from "../../icons/eye.svg";
import { ReactComponent as DownloadIcon } from "../../icons/download.svg";
import { ReactComponent as Chat } from "../../icons/chat.svg";
import { ReactComponent as GNAiIcon } from "./chatbox.svg";
import { ReactComponent as Send } from "../GNAi/send.svg";
import { ReactComponent as CrossCircle } from "./cross-circle.svg";
import { ReactComponent as UserIcon } from "../../icons/user.svg";

import { useDispatch, useSelector } from "react-redux";
import { buildHttpReq } from "../../common";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../store/store";
import {
  DocumentModel,
  addMessage,
  setDiscoms,
  setDocumentFilters,
  setDocuments,
  setGNAiVisibility,
  setTyping,
} from "../../store/state/DocumentState";
import Select from "react-select";
import { ReactComponent as DownIcon } from "./downicon.svg";
import { DocItem, UserChat, Role, FilterHeading } from "./Components";
import { getUser } from "../Protected";
import swal from "sweetalert";
import { sep } from "path";
const URL = "https://assistant.gna.energy/";

export const DOC_URL = URL;

export function Documents() {
  const state = useSelector((state: RootState) => state.document);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  // const URL = "https://api-data.gna.energy/";

  const dispatch = useDispatch();
  useEffect(() => {
    fetchDocuments();
    fetchFilters();
    // create_thread();
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
      // backgroundColor: "#e5e7eb",
      width: "100%",

      border: "0.2px solid rgba(159, 159, 159, 1)",

      boxShadow: "none",

      borderRadius: "4px",
      "&:hover": {
        border: "0.2px solid rgba(159, 159, 159, 1)",
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
      <div className="gnai-header p-0">
          <h1>GNAi Doc</h1>
          <div className="document-search-container">
            <SearchIcon />
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
          </div>
        
      </div>
      <div className="p-10">

        <div className="main-container">
          <div className="document-container">
            <div className="document-item document-table-header">
              <div className="document-item-row document-title">
                {/* <DocumentIcon width={"vw"} /> */}
                <p className="document-text ">Title of the File</p>
              </div>
              <p className="document-text">Date</p>
              <div className="document-item-row">
                <p className="document-text ">View</p>
                <p className="document-text ">Download</p>
                <p className="document-text ">Ask Ai</p>
              </div>
            </div>
            {state.documents.map((document: DocumentModel) => {
              return (
                <DocItem
                  document={document}
                  onChat={() => {
                    setSelectedFileId(document.fileId);
                    dispatch(setGNAiVisibility(!state.gnaiActive));
                    dispatch(
                      addMessage({
                        content: `Hi, How can I help you with the document  "${document.title}" ?`,
                        role: Role.Ai,
                      })
                    );
                    scrollToBottom();
                  }}
                />
              );
            })}
          </div>

          <div className="filter-container p-6">
            {/* <FilterHeading heading="By Date" />
            <div className="text-center date-range">
              <div className="flex justify-center"></div>
            <input type="date" className="mt-4 mr-3 p-2 br-20 rounded-lg" />
            <input type="date" className="mt-4 mr-3 p-2 br-20 rounded-lg mb-3" />
            </div> */}

            <FilterHeading heading="States" />

            <Select
              className="mt-4 mb-4 document-filter"
              isMulti={true}
              styles={selectionStyle}
              onChange={(e) => {
                console.log(e);
                let discoms: string[] = [];
                selectedStates.length = 0;
                if (e.length > 0) {
                  state.filters.stateDiscom?.forEach((item) => {
                    if (e.map((item) => item.value).includes(item.state)) {
                      item.discom.forEach((discom) => {
                        discoms?.push(discom);
                        console.log(discom);
                      });
                    }
                  });
                  dispatch(setDiscoms(discoms));
                }
                e?.forEach((item: any) => {
                  selectedStates.push(item.value);
                });

                fetchDocuments();
              }}
              options={state.filters.states?.map((item) => {
                return { value: item, label: item, isFixed: false };
              })}
            />
            <FilterHeading heading="Discom" />
            <Select
              className="mt-4 mb-4 document-filter"
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
            <div className="mt-4 mb-4">
              <div className="flex space-x-2">
                <p className="" style={{ fontWeight: 300 }}>
                  Document Type
                </p>
              </div>
              {state.filters.types?.map((type) => {
                return (
                  <div className="pl-1 mt-2 doc-filter">
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
                        selectedTypes.includes(type)
                          ? "primary text-primary"
                          : ""
                      }`}
                    >
                      {type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="gnai-container">
          <div className="gnai-body">
            {state.gnaiActive && (
              <div className="chatbox-container">
                <div className="chatbox-chat-container" ref={chatAreaRef}>
                  {state.chats.map((chat) => {
                    return (
                      <UserChat
                        source={chat.source}
                        role={chat.role}
                        message={chat.content}
                      />
                    );
                  })}
                  {state.typing && <div className="typing-loader"></div>}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    let message = document.querySelector(
                      'input[name="messagebox"]'
                    ) as HTMLInputElement;
                    dispatch(
                      addMessage({
                        content: message.value,
                        role: Role.User,
                      })
                    );
                    scrollToBottom();
                    sendMessage({
                      content: message.value,
                    });
                    message.value = "";
                  }}
                  className="chatbox-input-container"
                >
                  <input
                    type="text"
                    name="messagebox"
                    placeholder="Type your message"
                    required
                  />
                  <button type="submit">
                    <Send />
                  </button>
                </form>
              </div>
            )}
            <div className="flex justify-end">
              {!state.gnaiActive ? (
                <GNAiIcon
                  width={"6vw"}
                  height={"6vw"}
                  onClick={() => {
                    dispatch(setGNAiVisibility(!state.gnaiActive));
                    scrollToBottom();
                  }}
                />
              ) : (
                <CrossCircle
                  width={"6vw"}
                  height={"6vw"}
                  onClick={() => {
                    dispatch(setGNAiVisibility(!state.gnaiActive));
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function create_thread() {
    fetch(URL + "gnai/create_thread/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: getUser().email,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.thread_id);
        setThreadId(data.thread_id);
      });
  }
  async function scrollToBottom() {
    await new Promise((r) => setTimeout(r, 100));
    chatAreaRef!.current!.scrollTop! = chatAreaRef!.current!.scrollHeight!;
  }
  function sendMessage({ content }: { content: string }) {
    dispatch(setTyping(true));
    fetch(URL + "gnai/singleDocQuery/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
        // thread_id: threadId,
        file_id: fileId,
        // filename: state.documents.filter((item)=>item.fileId === fileId)[0].filename ?? ""
        filename:
          state.documents.filter((item) => item.fileId === fileId).length > 0
            ? state.documents.filter((item) => item.fileId === fileId)[0]
                .filename
            : "",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.message);
    dispatch( addMessage({
        content: data.data.message,
        role: Role.Ai,
        source: data.data.sources
    }));
    dispatch(setTyping(false));
    scrollToBottom();   
    }).catch((e)=>{
      swal("Something Went Wrong", "An error occured while sending message. Please try again later", "warning");
      console.log(e);
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
      }).catch((e)=>{
        swal("Something Went Wrong", "An error occured while fetching documents. Please try again later", "warning");
        console.log(e);
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
      }).catch((e)=>{
        swal("Something Went Wrong", "An error occured while fetching filters. Please try again later", "warning");
        console.log(e);
      });
  }
}
