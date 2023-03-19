import { InvestigationParams } from "../base/IInvestigator";
import { InvestigatorBase } from "../base/InvestigatorBase";

export default class CryptoKittiesInvestigator extends InvestigatorBase{
  name: string = "CryptoKitties Agent"

  async runChecks(params: InvestigationParams): Promise<void> {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      ["function getKitty(uint256 id)"],
    );

    try {
      params.logger.logUriProp('metadata uri',`https://public.api.cryptokitties.co/v1/kitties/${params.nftId}`,'kitty')
      const apiUrl = `https://api.cryptokitties.co/kitties/${params.nftId}`;
      params.logger.logUriProp('metadata fan api uri',apiUrl,'kitty')
      const json =  await params.downloader.getRemoteJson(apiUrl,'kitten details api call',params.logger);
      params.logger.logJson({jsonPath:'',jsonRaw:json,jsonUsablePath:''})
      params.logger.logImage(json.image_url,'kitty image')

      // params.logger.log(JSON.stringify(result));
    } catch (e) {
      
      params.logger.logError(e);
    }
  }

   canHandle(intertfaceId: string): boolean {
    if (
      intertfaceId.toLowerCase() ===
      "0x06012c8cf97bead5deae237070f9587f8e7a266d".toLowerCase()
    ) {
      return true;
    }
    return false;
  }

}
