// function MSEDButton({ buttonTitle, index }: { buttonTitle: string; index: number; }) {
//     return (
//         <button className={`btn rectangle btn-primary btn-small ${msedChartIndex === index ? 'btn-active' : ''}`}
//             onClick={
//                 () => {
//                     setMSEDChartIndex(index);
//                 }
//             }
//         >{
//                 buttonTitle
//             }</button>);
// }

export function SmallButton({buttonTitle, isActive = false, onClick, className}: {buttonTitle: string, isActive: boolean, onClick: () => void, className?: string}) {
    return (
        <button className={`btn rectangle btn-primary btn-small ${isActive ? 'btn-active' : ''} ${className}`}
            onClick={
                onClick
            }
        >{
                buttonTitle
            }</button>);
}

export function MediumButton({buttonTitle, isActive = false, onClick}: {buttonTitle: string, isActive: boolean, onClick: () => void}) {
    return (
        <button className={`btn rectangle btn-primary btn-medium ${isActive ? 'btn-active' : ''}`}
            onClick={
                onClick
            }
        >{
                buttonTitle
            }</button>);
}
