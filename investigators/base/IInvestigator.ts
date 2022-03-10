import { IClientMaker } from "../helpers/clientMaker";
import { IDownloader } from "../helpers/downloader";
import { ICodeDownloader } from "../helpers/etherscanHelper";
import { IInvestiationLogger } from "./IInvestiationLogger";

export interface InvestigationParams{
    address:string,
    nftId:string,
    logger:IInvestiationLogger,
    downloader: IDownloader,
    clientMaker: IClientMaker,
    codeDownloader: ICodeDownloader
}
export interface IInvestigator{
    name:string;
    status:string;
    canHandle( contractAddress:string):boolean
    investigate(params:InvestigationParams):Promise<void>;
}
export interface IInvestigatorDisplay{
    name:string;
    status:string;
    isWorking:boolean;
}


