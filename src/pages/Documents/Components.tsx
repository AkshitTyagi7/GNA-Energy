import "./Documents.css";
import { ReactComponent as DocumentIcon } from "../../icons/document-icon.svg";
import { ReactComponent as SearchIcon } from "../../icons/search.svg";
import { ReactComponent as ViewIcon } from "../../icons/eye.svg";
import { ReactComponent as DownloadIcon } from "../../icons/download.svg";
import { ReactComponent as Chat } from "../../icons/chat.svg";
import { ReactComponent as GNAiIcon } from "./chatbox.svg";
import {ReactComponent as Send} from "../GNAi/send.svg"
import { ReactComponent as UserIcon } from "../../icons/user.svg";


import { useDispatch, useSelector } from "react-redux";
import { buildHttpReq } from "../../common";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import {
  DocumentModel,
  setDocumentFilters,
  setDocuments,
} from "../../store/state/DocumentState";
import Select from "react-select";
import { ReactComponent as DownIcon } from "./downicon.svg";
import { getUser } from "../Protected";

export const DocItem = ({ document, onChat }: { document: DocumentModel, onChat: Function }) => {
    const URL = "http://143.244.128.157:8003/"

    return (
      <div className="document-item">
        <div className="document-item-row">
          <DocumentIcon width={"4vw"} />
          <span className="document-title">{document.title}</span>
        </div>
  
        <p className="document-date">{document.documentDate}</p>
        <div className="document-item-row">
          <ViewIcon
            className="cursor-pointer"
            width={"3vw"}
            onClick={() =>
              window.open(URL + "" + document.file, "_blank")
            }
          />
          <DownloadIcon
            className="cursor-pointer"
            width={"3vw"}
            onClick={() => {
              downloadFile(
                URL + "" + document.file,
                document.filename
              );
            }}
          />
          <Chat width={"2vw"} onClick={
            () => onChat(document)
          } />
        </div>
      </div>
    );
  
  };
 export enum Role {
      User = "user",
      Ai = "assistant"
  }
  interface Message {
      content: string,
      role: string
  
  }
  export    function UserChat({
      role,
      message
  }: {
      role: string,
      message: string
  }): JSX.Element {
      return (
          <div className="messageBox p-6">
              <div className="flex space-x-2">
                  <div className="flex-shrink-0 justify-start">
                      {role === Role.User ? <UserIcon className="h-10 w-10" /> : <GNAiIcon className="h-10 w-10" />}
                  </div>
                  <div>
                      <div className="messageSender justify-start flex">
                          {role === Role.User ? getUser().email : "GNAi Assistant"}
  
                      </div>
                      <div className="message text-left" dangerouslySetInnerHTML={{__html: message == null || "" ? "" : formatMessage(message)}}></div>
                  </div>
              </div>
          </div>
      )
  }
// Function to format the message with line breaks and bold text
function formatMessage(message : string) : string {
  const lines = message.split('\n');
  const formattedLines = lines.map((line, index) => {
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text between ** **
    formattedLine = formattedLine.replace(/^- /g, '<br><strong>- '); // Bold bullet points
    if(index === 0) return formattedLine;
    return `<br>${formattedLine}`;
  });
  return formattedLines.join('');
}
  function downloadFile(url: string, fileName: string) {
    fetch(url)
      .then((response: Response) => {
        return response.blob();
      })
      .then((blob: Blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link: HTMLAnchorElement = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      });
  }

  export function FilterHeading({heading} : {heading : string}){
    return   <div className="flex space-x-2">
    <DownIcon width="18px" />
    <p className="font-semibold">{heading}</p>
  </div>
  }
  