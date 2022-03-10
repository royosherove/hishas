import React, { useState } from "react"
import Web3Modal from "web3modal";
const WalletButton = (props:any) => 
    {
        const [address, setAddress] = useState(undefined)
        const connect = async () => {
          const providerOptions = {
            /* See Provider Options Section */
          };

          const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions, // required
          });

          const provider = await web3Modal.connect();
          console.dir(provider.selectedAddress)
          setAddress(provider.selectedAddress);
        };
        
        let theAddress:string = address;
        if(theAddress!=undefined){
            return (<div className="font-mono float-right overflow-ellipsis  h-10 pt-2 md:pt-1 text-center rounded-l border-black border bg-violet-500 text-white px-1 py-1 text-sm md:text-lg">
                {theAddress.substring(0,4) + '...' + theAddress.substring(37)}
            </div>)
        }
        return (
          <button onClick={async ()=> await connect()} className="hidden sm:block float-right h-10 pt-2 md:pt-1 items-center place-content-center text-center rounded-l align-right  border-black border bg-violet-500 w-40 text-white px-1 py-1 text-sm md:text-lg">
            Connect Wallet
          </button>
        );
    }

export default WalletButton;
