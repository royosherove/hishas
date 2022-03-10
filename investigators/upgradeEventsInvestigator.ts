import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";
import { CodeResult } from "./helpers/etherscanHelper";


export default class UpgradEventsInvestigator extends InvestigatorBase{
  name: string = "Upgrade Event Agent";


  async checkEventByName(params:InvestigationParams,name:string,codeResult:CodeResult){
    if (!codeResult.ABI.toLowerCase().includes(`event ${name}`)) {
      return;
    }
    const contract = params.clientMaker.makeClientContract(
      params.address,
      [
        `event ${name} (address implementation)`,
      ]
    );
    console.dir(contract.interface.events);
    // const upgradeEvent = await contract.interface.events.Upgraded;
    params.logger.log(`getting event logs for ${name}:` );
    // console.log(upgradeEvent);
    const filter = contract.filters[name](null);
    const logs = await contract.queryFilter(filter);
    logs.forEach(log=>{
      console.dir(log);
      params.logger.logProp(`${name}() happened at block ${log.blockNumber}`,log.args[0],100,'address of new implementation contract','events');
    })

  }
  async runChecks(params:InvestigationParams) {
    const codeResult = await params.codeDownloader.getCode(params);
    await this.checkEventByName(params,'Upgraded',codeResult);
    await this.checkEventByName(params,'ContractUpgrade',codeResult);
  }
}
