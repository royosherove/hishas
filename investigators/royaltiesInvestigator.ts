import { ethers } from "ethers";
import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";


export default class RoyaltiesInvestigator extends InvestigatorBase{
  name: string = "Balance Agent";


  async runChecks(params:InvestigationParams) {
    const contract = params.clientMaker.makeClientContract( params.address,[
      'function royaltyInfo(uint256 tokenId, uint256 salePrice) external view override returns (address receiver, uint256 royaltyAmount)'
    ]);
    const royaltyInfo = await contract.royaltyInfo(params.nftId,100);
    params.logger.logProp('royaltyInfo() receiver',royaltyInfo.receiver.toString(),0,'royalty receiver address','royalty');
    params.logger.logProp('royaltyInfo() %',royaltyInfo.royaltyAmount.toString(),0,'% per sale to receiver','royalty');
    await this.balanceCheck(()=>contract.provider.getBalance(royaltyInfo.receiver.toString()),'Royalty Receiver Balance()',params.logger,'royalty');
  }
}
