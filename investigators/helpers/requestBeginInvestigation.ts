import SupportsInterfaceInvestigator from "../supportsInterfaceInvestigator";
import metadataInvestigator from "../metadataInvestigator";
import PropsInvestigator from "../propsInvestigator";
import CodeInvestigator from "../codeInvestigator";
import BalanceInvestigator from "../balanceInvestigator";
import Downloader, { IDownloader } from "./downloader";
import { IInvestigator } from "../base/IInvestigator";
import { ClientMaker, IClientMaker } from "./clientMaker";
import { DispatchingInvestigationLogger } from "./dispatchingInvestigationLogger";
import ContractUriInvestigator from "../contractUriInvestigator";
import UpgradEventsInvestigator from "../upgradeEventsInvestigator";
import Etherscanelper from "./etherscanHelper";
import RoyaltiesInvestigator from "../royaltiesInvestigator";
import CryptoKittiesInvestigator from "../specific/CryptoKittiesInvestigator";
import PunkInvestigator from "../specific/punkInvestigator";
import OwnerInvestigator from "../ownerInvestigator";
import ProxyInvestigator from "../proxyInvestigator";


export const requestBeginInvestigation = async (address: string,nftId:string) => {

  const downloader = new Downloader({address})
  const codeDownloader = new Etherscanelper();
  const clientMaker:IClientMaker = new ClientMaker();
  const logger = new DispatchingInvestigationLogger();
  logger.clearLogs();
  logger.logStatus("investigating");
  logger.log(address);
  const investigators:IInvestigator[] = [
    new ProxyInvestigator(),
    new SupportsInterfaceInvestigator(),
    new PropsInvestigator(),
    new OwnerInvestigator(),
    new metadataInvestigator(),
    new CodeInvestigator(),
    new BalanceInvestigator(),
    new ContractUriInvestigator(),
    new UpgradEventsInvestigator(),
    new RoyaltiesInvestigator(),
    new PunkInvestigator(),
    new CryptoKittiesInvestigator(),
  ];
  const params = {address,nftId, logger,downloader,clientMaker,Etherscanelper};


  investigators.forEach(a=> logger.logNewAgent(a))
  try {
    const promises:Promise<void>[] = investigators.map((i) => {
      if (i.canHandle(address)) {
        return i.investigate({address,nftId, logger,downloader,clientMaker,codeDownloader});
      }else{
        i.status = 'skipped';
        return Promise.resolve();
      }
    });
    
    await Promise.all(promises);
  } catch (e) {}

};

export default {
    requestBeginInvestigation
}
