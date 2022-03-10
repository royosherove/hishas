/*nup and github link eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { Provider } from "react-redux";
import store, { useAppSelector } from "../../red/store";
import WalletButton from "../../components/WalletButtonComponent";
import TopMenuComponent from "../../components/TopMenuComponent";
import InvestiatorStatus from "../../components/InvestigatorStatusComponent";
import NftLoader from "../../components/NFTLoaderComponent";
import NFTInspector from "../../components/PropInspectorComponent";
import NFTJson from "../../components/JsonVisualizerComponent";
import NFTImages from "../../components/ImagesComponent";
import NFTLogger from "../../components/LogComponent";
import ContractCodeSyntax from "../../components/hilighters/SolidityCodeComponent";
import { useEffect } from "react";
import { useRouter } from "next/router";
import discoverySlice from "../../red/slices/discoverySlice";
import breadCrumbSlice from "../../red/slices/breadCrumbSlice";
import { requestBeginInvestigation } from "../../investigators/helpers/requestBeginInvestigation";
import { AllCodes } from "../../components/hilighters/AllCodesComponent";
import BreadCrumbs from "../../components/breadCrumbsComponent";

export default function NFTPage() {
  const router = useRouter();
  const {nft,id,crumb} = router.query;
  useEffect(() => {
    if(nft!==undefined){
          store.dispatch( discoverySlice.actions.onTargetAddress(router.query.nft));
    }
    if(id!==undefined){
          store.dispatch( discoverySlice.actions.onNftId(router.query.id));
    }
    if(nft!==undefined&&id!==undefined){
      if(crumb===undefined){
        store.dispatch( breadCrumbSlice.actions.onNewCrumb({address:nft,nftId:id}));
      }
        requestBeginInvestigation(nft.toString(),id.toString());
    }
    
  
    return () => {
    };
  } );
  
  return (
    <Provider store={store}>
      <div className="">
        <Head>
          <title>HiSHAS NFT Tools</title>
          <meta name="description" content="hishas NFT Tools" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="grid 
        md:flex md:flex-col md:items-center 
        ">
          <div className="
          grid 
          md:w-2/3 md:flex md:flex-col md:content-center
          ">
          {/* <WalletButton /> */}

          <TopMenuComponent />
          <BreadCrumbs/>
          {/* <NftLoader /> */}
          <NFTInspector />
          <NFTImages />
          <NFTJson />
          <AllCodes/>
          <InvestiatorStatus />
          </div>
        </main>

        <footer className="grid  m-2 text-center space-x-2 lg:mx-20 lg:mt-20"></footer>
      </div>
    </Provider>
  );
}
