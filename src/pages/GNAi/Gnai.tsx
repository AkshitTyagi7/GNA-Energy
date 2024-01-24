import "./Gnai.css";
import {ReactComponent as UserIcon} from '../../icons/user.svg';
export function Gnai(){
    return(
        <div className="content">
            <div className="chatArea pt-10">
                <ChatBox sender="User" message="Hello" />
            </div>

            <div className="chatArea pt-10">
                <ChatBox sender="User" message="Hi" />
            </div>


            <div className="chatArea pt-10">
                <ChatBox sender="User" message="Hello" />
            </div>

            <div className="chatArea pt-10">
                <ChatBox sender="User" message="Hello" />
            </div>

            <div className="chatArea pt-10">
                <ChatBox sender="User" message="Hello" />
            </div>

            <div className="absolute bottom-0 w-full ">

                <div className="flex justify-center h-full  text-center gptInputBox bg-white">
                        <input type="text" className="w-full h-full border-none outline-0" placeholder="Send a message...." />
                </div>
            </div>

        </div>
    )


}

function ChatBox({
    sender,
    message
}:{
    sender: string,
    message: string
}): JSX.Element{
    return(
        <div className="messageBox">
            <div className="flex">
                <UserIcon className="w-8 h-8" />
               <div>
                <div className="messageSender">{sender}</div>
                <div className="message">{message}</div>

               </div>
            </div>
        </div>
    )
}