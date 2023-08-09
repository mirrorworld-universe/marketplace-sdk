import axios from 'axios'
import userConfig from '../../userConfig.json'

declare let window: any;

const ifProduct =  true;
let request:any = null;

import { MirrorWorld, Solana } from "@mirrorworld/web3.js"

const mirrorworld = new MirrorWorld({
  apiKey: userConfig.xApiKey,
  chainConfig: ifProduct ? Solana('mainnet-beta'): Solana('devnet'),
  staging: !ifProduct
});

const getAUTH = () => {
  if (typeof window === 'undefined') return ''
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const auth = urlParams.get("auth");
  auth && window.localStorage.setItem('auth', auth)
  return auth;
}


const requestInterception = () => {
if(request) return;
request =  axios.create({
  baseURL: ifProduct ? 
  'https://api.mirrorworld.fun/v1/marketplace/'
  : 'https://api-staging.mirrorworld.fun/v1/marketplace/' ,
  headers: {
    'Authorization': `Bearer ${getAUTH() || window?.localStorage?.auth}`,
    'x-api-key': userConfig.xApiKey
  },
});
 mirrorworld._api.client.defaults.headers.common.Authorization = `Bearer ${getAUTH()|| window?.localStorage?.auth}`;
 mirrorworld._api.sso.defaults.headers.common.Authorization =  `Bearer ${getAUTH()|| window?.localStorage?.auth}`;
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
      ...param,
      auction_house: userConfig.auction_house
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

export const getNft = async (mintAddress: string)=> {
  requestInterception();
  const data = await request.get(`nft/${mintAddress}`);
  return data
}

// buy nft 
export const buyNFT = async (mint_address:string, price:number) => {
  requestInterception();
  const listing = await mirrorworld.Solana.Asset.buyNFT({
    mint_address,
    price,
    auction_house: userConfig.auction_house
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
    auction_house: userConfig.auction_house
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

  const listing = await mirrorworld.Solana.Asset.listNFT({
    mint_address,
    price, // Amount in SOL
    auction_house: userConfig.auction_house
    // confirmation: "finalized"
  })
  return listing;
}

// cancelNFTListing
export const cancelNFTListing = async (mint_address: string, price: number) => {
  requestInterception();
  const listing = await mirrorworld.Solana.Asset.cancelListing({
    mint_address,
    price: price, // Amount in SOL
    auction_house: userConfig.auction_house
    // confirmation: "finalized"
  })
  return listing;
}

// transferNFT
export const transferNFT = async ( mintAddress: string, recipientAddress: string) => {
  requestInterception();
  console.log(mintAddress, recipientAddress)
  const transactionResult = await mirrorworld.Solana.Asset.transferNFT({
    mint_address: mintAddress,
    to_wallet_address: recipientAddress,
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
