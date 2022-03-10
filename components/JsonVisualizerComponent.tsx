import { nanoid } from "nanoid";
import { JSONTree } from "react-json-tree";
import { useAppSelector } from "../red/store";

export const NFTJson = ()=>{
    function shouldExpand(keypath,data,level){
        return true;
    }
    const jsonFiles = useAppSelector(state=>state.discovery.jsonFiles);
    // const json = useAppSelector(state=>state.discovery.JSONMetadata);
    // const metaDatapath = useAppSelector(state=>state.discovery.metadataPath);
    // const metaDataUsablePath = useAppSelector(state=>state.discovery.metadataUsablePath);
    if(jsonFiles.length===0){
        return <></>
    }
    return (
      <div className="
      w-screen rounded-md 
      md:w-full px-2 space-y-2 
      ">
        {jsonFiles.map((j) => (
          <div key={nanoid()} className="font-mono rounded-md md:text-base my-8 md:mb-2 md:mt-0" >
            <JSONTree data={j.jsonRaw} shouldExpandNode={shouldExpand} />
            <div className="
            font-mono text-2xl truncate overflow-ellipsis
            md:w-64 md:text-xs
            ">
              <a
                href={j.jsonUsablePath}
                className="text-blue-700 underline text-xs overflow-ellipsis w-1/2 truncate md:text-base"
                target="_blank"
              >
                {j.jsonPath}
              </a>
            </div>
          </div>
        ))}
      </div>
    );

}

export default NFTJson;