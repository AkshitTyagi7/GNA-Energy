export default function ProgressBox(percent, color, value){
    return (
        <div className='progressBox' style={{}}>
            <div className='progressBar' style={{width: percent, backgroundColor: color}}></div>
            <div className='progressValue'><p>{value} Hi</p></div>
        </div>
    )
}