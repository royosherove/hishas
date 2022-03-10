import { Contract, ethers } from "ethers";
import { IInvestiationLogger } from "./base/IInvestiationLogger";
import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";

export default class ProxyInvestigator extends InvestigatorBase{
    name: string = "Proxy Investigator";
    async runChecks(params: InvestigationParams): Promise<void> {
      const code = await (await params.codeDownloader.getCode(params)).sourceCode;
      const contract = params.clientMaker.makeClientContract(params.address,[ ])
      if(code!==undefined&& code.includes('masterCopy') || code.includes('singleton')){
        const mastercopyAdrress = await this.checkStorage(
          contract,
          params.address,
          '0x0',params,
          "Proxy mastercopy Address"
        );
      }
        const logicAddress = await this.checkStorage(
          contract,
          params.address,
          "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
          params,
          "Proxy Logic Address"
        );
        const beaconAddress = await this.checkStorage(
          contract,
          params.address,
          "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50 ",
          params,
          "Proxy Beacon Address"
        );
        const proxyAdminAddress = await this.checkStorage(
          contract,
          params.address,
          "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103 ",
          params,
          "Proxy Admin Address"
        );

    }


}