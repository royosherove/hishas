import { IInvestigator, IInvestigatorDisplay } from "./IInvestigator";

export interface JsonInfo{
  jsonRaw:string,
  jsonPath:string,
  jsonUsablePath:string
}
export interface IInvestiationLogger {
    logInvestigationStart(agent:IInvestigatorDisplay);
    logInvestigationEnd(agent:IInvestigatorDisplay);
    logStatus(msg: string): void;
    logUriProp(value: string, name: string,category:string);
    logProp(name:string,value:string,severity:number,notes:string,category:string);
    logCode(code:string,name:string,addressOverride?:string);
    logOwnerCode(code:string,name:string,addressOverride?:string);
    log(msg: string): void;
    logJson(json:JsonInfo);
    logImage(uri: string,desc:string): void;
    logError(e: any);
}
