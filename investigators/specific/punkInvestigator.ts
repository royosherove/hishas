import { InvestigationParams } from "../base/IInvestigator";
import { InvestigatorBase } from "../base/InvestigatorBase";

export default class PunkInvestigator extends InvestigatorBase{
  name: string = "Punks Agent"

  async runChecks(params: InvestigationParams): Promise<void> {
    const contract = params.clientMaker.makeClientContract(
      params.address,
      ["function getPunk(uint punkIndex)"],
    );

    const result = await contract.getPunk(params.nftId);
    params.logger.log(JSON.stringify(result));
  }

   canHandle(intertfaceId: string): boolean {
    if (
      intertfaceId.toLowerCase() ===
      "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb".toLowerCase()
    ) {
      return true;
    }
    return false;
  }

}
