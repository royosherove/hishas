import { IInvestiationLogger } from "../base/IInvestiationLogger";
import { InvestigationParams } from "../base/IInvestigator";




export interface IDownloader{
  fixPlaceholders (originalUri:string):string;
  makeUsableIpfsUri(originalUri): string;
  getRemoteJson(uri: string, desc: string, logger: IInvestiationLogger);
}

export interface DownloaderParams{
  address:string
}
export default class Downloader implements IDownloader {

  params:DownloaderParams
  constructor(params:DownloaderParams) {
    this.params = params;
    
  }
  fixPlaceholders (originalUri:string):string{
    const result = originalUri.replace('{address}',this.params.address);
    console.info(result);
    return result;
  }
  makeUsableArweaveUri(originalUri:string): string {
    const PREFIX = 'https://arweave.net/';
    return PREFIX + originalUri.split("//")[1];
  }
  makeUsableIpfsUri(originalUri:string): string {
    // return originalUri;
    if(originalUri.toLowerCase().includes('ar:')){
      return this.makeUsableArweaveUri(originalUri);
    }

    if (originalUri.toLocaleLowerCase().startsWith('data')) {
      return originalUri;
    }
    const noPlaceholder = this.fixPlaceholders(originalUri);
    let fixed = noPlaceholder.replace('ipfs://ipfs','')
    fixed = fixed.replace('ipfs:','')
    fixed = fixed.replace('ipfs','')
    console.info('fixed',fixed)

    if (fixed.startsWith('/')) {
      return "https://ipfs.io/ipfs" + fixed;
    }
    if (!fixed.toLowerCase().startsWith('http')) {
      return "https://ipfs.io/ipfs/" + fixed;
    }
    return noPlaceholder;;
  }

  Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}
  async getRemoteJson(uri: string, desc: string, logger: IInvestiationLogger) {
    try {
      if (uri.toLowerCase().startsWith('data:application/json')) {
        const toDecode = Buffer.from(uri.substring(28),'base64');
        return JSON.parse(this.Utf8ArrayToStr(toDecode));
      }
      let finalUrl = this.makeUsableIpfsUri(uri);
      logger.log('downloading ' + finalUrl)

      const response = await this.tryFetch(finalUrl, logger);
      // const response = await fetch(finalUrl,{mode:'cors'});
      console.info("GOT RESPONSE:");
      console.dir(response);
      const result = await response.json();
      logger.log(JSON.stringify(result));
      return result;
    } catch (e) {
      logger.logError(e);
      return undefined;
    }
  }


  async tryFetch(uri: string, logger: IInvestiationLogger) {
    try {
      const response1 = await fetch(uri);
      // logger.logProp('fetch with cors', 'success', 0, '', 'meta');
      return response1;
    } catch (e) {
      try {
        // const prefix = 'http://localhost:8080/';
        const prefix = 'http://104.248.100.150:8080/';
        const finalStripped = prefix + uri
        // logger.logProp('fetch with cors', 'failed', 100, 'trying with proxy...', 'meta');
        // logger.logProp('proxy url', finalStripped, 0, '', 'meta');
        const response2 = await fetch(finalStripped);
        // logger.logProp('fetch with cors proxy', 'success', 0, '', 'meta');
        return response2;
      } catch (e2) {
        // logger.logProp('fetch with cors proxy', 'failed', 100, 'cannot seem to be fetchable?', 'meta');
        logger.logError(e2);
        return undefined;

      }

    }

  }

}
