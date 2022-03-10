import { useAppSelector } from "../red/store";

export const NFTLogger = ()=>{
    const logs = useAppSelector(state=>state.discovery.logs);
    if(logs===undefined || logs.trim().length===0){
        return <></>
    }
    return <div className="">
        <div>Log:</div>
      <textarea
        className="bg-white text-gray-600 font-mono font-normal p-2 w-2/3 h-96 border rounded border-black overflow-scroll"
        value={logs}
        readOnly
      ></textarea>
    </div>

}

export default NFTLogger;