import { useAppSelector } from "../../red/store";
import hljs from 'highlight.js';
import solidity from 'highlightjs-solidity'
import parse from 'html-react-parser';
import '../../node_modules/highlight.js/styles/atom-one-dark.css'
import { ICodeData } from "../../red/slices/discoverySlice";

export interface CodeSyntaxProps{
    codesCollection:ICodeData[]
}
export const ContractCodeSyntax = (props:CodeSyntaxProps)=>{
    solidity(hljs);
    const codes = props.codesCollection;
    const targetAddress = useAppSelector(state=>state.discovery.targetAddress);
    const etherscanAddress= (code:ICodeData) => `https://etherscan.io/address/${code.address || targetAddress}#code`;
    const highlight = (code) => {
      try {
        const htmlString =  hljs.highlight(code, { language: "solidity" }).value;
        const toRender = parse(htmlString);
        return toRender; 
      } catch (e) {
          console.error(e)
         return code; 
      } 
    };
    if(codes.length===0 ){
        return <></>
    }
    return (
      <div className="md:py-2 w-screen md:w-screen">
          { codes.filter(c=>c.code).map(code=>

                <div className="w-screen p-2 ">
                    <div className="text-xs font-mono break-all">Code: {code.name} </div>
                    <pre className="
                    max-h-96 overflow-y-scroll break-normal  rounded-md
                    md:w-2/3 
                    ">
                        <code className="langauge-typescript hljs break-all hidden md:block ">
                            {highlight(code.code)}
                        </code>
                    </pre>
                    <a href={etherscanAddress(code)} 
                        target={'_blank'} 
                        className="text-blue-700 underline font-mono text-xs p-2 block truncate overflow-ellipsis ">
                            {etherscanAddress(code)}
                    </a>
                </div>
            )
            }
      </div>
    );

}

export default ContractCodeSyntax;