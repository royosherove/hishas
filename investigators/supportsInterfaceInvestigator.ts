import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";


export default class SupportsInterfaceInvestigator extends InvestigatorBase {
  name: string = "supportsInterface Agent";

  async runChecks(params: InvestigationParams): Promise<void> {
    await this.supports(params.address, "0x01ffc9a7", "EIP-165",params,true);
    await this.supports(params.address, "0x80ac58cd", "EIP-721",params,true);
    await this.supports(params.address, "0x5b5e139f", "ERC-721Metadata",params,true);
    await this.supports(params.address, "0x780e9d63", "ERC-721_Enumerable",params);
    await this.supports(params.address, "0x2a55205a", "ERC-2981-NFT Royalties",params);
  }

  async supports(address: string, iface: string, desc: string,params:InvestigationParams,strict:boolean=false) {
    try {
      const contract = params.clientMaker.makeClientContract(
        address,
        [
          "function supportsInterface(bytes4 interfaceID) external view returns (bool)",
        ],
      );

      params.logger.log(`Check support for ${desc} (${iface})`);
      const hasSupport = await contract.supportsInterface(iface);
      if(hasSupport || !strict){
        params.logger.logProp( `supports ${desc} (${iface})`,hasSupport.toString(),0,'','interfaces');
      }else{
        params.logger.logProp( `supports ${desc} (${iface})`,hasSupport.toString(),hasSupport?0:100,'','interfaces');
      }
      params.logger.log(`result: (${hasSupport})`);
    } catch (e) {
      params.logger.logError("error checking - probably means no");
      params.logger.logProp( `supports ${desc} (${iface})`,
        "error",
        100,
        'no supporsInterface() method detected. Could be an issue.',
        "interfaces")
    }
  }
}
