import { MirrorWorldEventKey, MirrorWorldEvents, MirrorWorldOptions } from './types/instance';
import { MirrorWorldAPIClient } from './services/api';
import { ClusterEnvironment } from './services/cluster';
import { LoginEmailCredentials } from './types/auth';
import { IUser, UserWithWallet, Wallet } from './types/user.type';
import { BuyNFTPayload, CancelListingPayload, CreateVerifiedCollectionPayload, ISolanaNFT, ISolanaNFTMintResult, IVerifiedCollection, ListNFTPayload, MintNFTPayload, QueryNFTsByCreatorsPayload, QueryNFTsByMintAddressesPayload, QueryNFTsByOwnersPayload, QueryNFTsByUpdateAuthoritiesPayload, SolanaCommitment, SolanaNFTAuctionActivitiesPayload, SolanaNFTExtended, TransferNFTPayload, UpdateListingPayload, UpdateNFTPayload } from './types/nft';
import { ISolanaToken, TransferSOLPayload, TransferSPLTokenPayload } from './types/token';
import { ISolanaTransaction, ITransferSPLTokenResponse } from './types/transaction';
import { CreateMarketplacePayload, IMarketplaceQueryResult, INFTListing, Marketplace, MarketplaceQueryOptions, UpdateMarketplacePayload } from './types/marketplace';
export declare class MirrorWorld {
    _apiKey: MirrorWorldOptions['apiKey'];
    _env: MirrorWorldOptions['env'];
    _staging: MirrorWorldOptions['staging'];
    _api: MirrorWorldAPIClient;
    _tokens: ISolanaToken[];
    _transactions: ISolanaTransaction[];
    _nfts: SolanaNFTExtended[];
    _user?: UserWithWallet;
    userRefreshToken?: string;
    constructor(options: MirrorWorldOptions);
    private get api();
    private get sso();
    /** Get application's apiKey instance */
    private get apiKey();
    /** Get instance's environment */
    get clusterEnv(): ClusterEnvironment;
    /** Get instance's environment */
    get network(): 'mainnet' | 'devnet';
    /** Get current user */
    get user(): UserWithWallet;
    private set user(value);
    /** Get current user's wallet */
    get wallet(): Wallet;
    /** Get current user tokens */
    get tokens(): ISolanaToken[];
    /** Set current user tokens */
    private set tokens(value);
    /** Get current user transactions */
    get transactions(): ISolanaTransaction[];
    /** Set current user transactions */
    private set transactions(value);
    get nfts(): SolanaNFTExtended[];
    set nfts(value: SolanaNFTExtended[]);
    /** Get current user */
    get isLoggedIn(): boolean;
    private static emit;
    on<T extends MirrorWorldEventKey>(event: T, handler: (payload: MirrorWorldEvents[T]) => void): void;
    emit<T extends MirrorWorldEventKey>(event: T, payload: MirrorWorldEvents[T]): void;
    private defineInternalListeners;
    private useCredentials;
    loginWithEmail(credentials: LoginEmailCredentials): Promise<MirrorWorld>;
    logout(): Promise<void>;
    private refreshAccessToken;
    fetchUser(): Promise<IUser>;
    private get authView();
    /**
     * Opens wallet window
     * @param path
     * @private
     */
    private openWallet;
    /***
     * Logs in a user. Opens a popup window for the login operation
     */
    login(): Promise<{
        user: IUser;
        refreshToken: string;
    }>;
    private getApprovalToken;
    /**
     * Fetches an NFT's mint address on Solana
     * @param mintAddress
     */
    getNftDetails(mintAddress: string): Promise<ISolanaNFT>;
    /**
     * Fetches the current user's tokens
     */
    getTokens(): Promise<ISolanaToken[]>;
    /**
     * Fetches the wallet transactions for a user
     */
    getTransactions(): Promise<ISolanaTransaction[]>;
    /**
     * Fetches the current user's NFTs.
     */
    getNFTs(payload: {
        limit: number;
        offset: number;
    }): Promise<SolanaNFTExtended[]>;
    /**
     * Fetches the NFTs owned by a specific address.
     */
    getNFTsOwnedByAddress(address: string, payload: {
        limit: number;
        offset: number;
    }): Promise<SolanaNFTExtended[]>;
    /**
     * Transfer SPL token to a recipient
     */
    transferSPLToken(payload: {
        recipientAddress: TransferSPLTokenPayload['to_publickey'];
        amount: TransferSPLTokenPayload['amount'];
        tokenMint: TransferSPLTokenPayload['token_mint'];
        tokenDecimals: TransferSPLTokenPayload['decimals'];
    }): Promise<ITransferSPLTokenResponse>;
    /**
     * Transfer SOL to wallet address
     */
    transferSOL(payload: {
        recipientAddress: TransferSOLPayload['to_publickey'];
        amount: TransferSOLPayload['amount'];
    }): Promise<ITransferSPLTokenResponse>;
    /**
     * @service Marketplace
     * Create Verified Collection
     */
    createVerifiedCollection(payload: CreateVerifiedCollectionPayload, commitment?: SolanaCommitment): Promise<IVerifiedCollection>;
    /**
     * @service Marketplace
     * Mint NFT into collection
     */
    mintNFT(payload: MintNFTPayload): Promise<ISolanaNFTMintResult>;
    /**
     * @service Marketplace
     * Update NFT metadata
     */
    updateNFT(payload: UpdateNFTPayload, commitment?: SolanaCommitment): Promise<ISolanaNFTMintResult>;
    /**
     * @service Marketplace
     * List NFT ion Mirror World Marketplace
     */
    listNFT(payload: ListNFTPayload): Promise<INFTListing>;
    /**
     * @service Marketplace
     * Purchase NFT on Mirror World Marketplace
     */
    buyNFT(payload: BuyNFTPayload): Promise<INFTListing>;
    /**
     * @service Marketplace
     * Update NFT Listing on Mirror World Marketplace
     */
    updateNFTListing(payload: UpdateListingPayload): Promise<INFTListing>;
    /**
     * @service Marketplace
     * Cancel listing NFT on Mirror World Marketplace
     */
    cancelNFTListing(payload: CancelListingPayload): Promise<INFTListing>;
    /**
     * @service Marketplace
     * Transfer NFT from holder's wallet to another address
     */
    transferNFT(payload: TransferNFTPayload): Promise<INFTListing>;
    /**
     * @service Marketplace
     * Fetch NFTs By Mint Addresses. Returns a detailed payload of all NFTs whose `mintAddresses`
     * are provided
     */
    fetchNFTsByMintAddresses(payload: QueryNFTsByMintAddressesPayload): Promise<SolanaNFTExtended[]>;
    /**
     * @service Marketplace
     * Fetch NFTs By Creator Addresses. Returns a detailed payload of all NFTs whose `creatorAddresses`
     * are provided
     */
    fetchNFTsByCreatorAddresses(payload: QueryNFTsByCreatorsPayload): Promise<SolanaNFTExtended[]>;
    /**
     * @service Marketplace
     * Fetch NFTs By Update Authorities Addresses. Returns a detailed payload of all NFTs whose `updateAuthorities`
     * are provided
     */
    fetchNFTsByUpdateAuthorities(payload: QueryNFTsByUpdateAuthoritiesPayload): Promise<SolanaNFTExtended[]>;
    /**
     * @service Marketplace
     * Fetch NFTs By Owners Addresses. Returns a detailed payload of all NFTs whose `owners`
     * are provided
     */
    fetchNFTsByOwnerAddresses(payload: QueryNFTsByOwnersPayload): Promise<SolanaNFTExtended[]>;
    /**
     * @service Marketplace
     * Fetch Solana NFT Marketplace Activity
     */
    fetchNFTMarketplaceActivity(mintAddress: string): Promise<SolanaNFTAuctionActivitiesPayload>;
    /**
     * Creates a new marketplace instance.
     * @param payload
     */
    createMarketplace(payload: CreateMarketplacePayload): Promise<Marketplace>;
    /**
     * Updates a marketplace instance.
     * @param payload
     */
    updateMarketplace(payload: UpdateMarketplacePayload): Promise<Marketplace>;
    /**
     * Queries marketplaces by the following properties
     * | 'name'
     * | 'client_id'
     * | 'authority'
     * | 'treasury_mint'
     * | 'auction_house_fee_account'
     * | 'auction_house_treasury'
     * | 'treasury_withdrawal_destination'
     * | 'fee_withdrawal_destination'
     * | 'seller_fee_basis_points'
     * | 'requires_sign_off'
     * | 'can_change_sale_price'
     * @param query
     * @param pagination
     */
    queryMarketplaces(query: MarketplaceQueryOptions, pagination?: {
        page?: number;
        count?: number;
    }): Promise<IMarketplaceQueryResult[]>;
}
