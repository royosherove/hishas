import discoverySlice from "../../red/slices/discoverySlice";
import theStore from "../../red/store";
import { IInvestiationLogger, JsonInfo } from "../base/IInvestiationLogger";
import { IInvestigator, IInvestigatorDisplay } from "../base/IInvestigator";


export class DispatchingInvestigationLogger implements IInvestiationLogger {
  logNewAgent(a: IInvestigator): void {
    theStore.dispatch(discoverySlice.actions.onAgentRegister(a));
  }
  logInvestigationStart(agent: IInvestigatorDisplay) {
    theStore.dispatch(discoverySlice.actions.onAgentStart(agent));
    // theStore.dispatch(discoverySlice.actions.onAgentStart({name:agent.name}));
  }
  logInvestigationEnd(agent: IInvestigatorDisplay) {
    theStore.dispatch(discoverySlice.actions.onAgentStop(agent));
    // theStore.dispatch(discoverySlice.actions.onAgentStop({name:agent.name}));
  }
  clearLogs(){
    theStore.dispatch(discoverySlice.actions.clearLogs({}));
  }
  logOwnerCode(code: string,name:string,addressOverride?:string) {
    theStore.dispatch(discoverySlice.actions.onOwnerCode({code,name,address:addressOverride}));
  }
  logCode(code: string,name:string,addressOverride?:string) {
    theStore.dispatch(discoverySlice.actions.onCode({code,name,address:addressOverride}));
  }
  logProp(name: string, value: string, severity:number,notes:string,category:string = '') {
    theStore.dispatch(discoverySlice.actions.onProp({name,value,severity,notes,category}));
  }

  logUriProp(name: string, value: string,category:string) {
    if (
      value.toLowerCase().includes('ipfs') ||
      value.toLowerCase().includes('ar:') 
      ) {
      this.logProp(name, value, 0, '', category)
    }
    else {
      this.logProp(name, value, 100, 'centralized storage: can be replaced or shut down', category);
    }
  }
  logJson(json: JsonInfo) {
    theStore.dispatch(discoverySlice.actions.onJson(json));
  }
  logStatus(msg: string) {
    console.log(msg);
    theStore.dispatch(discoverySlice.actions.onStatus({ status: msg }));
  }
  log(msg: string): void {
    theStore.dispatch(discoverySlice.actions.onLog({ log: msg }));
    console.log(msg);
  }
  logImage(uri: string): void {
   console.log(uri) 
    theStore.dispatch(
      discoverySlice.actions.onImage({
        uri: uri,
        usableUri: this.makeUsableIpfsUri(uri),
      })
    );
  }
  logError(e: any) {
    console.error(e);
    this.log("ERROR: " + e);
  }

  makeUsableIpfsUri(originalUri:string): string {
    if(originalUri.toLowerCase().startsWith('data')){
      return originalUri.substring(0,originalUri.length-1);
    }
    const ipfsPrefix = "ipfs://";
    if (originalUri.includes(ipfsPrefix)) {
      return "https://ipfs.io/ipfs/" + originalUri.substring(ipfsPrefix.length);
    }
    return originalUri;
  }
  async getRemoteFile(uri: string, desc: string) {
    let finalUrl = this.makeUsableIpfsUri(uri);
    this.log(`downloading ${finalUrl}`);

    const response = await fetch(finalUrl);
    const result = await response.json();
    this.log(`gotten: ${JSON.stringify(result)}`);
    return result;
  }
}

