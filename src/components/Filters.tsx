export function FilterTab(
    // options: String[], 
    // selected: String[],
    { options, selected, onClick }: { options: string[]; selected: string[], onClick: (option: string, index:number) => void }
){
//     <div>
//     <button
//       onClick={() => {
//         setSubTabIndex(0);
//       }}
//       className={`tab tab-left ${
//         subTabIndex === 0 ? "tab-active" : ""
//       }`}
//     >
//       By Volume
//     </button>
//     <button
//       className={`tab tab-right ${
//         subTabIndex === 1 ? "tab-active" : ""
//       }`}
//       onClick={() => {
//         setSubTabIndex(1);
//       }}
//     >
//       By Price
//     </button>
//   </div>
// </div>

    return (
        <div className="flex">
            {options.map((option,index) => (
                <div
                    key={option}
                    onClick={() => onClick(option, index)}
                    className={
"tab "+
                        (selected.includes(option) ? "tab-active" : "") +
                        (
                            index === 0
                                ? " tab-left"
                                : index === options.length - 1
                                    ? " tab-right"
                                    : ""
                        )
                    }
                >
                    {option}
                </div>
            ))}
        </div>
    );
}