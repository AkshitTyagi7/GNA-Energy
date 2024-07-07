export default function FootNote({source}:{source:string}){
    return(
      <div
      className="absolute bottom-2 right-3 text-xs text-gray-500"
      >
        {source}
      </div>
    );
  }