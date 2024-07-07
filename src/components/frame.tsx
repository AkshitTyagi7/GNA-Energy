export function PowerBiFrame({
    url, title
}:{
    url:string,
    title?:string
}){
    return (
        <div className="center-frame">
  <iframe className= "full-frame" title={title ?? "GNA"} src={url} allowFullScreen={true}></iframe>
  </div> 
    )
}