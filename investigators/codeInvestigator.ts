import { Signer } from "ethers";
import { ICodeData } from "../red/slices/discoverySlice";
import { InvestigationParams } from "./base/IInvestigator";
import { InvestigatorBase } from "./base/InvestigatorBase";
import { CodeResult } from "./helpers/etherscanHelper";

export default class CodeInvestigator extends InvestigatorBase {
  name: string = "Upgradeability Agent";

    checkForSourceOneLevelDown(codes:any){
      console.log('checkForSourceOneLevelDown')
      console.dir(codes);
        if(codes.length>0 && codes[0].code !== undefined && codes[0].code.startsWith('{')){
            // console.log(codes[0].code)
            const toSplit:string = codes[0].code;
            console.info("SPLITTING");
            const objectified = JSON.parse(toSplit)
            console.dir(objectified)
            return objectified;
        }
        return codes;
    }
  async runChecks(params: InvestigationParams): Promise<void> {
      const codeResult:CodeResult = await params.codeDownloader.getCode(params);
      this.parseAndLogAllSources(params.logger.logCode,codeResult,params,'code');
      await this.checkForExistanceOfFunctionsInCode(codeResult, params);
  }

  private async checkForExistanceOfFunctionsInCode(codeResult: CodeResult, params: InvestigationParams) {
    this.checkFunctionExists("function upgrade", codeResult.sourceCode, params);
    this.checkFunctionExists("function setBaseURI", codeResult.sourceCode, params);
    this.checkFunctionExists("function setBaseTokenURI", codeResult.sourceCode, params);
    this.checkFunctionExists("function setNextContract", codeResult.sourceCode, params);
    this.checkFunctionExists("function setTokenURIPrefix", codeResult.sourceCode, params);
    this.checkFunctionExists("function updateBaseUri", codeResult.sourceCode, params);
    this.checkFunctionExists("function setURIs", codeResult.sourceCode, params);
    this.checkFunctionExists("function setContractURI", codeResult.sourceCode, params);
    this.checkFunctionExists("function secureBaseUri", codeResult.sourceCode, params);
    this.checkFunctionExists("function setBaseExtension", codeResult.sourceCode, params);
    this.checkFunctionExists("function setNewAddress", codeResult.sourceCode, params);
    this.checkFunctionExists("function setMetadataAddress", codeResult.sourceCode, params);
    if (codeResult.sourceCode.includes('MerkleProof.verify(')) {
      params.logger.logProp('Whitelist', 'exists', 0, 'found MerkleProof.verify()', 'code');
    }
    if (codeResult.sourceCode.includes('contractLocked')) {
      const contract = params.clientMaker.makeClientContract(params.address, codeResult.ABI);
      const isLocked = await this.propCheck(() => contract.contractLocked(), 'contractLocked', params.logger, 'true', 'contract is NOT locked for changes');
    }
    if (codeResult.sourceCode.includes('newContractAddress')) {
      const contract = params.clientMaker.makeClientContract(params.address, codeResult.ABI);
      await this.propCheck(() => contract.newContractAddress(), 'newContractAddress', params.logger);
    }
    if (codeResult.sourceCode.includes(' nextContract')) {
      const contract = params.clientMaker.makeClientContract(params.address, codeResult.ABI);
      await this.propCheck(() => contract.nextContract(), 'nextContract', params.logger);
    }
  }

  private checkFunctionExists(
    toFind: string,
    sourceCode: string,
    params: InvestigationParams
  ) {
    if (sourceCode.toLowerCase().includes(toFind.toLowerCase())) {
      params.logger.logProp(
        toFind + " found",
        "could be upgradeable",
        100,
        "Upgredable contracts or URIs can be rugpulled in the future",
        "code"
      );
    }
  }
}
