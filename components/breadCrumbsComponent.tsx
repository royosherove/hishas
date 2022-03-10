/* This example requires Tailwind CSS v2.0+ */
import { HomeIcon } from '@heroicons/react/solid'
import { nanoid } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { IProviderControllerOptions } from 'web3modal';
import breadCrumbSlice, { ICrumb } from '../red/slices/breadCrumbSlice';
import store, { useAppSelector } from '../red/store'


const BreadCrumbs = () => {
    const router = useRouter();
    const firstCrumb = useAppSelector(state => state.crumbs.firstCrumb);
    const onClickInvestigate = (address: string, nftId: string) => {
        store.dispatch( breadCrumbSlice.actions.onCrumbClick({address,nftId}));
        if(address===''){
            router.push({ pathname: '/', query: {  } }, undefined, { shallow: true });
        }
        else{
            router.push({ pathname: '/nft/' + address, query: { id: nftId,crumb:1 } }, undefined, { shallow: true });
        }
        }

        const toMap = [firstCrumb];
        let current: ICrumb = firstCrumb.next;
        while (current !== undefined) {
            toMap.push(current);
            current = current.next;
        }

        const shouldHilight = (crumb:ICrumb) => (crumb.isActive && toMap.length>2);
        const shorten = (crumb:ICrumb) =>{
            if(toMap.length===2){
                return crumb.address.toLowerCase()
            }
            else{
                return "..." + crumb.address.substring(37).toLowerCase();
            }
        }
        return (
            <nav className="flex" aria-label="Breadcrumb">
                <ol role="list" className="bg-white rounded-md shadow px-6 flex space-x-4">
                    {toMap.map((crumb: ICrumb) => {
                        return (
                        <li key={nanoid()} className="flex">
                            <div className="flex items-center">
                            {crumb.isFirst?"":
                                <svg
                                    className="flex-shrink-0 w-6 h-full text-gray-200"
                                    viewBox="0 0 24 44"
                                    preserveAspectRatio="none"
                                    fill={crumb.isActive? " blue ": "currentcolor"}
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                                </svg>
                            }
                                <a
                                    onClick={()=>onClickInvestigate(crumb.address,crumb.nftId)}
                                    href={'#'}
                                    className={"ml-4 text-sm font-medium text-blue-800 hover:text-gray-700 " + (shouldHilight(crumb) ? ' underline ' : "")}
                                >
                                    {
                                        crumb.isFirst? (
                                            <span>
                                                <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                                <span className="sr-only">Home</span>
                                            </span>
                                        ):
                                        shorten(crumb)
                                    
                                    }
                                </a>
                            </div>
                        </li>
                    )
                    }
                    )}
                </ol>
            </nav>
        );
    };
export default BreadCrumbs
