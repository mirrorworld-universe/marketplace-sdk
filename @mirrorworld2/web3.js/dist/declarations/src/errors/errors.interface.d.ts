declare const __ErrorCodes__: {
    INVALID_OPTIONS: {
        error: string;
        code: string;
        message: string;
    };
    MIRROR_WORLD_NOT_INITIALIZED: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_REFRESH_TOKEN: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_TRANSFER_SPL_TOKEN_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_TRANSFER_SOL_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_MINT_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_LIST_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_PURCHASE_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_CANCEL_LISTING_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_UPDATE_LISTING_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_TRANSFER_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    ERROR_USER_NOT_AUTHENTICATED: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_API_KEY: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_API_ENVIRONMENT: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_CREATE_ACTION_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_UPDATE_NFT_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_CREATE_MARKETPLACE_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
    INVALID_UPDATE_MARKETPLACE_PAYLOAD: {
        error: string;
        code: string;
        message: string;
    };
};
export declare type MirrorWorldSDKErrorCodes = typeof __ErrorCodes__;
export declare type MirrorWorldSDKErrorKey = keyof MirrorWorldSDKErrorCodes;
export declare type ErrorBody<T extends MirrorWorldSDKErrorKey = MirrorWorldSDKErrorKey> = {
    error: T;
    code: string;
    message: string | ((body?: unknown) => string);
};
export declare type MirrorWorldSDKErrors = Record<MirrorWorldSDKErrorKey, ErrorBody>;
declare const ErrorCodes: MirrorWorldSDKErrors;
export declare class MirrorWorldSDKError extends Error {
    message: string;
    description: string;
    code: string;
    data: null;
    error: string;
    static new(errorCode: MirrorWorldSDKErrorKey, message?: ErrorBody['message']): MirrorWorldSDKError;
    private static withMessage;
    constructor(error: ErrorBody);
}
export declare function throwError(error: MirrorWorldSDKErrorKey, customMessage?: ErrorBody['message']): void;
export declare function toErrorMessage(error: MirrorWorldSDKErrorKey, customMessage?: ErrorBody['message']): string;
export { ErrorCodes };
