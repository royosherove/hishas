import { InvestigationParams } from "./base/IInvestigator";
import { IInvestiationLogger } from "./base/IInvestiationLogger";
import { InvestigatorBase } from "./base/InvestigatorBase";
import OwnerInvestigator from "./ownerInvestigator";


export default class PropsInvestigator extends InvestigatorBase{
  name: string = "Basic Props Agent";


  async runChecks(params:InvestigationParams) {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      [
        "function symbol() public view  returns (string memory)",
        "function name() public view  returns (string memory)",
        "function totalSupply() public view returns (uint256) ",
        "function ownerOf(uint256 tokenId) public view returns (address) ",
        "function paused() public view returns (bool) ",
      ]
    );
    await this.propCheck(()=>contract.name(),"name()",params.logger);
    await this.propCheck(()=>contract.symbol(),"symbol()",params.logger);
    await this.propCheck(()=>contract.totalSupply(),"totalSupply()",params.logger);
    await this.propCheck(()=>contract.paused(),"paused()",params.logger,'false','Contract is paused!');
    const nftOwner = await this.propCheck(()=>contract.ownerOf(params.nftId),"NFT OwnerOf(id)",params.logger);
    if(nftOwner!==undefined && !nftOwner.toString().startsWith('0x0000')){
      await this.balanceCheck(()=>contract.provider.getBalance(nftOwner),"NFT Owner wallet balance()",params.logger,'owner');
    }
  }
}
