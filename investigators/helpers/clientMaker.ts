import { Contract, ethers, logger, Signer } from "ethers";
import { INFURA_ID  } from "../../EnvConsts";

export interface IClientMaker{
  makeClientContract(address:string, abi:string[] | string):Contract;
}
export class ClientMaker implements IClientMaker {

  makeClientContract(address:string, abi:string[]=[]):Contract{
    const provider = new ethers.providers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/" + INFURA_ID
    );
    const contract = new ethers.Contract(
      address,
      abi,
      provider,
    );
    return contract;
  }

}
