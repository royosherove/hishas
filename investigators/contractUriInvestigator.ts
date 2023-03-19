import { InvestigationParams } from "./base/IInvestigator";
import { IInvestiationLogger } from "./base/IInvestiationLogger";
import { InvestigatorBase } from "./base/InvestigatorBase";




export default class ContractUriInvestigator extends InvestigatorBase {
  //as per https://docs.opensea.io/docs/contract-level-metadata
  name: string = "ContractURI Agent";

  async runChecks(params: InvestigationParams) {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      [
        "function contractURI() public view returns (string memory)",
      ]
    );

    params.logger.log(`Check uris`);
    const contractUri = await this.propCheck(()=> contract.contractURI(), 'contractURI', params.logger);

    if (contractUri !== undefined) {
      params.logger.logUriProp('contractUri', contractUri, 'meta');
      try {
        const fixedUri = params.downloader.fixPlaceholders(contractUri);
        // params.logger.logProp("Trying contractUri...", fixedUri, 0, '', 'meta')
        
        const metadata = await params.downloader.getRemoteJson(fixedUri, "contractUri metadata", params.logger);
        params.logger.logProp('contracturi json',JSON.stringify(metadata),0,'','meta')

        if (metadata === undefined) {
          params.logger.logProp("contract URI Metadata", "NOT AVAILABLE", 0, 'used for opensea extra metadata', 'meta')
          return;
        }
        const metadataAsJson = JSON.parse(JSON.stringify(metadata));
        const usablePath = params.downloader.makeUsableIpfsUri(fixedUri);

        params.logger.logJson({ jsonUsablePath: usablePath, jsonPath: fixedUri, jsonRaw: metadataAsJson });
        params.logger.log(`result: ${metadataAsJson}`);

        const externlLink: string = metadataAsJson['external_link'];
        params.logger.logUriProp('contractUri.external_link',externlLink,'meta');

        const image: string = metadataAsJson['image'];
        const imageUsable = params.downloader.makeUsableIpfsUri(image);
        params.logger.logUriProp('contractUri.image',imageUsable,'meta');
        params.logger.logImage(imageUsable,"contractUri.image");

      } catch (e) {
        if (e.message.includes('revert')) {
          params.logger.log("contract function missing... moving on.." + e);
          return;
        } else {
          params.logger.logError(e);
        }
      }
    }
  }
  async propCheck(func, name: string, logger: IInvestiationLogger) {
    try {
      logger.log(`checking : ${name}`);
      const result = await func();
      logger.log(`found : ${result}`);
      return result;
    } catch (e) {
      logger.logError(e);
      return undefined;
    }
  }

}
