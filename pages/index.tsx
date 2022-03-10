/*nup and github link eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../red/store";
import TopMenuComponent from "../components/TopMenuComponent";
import NftLoader from "../components/NFTLoaderComponent";
import { PopularProjects } from "../components/PopularProjectsComponents";
import BreadCrumbs from "../components/breadCrumbsComponent";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="flex md:justify-center">
        <Head>
          <title>HiSHAS NFT Tools</title>
          <meta name="description" content="hishas NFT Tools" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="w-screen 
                        md:flex md:flex-col md:justify-center md:space-y-2 md:w-1/2
        ">
            <TopMenuComponent />
            <NftLoader />
            <PopularProjects/>
        </main>

        <footer className="grid  m-2 text-center space-x-2 lg:mx-20 lg:mt-20"></footer>
      </div>
    </Provider>
  );
}
