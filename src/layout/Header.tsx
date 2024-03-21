
export function Header({title} :{title: string}){
    return (
        <div className="header">
        <div>
            <h1>{title}</h1>
            <p className="time-text">
                {
                    // Show current time and date as 4:46 PM, 31st August 2021
                    new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    }) +
                    ", " +
                    new Date().toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                }
            </p>
        </div>
    </div>
    )
}