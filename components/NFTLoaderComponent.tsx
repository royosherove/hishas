import { useRouter } from "next/router";
import breadCrumbSlice from "../red/slices/breadCrumbSlice";
import discoverySlice from "../red/slices/discoverySlice";
import store, { useAppSelector } from "../red/store";

const NftLoader = (props: any) => {
  const targetAddress = useAppSelector((state) => state.discovery.targetAddress);
  const nftId = useAppSelector((state) => state.discovery.nftId);
  const discoveryStatus = useAppSelector((state) => state.discovery.status);
  const router = useRouter();

  const onClickInvestigate = ()=>{
      store.dispatch( breadCrumbSlice.actions.onClearCrumbs({address:targetAddress,nftId}));
      // store.dispatch( breadCrumbSlice.actions.onNewCrumb({address:targetAddress,nftId}));
    router.push({
      pathname: '/nft/' + targetAddress,
      query: { id: nftId }
    },
    undefined, { shallow: true }
) 
  }
  const renderButton = () => {
    return (
      <button
        className="
        bg-gray-300 border border-black shadow rounded-md px-1 2 h-12 w-1/2 justify-self-end
        md:h-10 md:w-24 
        "
        onClick={onClickInvestigate}
        // onClick={() => requestBeginInvestigation(targetAddress, nftId)}
      >
        Dig
      </button>
    );
  };
  return (
    <div className="
    bg-purple-300 w-screen rounded-b-md p-5 space-x-2 font-semibold flex space-y-2 
    md:grid  md:w-full md:rounded-md
    ">
      <div className="grid space-x-2 text-xl space-y-4 w-screen
      md:text-base md:items-center md:w-full md:space-y-1">
        <label htmlFor="address">NFT Address:</label>
        <input
          id="address"
          type="text"
          className="
          min-w-96  font-mono p-2 bg-white rounded border border-black h-18 w-6/8 overflow-ellipsis
          md:h-8 md:text-s md:w-full
           "
          value={targetAddress}
          onChange={(e) =>
            store.dispatch(
              discoverySlice.actions.onTargetAddress(e.target.value.trim())
            )
          }
        />
        <label htmlFor="nftId">NFT ID:</label>
        <input
          id="nftId"
          type="text"
          className="
          font-mono p-1 bg-white rounded border border-black overflow-ellipsis
          md:w-24  
          "
          value={nftId}
          onChange={(e) =>
            store.dispatch(
              discoverySlice.actions.onNftId(e.target.value.trim())
            )
          }
        />
        {renderButton()}
      </div>
    </div>
  );
};

export default NftLoader;
