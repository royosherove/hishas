import { InvestigationParams } from "../base/IInvestigator";
import { ETHERSCAN_KEY } from "../../EnvConsts";

export interface ICodeDownloader{
    getCode(params:InvestigationParams,overrideAddress?:string):Promise<CodeResult>
}
export interface CodeResult{
    sourceCode:string,
    ABI:string,
    status:string
}
export default class Etherscanelper implements ICodeDownloader{

  async getCode(params: InvestigationParams,overrideAddress:string=undefined):Promise<CodeResult> {
    params.logger.log("getting the CODE CODE CODE");
    const baseUrl = "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=";
    const apiUrl = `${baseUrl}${overrideAddress || params.address}&apikey=${ETHERSCAN_KEY}`;
    const result = await fetch(apiUrl);
    const resultJson = await result.json();
    const {status,SourceCode,ABI} = resultJson.result[0];

    return {status,sourceCode:SourceCode,ABI};
  }
}