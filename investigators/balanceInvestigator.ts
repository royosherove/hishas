import { ethers } from "ethers";
import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";


export default class BalanceInvestigator extends InvestigatorBase{
  name: string = "Royalties Agent";


  async runChecks(params:InvestigationParams) {
    const contract = params.clientMaker.makeClientContract( params.address,[]);
    const balance = await contract.provider.getBalance(params.address)
    const formatted = ethers.utils.formatEther(balance);
    params.logger.logProp('balance ',formatted,0,' Ether','prop')
  }
}
