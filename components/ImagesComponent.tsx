import { nanoid } from "nanoid";
import { useAppSelector } from "../red/store";

export const NFTImages = ()=>{
    const images = useAppSelector(state=>state.discovery.images);
    const makeSvgIfNeeded = (imgUri:string)=>{
      return imgUri;
    }
    return (
      <div className="
      px-2 space-y-2 w-screen
      md:max-w-lg md:w-1/4 
      ">
        {images.map((i) => (
          <div key={nanoid()}>
            <img alt={'image'} src={makeSvgIfNeeded( i.usableUri)} className="w-64 rounded-md h-auto md:w-96" />
              <a href={makeSvgIfNeeded(i.usableUri)}
                className="text-blue-700 underline block w-2/3 truncate overflow-y-scroll text-xs font-mono
                md:w-24 md:text-xs md:truncate

                "
                target="_blank" >
                {i.uri}
              </a>
          </div>
        ))}
      </div>
    );

}

export default NFTImages;