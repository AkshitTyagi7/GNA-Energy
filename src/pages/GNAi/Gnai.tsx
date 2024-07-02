import "./Gnai.css";
import { ReactComponent as UserIcon } from "../../icons/user.svg";
import { ReactComponent as AiIcon } from "./AiIcon.svg";
import { getUser } from "../Protected";
import { ReactComponent as Send } from "./send.svg";
import React, { useRef, useState } from "react";
import { json } from "stream/consumers";

enum Role {
  User = "user",
  Ai = "assistant",
}
interface Message {
  content: string;
  role: string;
  source?: Source[];
}

interface Source {
  name: string;
  page: number;
}
export function Gnai() {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const BASE_URL = "https://assistant.gna.energy/";
  const [threadId, setThreadId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Welcome to GNAi ! How can I help you ?",
      role: Role.Ai,
    },
  ]);
  const [waiting, setWaiting] = useState<boolean>(false);
  let tempMessage: Message[] = [];
  const [state, setState] = React.useState<any>();
  React.useEffect(() => {
    create_thread();
    scrollToBottom();
  }, []);
  return (
    <div className="h-full w-full overflow-hidden pl-4">
      <div
        className="chatArea pb-10 rounded "
        style={{ scrollBehavior: "smooth" }}
        ref={chatAreaRef}
      >
        {messages.map((message, index) => {
          return <ChatBox key={index} message={message} />;
        })}
      </div>

      <div className="mt-4 bottom-2 w-full ">
        <form onSubmit={_handleMessageSubmit}>
          <div className="flex justify-center h-full  text-center gptInputBox bg-white pl-2 ">
            <div className="pl-2 w-full flex">
              <input
                type="text"
                className="flex-grow h-full border-none outline-0 "
                id="gptInput"
                required={true}
                placeholder="Send a message...."
              />
              <button>
                {" "}
                <Send type="submit" className="h-full mr-2 ml-2" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  async function _handleMessageSubmit(e: any) {
    e.preventDefault();
    let message = document.getElementById("gptInput") as HTMLInputElement;
    tempMessage = [
      ...messages,
      {
        content: message.value,
        role: Role.User,
      },
    ];
    setMessages(tempMessage);
    // sleep for milliseconds
    (document.getElementById("gptInput") as HTMLInputElement).value = "";

    scrollToBottom();
    await new Promise((r) => setTimeout(r, 100));
    const response = await fetch(`${BASE_URL}gnai/get_response_api/`, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ message: tempMessage[
        tempMessage.length - 1
      ].content, email: getUser().email,  thread_token:threadId, }),
    });
    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    // Here we start prepping for the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const loopRunner = true;
    let streamingMessage: string = "";
    //   setMessages([...tempMessage, {
    //     content: '',
    //     role: Role.Ai
    // }]);

    while (loopRunner) {
      // Here we start reading the stream, until its done.
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value, { stream: true });
      streamingMessage = streamingMessage + decodedChunk;

      // Update the last message with the new message
      setMessages([
        ...tempMessage,
        {
          content: JSON.parse(streamingMessage).data.message,
          role: Role.Ai,
          source: JSON.parse(streamingMessage).data.sources,
        },
      ]);
      scrollToBottom();
    }
  }
  async function scrollToBottom() {
    await new Promise((r) => setTimeout(r, 100));
    chatAreaRef!.current!.scrollTop! = chatAreaRef!.current!.scrollHeight!;
  }
  function ChatBox({ message }: { message: Message }): JSX.Element {
    return (
      <div className="messageBox p-6">
        <div className="flex space-x-2">
          <div className="flex-shrink-0">
            {message.role === Role.User ? (
              <UserIcon className="h-10 w-10" />
            ) : (
              <AiIcon className="h-10 w-10" />
            )}
          </div>
          <div>
            <div className="messageSender">
              {message.role === Role.User ? getUser().email : "GNAi Assistant"}
            </div>
            <div
              className="message"
              dangerouslySetInnerHTML={{
                __html: formatMessage(message.content),
              }}
            ></div>

            {message.source && (
              <div className="sources">
                <br /> <div><p>Sources</p></div>
                {message.source.map((source, index) => {
                  return (
                    <>
                      <a
                        key={index}
                        target="_blank"
                        className="source"
                        href={`${BASE_URL}media/static/${source.name}#page=${source.page}`}
                      >
                        {source.name} - Page {source.page}
                      </a>
                      <br />
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  function create_thread() {
    fetch(BASE_URL + "gnai/create_thread/", {
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
}

function formatMessage(message: string): string {
  const lines = message.split("\n");
  const formattedLines = lines.map((line, index) => {
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold text between ** **
    formattedLine = formattedLine.replace(/^- /g, "<br>- "); // Bold bullet points
    if (index === 0) return formattedLine;
    return `<br>${formattedLine}`;
  });
  return formattedLines.join("");
}

