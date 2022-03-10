import { InvestigationParams } from "./base/IInvestigator";
import { IInvestiationLogger } from "./base/IInvestiationLogger";
import { InvestigatorBase } from "./base/InvestigatorBase";
import { ethers } from "ethers";


export default class OwnerInvestigator extends InvestigatorBase{
  name: string = "Owner Agent";


  async runChecksOnAdminContract(params:InvestigationParams,adminAddress:string ) {
    const contract = params.clientMaker.makeClientContract(
      adminAddress,
      [
        "function getOwners() public view returns (address[]) ",
        "function getAdmin() public view returns (address) ",
        "function implementation() public view returns (address) ",
      ]
    );
      const implementation = await this.propCheck(()=>contract.implementation(),"Multisign Wallet Owners",params.logger);
      if(implementation!==undefined){
        //recursive until we don't find any implementation of a proxy
        // this.investigateOwnerContract(contract,implementation, params);
        return;
      }
      const owners = await this.propCheck(()=>contract.getOwners(),"Multisign Wallet Owners",params.logger);
      if(owners!==undefined && adminAddress!==params.address){
        params.logger.logProp("Admin Contract Owner :",adminAddress, 0,owners.length + " multisig owners","owner")
        console.dir(owners);
      }
      if(owners!==undefined && params.address === adminAddress){
        for (let index = 0; index < owners.length; index++) {
          const ownerAddress = owners[index];
          const balance = await contract.provider.getBalance(ownerAddress);
          const formatted = ethers.utils.formatEther(balance);
          params.logger.logProp(`Admin Controller ${index+1}/${owners.length} balance() `,formatted,0,ownerAddress,'owner')
        }

        }
      }
  
  async runChecks(params:InvestigationParams) {
    await this.checkAddress(params);
   
  }

  private async checkAddress(params: InvestigationParams) {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      [
        "function owner() public view returns (address) ",
        "function getAdmin() public view returns (address) ",
        "function proxyOwner() public view returns (address) ",
      ]
    );
    // const contract = params.clientMaker.makeClientContract( params.address,abi);
    let ownerAddress;
    if (ownerAddress === undefined) {
      ownerAddress = await this.propCheck(() => contract.proxyOwner(), "proxyOwner()", params.logger);
    }
    if (ownerAddress === undefined) {
      ownerAddress = await this.propCheck(() => contract.owner(), "owner()", params.logger);
    }
    if (ownerAddress === undefined) {
      ownerAddress = await this.propCheck(() => contract.getAdmin(), "getAdmin()", params.logger);
    }
    let burnedOwner = false;
    if (ownerAddress === '0x0000000000000000000000000000000000000000') {
      params.logger.logProp('contract owner address BURNED', 'true', 0, 'the owner address cannot be controlled (good!)', 'owner');
      burnedOwner = true;
    }

    if (ownerAddress !== undefined  && ownerAddress!==params.address) {
      await this.investigateOwnerContract(contract, ownerAddress, params);
    }
      await this.investigateOwnerContract(contract, params.address, params);
  }

  private async investigateOwnerContract(contract: ethers.Contract, ownerAddress: string, params: InvestigationParams) {
    if(ownerAddress!==params.address){
      await this.balanceCheck(() => contract.provider.getBalance(ownerAddress), "contract owner balance()", params.logger, 'owner');
    }
    const bytecode = await contract.provider.getCode(ownerAddress);
    if (bytecode.toLowerCase() === '0x') {
      params.logger.logProp('contract owner address code', bytecode, 100, 'owner is a regular account, not a multi-sig smart contract', 'owner');
    } else {
      await this.parseOwnerCodes(params, ownerAddress, contract);
    }
    await this.runChecksOnAdminContract(params, ownerAddress);
  }

  private async parseOwnerCodes(params: InvestigationParams, ownerAddress: string, contract: ethers.Contract) {
    if(ownerAddress===params.address){
      return;
    }
    const ownerCode = await params.codeDownloader.getCode(params, ownerAddress);
    if (ownerCode.sourceCode?.toString().includes('GnosisSafeProxy')) {
      params.logger.logProp("Owner: GnosisSafeProxyFactory", "Found", 0, "Likley Gnosis Safe Multisig Wallet", 'owner');

    }
    if (ownerCode.sourceCode?.toString().includes('0xa619486e')) {
      params.logger.logProp("0xa619486e storage found", 'found', 0, "Likley proxy implementation", 'owner');
      await this.checkStorage(contract, ownerAddress, '0xa619486e', params, 'Glonosis Proxy Implementation', 'owner');
    }
    if (ownerCode.sourceCode?.toString().includes('contract AragonApp')) {
      params.logger.logProp("Owner: AragonApp", "Found", 0, "Aragon OS contrats are usually upgradeable", 'owner');
    }
    await this.parseAndLogAllSources(params.logger.logOwnerCode, ownerCode, params, 'owner', ownerAddress);
  }
}
