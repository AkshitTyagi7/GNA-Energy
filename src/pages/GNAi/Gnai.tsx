import "./Gnai.css";
export function Gnai(){
    return(
        <div className="content p-20">
            <div className="absolute bottom-0 w-full text-center gptInputBox bg-white">
                <div className="flex justify-center h-full bg-black">
                    <div className="flex-grow">
                        <input type="text" className="w-full h-full border-none outline-0" placeholder="Enter GPT ID" />
                    </div>
                </div>
            </div>

        </div>
    )
}