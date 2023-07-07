import axios from 'axios'
import userConfig from '../../userConfig.json'
import { MirrorWorld, ClusterEnvironment } from "@mirrorworld/web3.js"
import { MirrorWorld as MirrorWorld2, ClusterEnvironment as ClusterEnvironment2} from "@mirrorworld2/web3.js"

declare let window: any;

const ifProduct =  process.env.NEXT_PUBLIC_BRANCH_NAME === 'main';
let request:any = null;

const mirrorworld = new MirrorWorld({
  apiKey: userConfig.xApiKey,
  env: !ifProduct ? ClusterEnvironment.testnet : ClusterEnvironment.mainnet, // Can be ClusterEnvionment.mainnet for mainnet
  staging: true
})

const mirrorworld2 = new MirrorWorld2({
  apiKey: userConfig.xApiKey,
  env: !ifProduct ? ClusterEnvironment.testnet : ClusterEnvironment.mainnet, // Can be ClusterEnvionment.mainnet for mainnet
  staging: true
})

const getAUTH = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const auth = urlParams.get("auth");
  auth && window.localStorage.setItem('auth', auth)
  return auth;
  // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjQ5MCwiZXRoX2FkZHJlc3MiOiIweDkyZTVFODVGOTY4ZmNiN2Y5MTYzOEYzZjA4ODJCM0U3MTAyNDBEYjUiLCJzb2xfYWRkcmVzcyI6InJIcEt3RVlOQjh4WW1WdHU1V0tGc2J2aVpTekJIbnVDd0xldm56WnY0ek4iLCJlbWFpbCI6Im1pcnJvcmp1bXAwMDFAb3V0bG9vay5jb20iLCJ3YWxsZXQiOnsiZXRoX2FkZHJlc3MiOiIweDkyZTVFODVGOTY4ZmNiN2Y5MTYzOEYzZjA4ODJCM0U3MTAyNDBEYjUiLCJzb2xfYWRkcmVzcyI6InJIcEt3RVlOQjh4WW1WdHU1V0tGc2J2aVpTekJIbnVDd0xldm56WnY0ek4ifSwiY2xpZW50X2lkIjpudWxsLCJpYXQiOjE2NjU3Mjc1MTIsImV4cCI6MTY2ODMxOTUxMiwianRpIjoiYXV0aDo2NDkwIn0.n1sfGqqCoplKOVt_ezpMICemfSHPKFDWKrAk9fuCExU";
}

const requestInterception = () => {
if(request) return;
request =  axios.create({
  baseURL: ifProduct ? 
  'https://api.mirrorworld.fun/v1/marketplace/'
  : 'https://api-staging.mirrorworld.fun/v1/marketplace/' ,
  headers: {
    // 'X-SSO-Token': Cookies.get('sso-t') || '',
    'Authorization': `Bearer ${getAUTH() || window?.localStorage?.auth}`,
    'x-api-key': userConfig.xApiKey
  },
});
 mirrorworld._api.client.defaults.headers.common.Authorization = `Bearer ${getAUTH()|| window?.localStorage?.auth}`;
 mirrorworld._api.sso.defaults.headers.common.Authorization =  `Bearer ${getAUTH()|| window?.localStorage?.auth}`;

 mirrorworld2._api.client.defaults.headers.common.Authorization = `Bearer ${getAUTH()|| window?.localStorage?.auth}`;
 mirrorworld2._api.sso.defaults.headers.common.Authorization =  `Bearer ${getAUTH()|| window?.localStorage?.auth}`;
}
// Get collection info
export const getCollectionInfo = async ()=>{
  requestInterception();
  const data =  await request.post('collections',  {
      collections: userConfig.collections
  })
  return data;
}

// get filter of collection Info
export const getCollectionFilter = async (collection: string) => {
  requestInterception();
  const data = await request.get(`collection/filter_info?collection=${collection}`);
  return data
}

export const getCollectionNfts = async (param: object) => {
  requestInterception();
  const data = await request.post(`nfts`, {
      ...param
  })
  return data
}

// Get search result
export const getNftSearch = async (search: string) => {
  requestInterception();
  const data = await request.post(`nft/search`, {
      collections: userConfig.collections,
      search: search
  })
  return data
}


// Get search default
export const getNftRecommend = async (search: string) => {
  requestInterception();
  const data = await request.post(`nft/search/recommend`, {
      collections: userConfig.collections,
  })
  return data
}

// export const getNft = async (mintAddress: string)=> {
//   const nft = await mirrorworld.getNftDetails(mintAddress)
//   return nft
// }

export const getNft = async (mintAddress: string)=> {
  requestInterception();
  const data = await request.get(`nft/${mintAddress}`);
  return data
}

// buy nft 
export const buyNFT = async (mint_address:string, price:number) => {
  requestInterception();
  const listing = await mirrorworld2.buyNFT({
    "mintAddress": mint_address,
    "price": price,
  })
  return listing;
}

// get nft activities 
export const getNftActivities = async (search: string,  pageSize: number) => {
  requestInterception();
  const data = await request.post(`nft/events`, {
    "mint_address": search,
    "page":  pageSize,
    "page_size": 10, // max 50
  })
  return data
}

// get user info 
export const getUser = async () => {
  requestInterception();
  const user = await mirrorworld.fetchUser();
  return user;
}

// updateNFTListing
export const updateNFTListing = async (mint_address: string, price: number) => {
  requestInterception();
  const listing = await mirrorworld.updateNFTListing({
    mintAddress: mint_address,
    price: price, // Amount in SOL
    // confirmation: "finalized"
  })
  return listing;
}

// cancelNFTListing
export const cancelNFTListing = async (mint_address: string, price: number) => {
  requestInterception();
  const listing = await mirrorworld.cancelNFTListing({
    mintAddress: mint_address,
    price: price, // Amount in SOL
    // confirmation: "finalized"
  })
  return listing;
}

// transferNFT
export const transferNFT = async ( mintAddress: string, recipientAddress: string) => {
  requestInterception();
  console.log(mintAddress, recipientAddress)
  const transactionResult = await mirrorworld.transferNFT({
    mintAddress: mintAddress,
    recipientAddress:recipientAddress,
  })
  
  return transactionResult;
}

// getprice
export const getPrice = async (price:number) => {
  requestInterception();
  const data = await request.post(`nft/real_price`, {
    "price": price,
    "fee": userConfig?.serviceFee *1000  // 0.001% ～ 100% 对应 1 ～ 100000 
  })
  return data
}