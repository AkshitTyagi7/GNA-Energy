import "./Gnai.css";
import { ReactComponent as UserIcon } from "../../icons/user.svg";
import { ReactComponent as AiIcon } from "./AiIcon.svg";
import { getUser } from "../Protected";
import { ReactComponent as Send } from "./send.svg";
import React, { useRef, useState } from "react";

enum Role {
  User = "user",
  Ai = "assistant",
}
interface Message {
  content: string;
  role: string;
}
export function Gnai() {
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Welcome to GNAi ! How can I help you ?",
      role: Role.Ai,
    },
  ]);
  let tempMessage: Message[] = [];
  const [state, setState] = React.useState<any>();
  React.useEffect(() => {
    scrollToBottom();
  }, []);
  return (
    <div className="h-full">
      <div
        className="chatArea pb-10 rounded "
        style={{ scrollBehavior: "smooth" }}
        ref={chatAreaRef}
      >
        {messages.map((message, index) => {
          return (
            <ChatBox
              key={index}
              role={message.role}
              message={message.content}
            />
          );
        })}
     
      </div>

      <div className="absolute bottom-0 w-full ">
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
    const response = await fetch(
      "https://assistant.gna.energy/gnai/streamChatGpt/",
      {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: tempMessage, email: getUser().email }),
      }
    );
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
          content: streamingMessage,
          role: Role.Ai,
        },
      ]);
      scrollToBottom();
    }
  }
  async function scrollToBottom() {
    await new Promise((r) => setTimeout(r, 100));
    chatAreaRef!.current!.scrollTop! = chatAreaRef!.current!.scrollHeight!;
  }
}

function ChatBox({
  role,
  message,
}: {
  role: string;
  message: string;
}): JSX.Element {
  return (
    <div className="messageBox p-6">
      <div className="flex space-x-2">
        <div className="flex-shrink-0">
          {role === Role.User ? (
            <UserIcon className="h-10 w-10" />
          ) : (
            <AiIcon className="h-10 w-10" />
          )}
        </div>
        <div>
          <div className="messageSender">
            {role === Role.User ? getUser().email : "GNAi Assistant"}
          </div>
          <div className="message" dangerouslySetInnerHTML={{__html:formatMessage( message) }}></div>
        </div>
      </div>
    </div>
  );
}
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