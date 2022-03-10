import { Contract, ethers, logger } from "ethers";
import { CodeResult } from "../helpers/etherscanHelper";
import { IInvestiationLogger } from "./IInvestiationLogger";
import { IInvestigator, InvestigationParams } from "./IInvestigator";

export abstract class InvestigatorBase implements IInvestigator {
  status:string =''
  abstract name:string
  isWorking:boolean = false;

  abstract  runChecks(params:InvestigationParams):Promise<void>;
  canHandle(intertfaceId: string): boolean {
    return intertfaceId.toLowerCase().substring(0, 2) === "0x";
  }
  async parseAndLogAllSources(logginFunc:(code:string,name:string,address:string)=>void,codeResult:CodeResult,params:InvestigationParams,propName:string,addressLinkOverride?:string): Promise<void> {
    try {
      console.dir(codeResult);

      if (codeResult.ABI === "Contract source code not verified") {
        params.logger.logProp("Code", "not verified!", 100,
          "contract code has not been verified on etherscan.", propName
        );
        params.logger.logProp("etherscan result", JSON.stringify(codeResult), 100,
          "contract code has not been verified on etherscan.",
          propName
        );
        return;
      }
      let sourceObj;
      if (codeResult.sourceCode.startsWith("{{")) {
        sourceObj = JSON.parse(codeResult.sourceCode.substring(1).substring(0, codeResult.sourceCode.length - 2));
      } else {
        if (codeResult.sourceCode.startsWith('{')){
          sourceObj = JSON.parse(codeResult.sourceCode);
        } else {
          logginFunc(codeResult.sourceCode, addressLinkOverride || 'file',addressLinkOverride);
        }
      }
      if (sourceObj !== undefined) {
        console.dir(sourceObj)
        if (sourceObj.sources !== undefined) {
          const keys = Object.keys(sourceObj.sources)
          keys.forEach((key) => {
            logginFunc(sourceObj.sources[key].content, addressLinkOverride || key,addressLinkOverride);
          });
        }
        if (sourceObj.sourceCode === undefined) {
          const keys = Object.keys(sourceObj)
          keys.forEach((key) => {
            logginFunc(sourceObj[key].content, addressLinkOverride || key,addressLinkOverride);
          });
        }
      }


    } catch (e) {
      this.status = "error";
      params.logger.logError(e);
    }
  }
  async balanceCheck(func,name:string,logger:IInvestiationLogger,category:string,expected:string=undefined,failureNotes:string=''){
    try {
      logger.log(`checking : ${name}`);
      const result = await func();
      const formatted = ethers.utils.formatEther(result);
      this.runLogsForProp(expected, formatted, logger, name, failureNotes);
      return result;
    } catch (e) {
      logger.logProp(name,e.message,100,'',category)
      logger.logError(e);
    }

  }
  async propCheck(func,name:string,logger:IInvestiationLogger,expected:string=undefined,failureNotes:string=''){
    try {
      logger.log(`checking : ${name}`);
      const result = await func();
      this.runLogsForProp(expected, result, logger, name, failureNotes);
      return result;
    } catch (e) {
      // logger.logProp(name,e.message,100,'','prop')
      logger.logError(e);
    }

  }
  private runLogsForProp(expected: string, result: any, logger: IInvestiationLogger, name: string, failureNotes: string) {
    try {
    if (expected !== undefined) {
      if (result.toString() === expected) {
        logger.logProp(name, result.toString(), 0, '', 'prop');
      } else {
        logger.logProp(name, result.toString(), 100, failureNotes, 'prop');
      }
    } else {
      logger.logProp(name, result.toString(), 0, '', 'prop');
    }
    logger.log(`found : ${result}`);
    } catch (e) {
      logger.logProp(name,'error',100,'','prop')
      logger.logError(e);
    }
  }

  async investigate(params: InvestigationParams): Promise<void> {
    this.isWorking=true;
    this.status = "working...";
    params.logger.logInvestigationStart({name:this.name,status:this.status,isWorking:this.isWorking});

    try {
      await this.runChecks(params);
      this.status = "done.";
    } catch (e) {
      params.logger.logError(e);
      this.status = "error";
    }

    this.isWorking=false;
    params.logger.logInvestigationEnd({name:this.name,status:this.status,isWorking:this.isWorking});
  }
    async checkStorage(contract:Contract,contractAddress:string,location:string,params:InvestigationParams,description:string,category:string = 'proxy'){
        try {
            const result =await contract.provider.getStorageAt(contractAddress,location);
            const normalized =  this.normalizeAddress(result);
            if(normalized ==='0x0000000000000000000000000000000000000000'){
            // params.logger.logProp(description,normalized,0,'',category);
                return result;
            }
            params.logger.logProp(description,normalized,0,'',category);
            return normalized;
        } catch (e) {
            console.error(e);
        }
    }
    normalizeAddress(address:string):string{
        if(address.startsWith('0x0000')){
            return '0x' + address.substring(26);
        }
        return address;

    }
}
