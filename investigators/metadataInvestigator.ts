import { InvestigationParams } from "./base/IInvestigator";
import { IInvestiationLogger } from "./base/IInvestiationLogger";
import { InvestigatorBase } from "./base/InvestigatorBase";




export default class metadataInvestigator extends InvestigatorBase {
  name: string = "Metadata Agent";

  async runChecks(params: InvestigationParams) {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      [
        "function baseURI() public view virtual returns (string memory)",
        "function uri(uint256) public view  override returns (string memory)",
        "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
      ]
    );

    params.logger.log(`Check uris`);
    const baseUri = await this.propCheck(contract.baseURI, 'baseUri', params.logger);
    const uri = await this.propCheck(() => contract.uri(params.nftId), 'uri', params.logger);
    const tokenUri = await this.propCheck(() => contract.tokenURI(params.nftId), `tokenUri(${params.nftId})`, params.logger);
    let finalUri: string;

    if (baseUri !== undefined) {
      this.logUriProp(baseUri, 'baseUri', params.logger);
    }
    if (uri !== undefined) {
      this.logUriProp(uri, 'uri - metadata', params.logger);
      finalUri = uri;
    }
    if (tokenUri !== undefined) {
      this.logUriProp(tokenUri, 'tokenUri - metadata', params.logger);
      finalUri = tokenUri;
    }
    try {

      // params.logger.logProp("Trying finalUri...", finalUri, 0, '', 'meta')
      const metadata = await params.downloader.getRemoteJson(finalUri, "metadata", params.logger);
      if (metadata === undefined) {
        params.logger.logProp("Metadata", "NOT AVAILABLE", 100, 'metadta not fetchable?', 'meta')
        params.logger.logError("METADATA NOT FETCHED")
        return;
      }
      const usablePath = params.downloader.makeUsableIpfsUri(finalUri);
      params.logger.logJson({ jsonUsablePath: usablePath, jsonPath: finalUri, jsonRaw: metadata });
      params.logger.log(`result: ${metadata}`);
      let image =undefined;
      if (metadata.image!==undefined) {
        image = metadata.image;
      }
      if (metadata.image_data!==undefined) {
        image = metadata.image_data;
      } if (metadata.imageUrl!==undefined) {
        image = metadata.imageUrl;
      }
      const imageUsable = params.downloader.makeUsableIpfsUri(image);
      params.logger.logImage(imageUsable);
      this.logUriProp(imageUsable, 'image', params.logger);
    } catch (e) {
      if (e.message.includes('revert')) {
        params.logger.log("contract function missing... moving on.." + e);
        return;
      } else {
        params.logger.logError(e);
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
  logUriProp(value: string, name: string, logger: IInvestiationLogger) {
    if (value.toLowerCase().includes('data:application/json')) {
      logger.logProp(name, value, 0, 'json embedded in metadata.', 'meta')
      return;
    }
    if (value.toLowerCase().includes('data:image/svg')) {
      logger.logProp(name, value, 0, 'image embedded in metadata.', 'meta')
      return;
    }
    if (value.toLowerCase().includes('ipfs')) {
      logger.logProp(name, value, 0, '', 'meta')
      return;
    }
      logger.logProp(name, value, 100, 'non-ipfs: can be replaced or shut down', 'meta');

  }

}
