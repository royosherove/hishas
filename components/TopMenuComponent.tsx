import React from "react"
const TopMenuComponent = () => (
  <div
    className=" 
    h-12 rounded-b-md py-3 bg-violet-500 text-xl w-screen text-white space-x-16 justify-center flex  
  md:float-left md:text-lg md:w-full md:px-5 md:h-10 md:py-1 md:shadow-md md:rounded-r
  "
  >
    <a href="/" className="">
      Home
    </a>
    <a href="https://twitter.com/RoyOsherove" target="_blank" rel="noreferrer noopener"  className=" ">
      Twitter
    </a>
    <a href="https://github.com/royosherove/hishas" target="_blank" rel="noreferrer noopener"  className=" ">
      GitHub
    </a>
  </div>
);

export default TopMenuComponent;