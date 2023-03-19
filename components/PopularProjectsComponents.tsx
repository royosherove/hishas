import { nanoid } from "nanoid"
import Image from "next/image"
export const PopularProjects = ()=>{
    const projects = [
        {name:"Music: Daniel Allan - Cage (with DLG)",image:"daniel_1.png",address:"0x7c6b8d2f756c69fd84a3fbb67435a0943c9011f1",id:1},
        {name:"Music: Nightshade",image:"nightshade.png",address:"0xb80f44B2611e0E37bD5BDA2B9b48E158ee4acD60",id:10},
        {name:"Azuki",image:"azuki.png",address:"0xed5af388653567af2f388e6224dc7c4b3241c544",id:100},
        {name:"Bored Apes",image:"bayc.png",address:"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",id:100},
        {name:"CryptoBatz",image:"cryptobat.png",address:"0xc8adfb4d437357d0a656d4e62fd9a6d22e401aa0",id:100},
        {name:"HAPE Prime",image:"hape.png",address:"0x4db1f25d3d98600140dfc18deb7515be5bd293af",id:100},
        {name:"Creepz Genesis",image:"creepz.png",address:"0xfe8c6d19365453d26af321d0e8c910428c23873f",id:9437},
        {name:"MetroVerse",image:"metroverse.jpg",address:"0x0e9d6552b85be180d941f1ca73ae3e318d2d4f1f",id:2493},
        {name:"Lil' Heroes",image:"lilheroes.jpg",address:"0xd78b76fcc33cd416da9d3d42f72649a23d7ac647",id:2239},
        {name:"The Sandbox",image:"sandbox.jpg",address:"0x50f5474724e0ee42d9a4e711ccfb275809fd6d4a",id:15240},
        {name:"World of Women",image:"wow.png",address:"0xe785e82358879f061bc3dcac6f0444462d4b5330",id:8408},
        {name:"Damien Hirst",image:"hirst.jpg",address:"0xaadc2d4261199ce24a4b0a57370c4fcf43bb60aa",id:"5182"},
        {name:"Beeple - First 5000 Days",image:"beeple.jpeg",address:"0x2a46f2ffd99e19a89476e2f62270e0a35bbf0756",id:40913},
        {name:"v1 Wrapped CryptoPunks",image:"wpunk.png",address:"0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d",id:9805},
        {name:"Official Wrapped CryptoPunks",image:"owpunk.png",address:"0xb7f7f6c52f2e2fdb1963eab30438024864c313f6",id:5169},
        {name:"Rarible Single ('music')",image:"music.jpg",address:"0x60f80121c31a0d46b5279700f9df786054aa5ee5",id:18458},
        {name:"Goldfinch Identity NFT",image:"uid.jpg",address:"0xba0439088dc1e75f58e0a7c107627942c15cbb41",id:0},
        {name:"Sorare",image:"sorare.png",address:"0x629a673a8242c2ac4b7b8c5d8735fbeac21a6205",id:"32906177913323948360417176750656470871311526123889047127515776576245843938893"},
    ]
    return (
        <div>
            <div key={nanoid()} className="text-2xl p-2 font-semibold md:text-xl">Click on one of these to try it out:</div>
            <div className="grid md:flex flex-wrap  text-center p-2 ">
                {projects.map(p=>{
                    return <div key={nanoid()} className=" 
                    rounded-md text-center font-mono text-3xl 
                    md:m-1 md:w-24 md:text-base 
                    ">
                        <a href={`/nft/${p.address}?id=${p.id}`} className="flex flex-col group ">
                            <Image src={`/img/${p.image}`} layout='responsive' width={96} height={96} className="rounded-3xl"/>
                            <div className="md:text-black group-hover:text-red-600">{p.name}</div>
                        </a>
                    </div>
                })}
            </div>
        </div>
    )
}