import "./Gnai.css";
export function Gnai(){
    return(
        <div className="content">
            <div className="absolute bottom-0 w-full ">
                <div className="flex justify-center h-full  text-center gptInputBox bg-white mr-10 ml-10">
                        <input type="text" className="w-full h-full border-none outline-0" placeholder="Send a message...." />
                </div>
            </div>

        </div>
    )
}