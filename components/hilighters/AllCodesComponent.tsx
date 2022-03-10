import { useAppSelector } from "../../red/store";
import ContractCodeSyntax from "./SolidityCodeComponent";

export const AllCodes = ()=>{
    const codes = useAppSelector(state=>state.discovery.codes);
    const ownerCodes = useAppSelector(state=>state.discovery.ownerCodes);
    const renderOwnerCodes =()=>{
    if(ownerCodes.length===0){
        return <></>
    }    
    return (
          <div className="bg-red-300 mt-6 rounded-md">
              <div className="font-mono text-sm">Owner Contract Code:</div>
            <ContractCodeSyntax codesCollection={ownerCodes} />
          </div>
        )
    }
    return (
      <div className="">
          {renderOwnerCodes()}
          <ContractCodeSyntax codesCollection={codes} />
      </div>
    );

}

export default ContractCodeSyntax;