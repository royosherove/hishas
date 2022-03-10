import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import breadCrumbSlice from "../red/slices/breadCrumbSlice";
import { IProp } from "../red/slices/discoverySlice";
import store, { useAppSelector } from "../red/store";

export const NFTInspector = () => {
  const classNames = (text) => text;
  const etherscanAddress= (address:string) => `https://etherscan.io/address/${address}#code`;
  const digAddress= (address:string) => `/nft/${address}?id=0`;
  const propsToShow = useAppSelector(state => state.discovery.propsToShow);
  const router = useRouter();
  const onClickInvestigate = (address: string, nftId: string) => {
        store.dispatch( breadCrumbSlice.actions.onNewCrumb({address,nftId}));
        router.push({ pathname: '/nft/' + address, query: { id: nftId,crumb:1 } }, undefined, { shallow: true });
        }
  const shortenOrLink = (theValue?:string)=>{
    if(theValue===undefined){
      return 'undefined'
    }
    console.dir(theValue);
    if(theValue.toString().startsWith('0x') && theValue?.length ===42){
      return (
        <div className="flex flex-col space-y-2 ">
          <a href={etherscanAddress(theValue)} target={'_blank'} 
          className="text-blue-700 font-mono text-xs truncate w-40 " >
            {theValue}
          </a>
          <a 
          onClick={()=>onClickInvestigate(theValue,"0")}
          href="#" 
          className="text-blue-700 font-mono text-xs truncate w-full " >
            {'--> Dig on HisHas'}
          </a>
        </div>
      );
    }
    if(theValue.length>200){
      return `${theValue.substring(0, 50)}...    (${theValue.length -50} more chars)`
    }
    if(theValue==='true'){
      return <span className="text-green-700 font-mono font-semibold">{theValue}</span>
    }
    if(theValue==='false'){
      return <span className="text-red-600 font-mono font-semibold">{theValue}</span>
    }
    if(!isNaN(Number(theValue))){
      return <span className="text-red-800 font-mono font-semibold ">{theValue}</span>
    }
    return theValue;
  }
  const warning = (p:IProp)=>{
    if(p.severity>0){
      return ' text-red-500 ';
    }
    return '';
  }
  return (
    <div className="
    rounded-lg p-2 space-y-2 w-screen
    md:w-full
    ">
          {propsToShow
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((p) => (
              <div
                key={nanoid()}
                className={`
                flex p-2
                space-x-4
                text-base  bg-stone-300 rounded-lg
                ` +  warning(p)}
              >
                <div className={warning(p) + " w-1/2"}>
                  {p.name}:
                  </div>
                <div className={warning(p) + " w-1/2 font-mono text-xs overflow-ellipsis truncate"}>
                    {shortenOrLink(p.value)}
                </div>
                <div className=" ">
                    {shortenOrLink(p.notes)}
                </div>
              </div>
            ))}
    </div>
  );

}

export default NFTInspector;