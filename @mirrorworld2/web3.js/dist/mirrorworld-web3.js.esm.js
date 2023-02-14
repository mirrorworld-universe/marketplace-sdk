import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import qs from 'query-string';
import axios from 'axios';
import mitt from 'mitt';
import joi from 'joi';
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import _createSuper from '@babel/runtime/helpers/esm/createSuper';
import _wrapNativeSuper from '@babel/runtime/helpers/esm/wrapNativeSuper';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';

var ClusterEnvironment;

(function (ClusterEnvironment) {
  ClusterEnvironment["mainnet"] = "mainnet";
  ClusterEnvironment["testnet"] = "testnet";
  ClusterEnvironment["local"] = "local";
})(ClusterEnvironment || (ClusterEnvironment = {}));

// Will set cookies when cookies are responded with by browser.
axios.defaults.withCredentials = true;
function throwError$1(response) {
  var error = new Error("E:".concat(response.code, ": ").concat(response.error, ": ").concat(response.message));

  for (var prop in response) {
    error[prop] = response[prop];
  }

  console.error(error, response);
  throw error;
}
function handleAPIError(response) {
  if ('code' in response) {
    throwError$1(response);
  }
}

var isValidAPIKey = function isValidAPIKey(key) {
  return key.startsWith('mw_');
};

var mapServiceKeyToEnvironment = function mapServiceKeyToEnvironment(apiKey, environment) {
  var sso = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var staging = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (isValidAPIKey(apiKey)) {
    if (environment === ClusterEnvironment.testnet) return {
      environment: 'devnet',
      baseURL: sso ? "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun") : "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun/v1/devnet")
    }; else if (environment === ClusterEnvironment.mainnet) return {
      environment: 'mainnet',
      baseURL: sso ? "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun") : "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun/v1/mainnet")
    }; else if (environment === ClusterEnvironment.local) return {
      environment: 'devnet',
      baseURL: sso ? 'http://localhost:4000' : 'http://localhost:4000/v1/devnet'
    }; else return {
      environment: 'mainnet',
      baseURL: sso ? "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun") : "https://api".concat(staging ? '-staging' : '', ".mirrorworld.fun/v1/mainnet")
    };
  }
};
var mapServiceKeyToAuthView = function mapServiceKeyToAuthView(apiKey, environment) {
  var staging = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (staging) {
    return {
      baseURL: 'https://auth-staging.mirrorworld.fun'
    };
  } else {
    return {
      baseURL: 'https://auth.mirrorworld.fun'
    };
  }
};
var MirrorWorldAPIClient = /*#__PURE__*/function () {
  function MirrorWorldAPIClient(_ref) {
    var _ref$env = _ref.env,
      env = _ref$env === void 0 ? ClusterEnvironment.mainnet : _ref$env,
      apiKey = _ref.apiKey,
      _ref$staging = _ref.staging,
      staging = _ref$staging === void 0 ? false : _ref$staging;

    _classCallCheck(this, MirrorWorldAPIClient);

    var serviceParams = mapServiceKeyToEnvironment(apiKey, env, false, staging);
    this.client = axios.create({
      withCredentials: true,
      baseURL: serviceParams.baseURL
    });
    var params = mapServiceKeyToEnvironment(apiKey, env, true, staging);
    this.sso = axios.create({
      withCredentials: true,
      baseURL: params.baseURL
    });
    MirrorWorldAPIClient.defineRequestHandlers(this.client, apiKey);
    MirrorWorldAPIClient.defineRequestHandlers(this.sso, apiKey);
    MirrorWorldAPIClient.defineErrorResponseHandlers(this.client);
    MirrorWorldAPIClient.defineErrorResponseHandlers(this.sso);
  }

  _createClass(MirrorWorldAPIClient, null, [{
    key: "defineErrorResponseHandlers",
    value: function defineErrorResponseHandlers(client) {
      client.interceptors.response.use(function (response) {
        if (response.data.error && response.data.code && response.data.message) {
          handleAPIError(response.data);
        }

        return response;
      });
    }
  }, {
    key: "defineRequestHandlers",
    value: function defineRequestHandlers(client, apiKey, authToken) {
      client.interceptors.request.use(function (config) {
        var _config = _objectSpread(_objectSpread({}, config), {}, {
          headers: _objectSpread(_objectSpread({}, config.headers), {}, _defineProperty({}, 'x-api-key', apiKey), authToken && {
            Authorization: "Bearer ".concat(authToken)
          }),
          withCredentials: true
        });

        return _config;
      });
    }
  }]);

  return MirrorWorldAPIClient;
}();
function createAPIClient(_ref2) {
  var apiKey = _ref2.apiKey,
    staging = _ref2.staging;
  var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ClusterEnvironment.mainnet;
  return new MirrorWorldAPIClient({
    env: environment,
    apiKey: apiKey,
    staging: staging
  });
}

var emitter = mitt();

var __ErrorCodes__ = {
  INVALID_OPTIONS: {
    error: 'INVALID_OPTIONS',
    code: '000100',
    message: "Mirror World SDK initialized with invalid options"
  },
  MIRROR_WORLD_NOT_INITIALIZED: {
    error: 'MIRROR_WORLD_NOT_INITIALIZED',
    code: '000101',
    message: "Mirror World SDK not initialized properly"
  },
  INVALID_REFRESH_TOKEN: {
    error: 'INVALID_REFRESH_TOKEN',
    code: '000102',
    message: "No refresh token found. Please login to continue"
  },
  INVALID_TRANSFER_SPL_TOKEN_PAYLOAD: {
    error: 'INVALID_TRANSFER_SPL_TOKEN_PAYLOAD',
    code: '000103',
    message: "Validation failed for transfer token payload"
  },
  INVALID_TRANSFER_SOL_PAYLOAD: {
    error: 'INVALID_TRANSFER_SOL_PAYLOAD',
    code: '000104',
    message: "Validation failed for transfer SOL payload"
  },
  INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD: {
    error: 'INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD',
    code: '000105',
    message: "Validation failed for create verified collection"
  },
  INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD: {
    error: 'INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD',
    code: '000106',
    message: "Validation failed for create verified sub-collection"
  },
  INVALID_MINT_NFT_PAYLOAD: {
    error: 'INVALID_MINT_NFT_PAYLOAD',
    code: '000107',
    message: "Validation failed for mint collection NFT"
  },
  INVALID_LIST_NFT_PAYLOAD: {
    error: 'INVALID_LIST_NFT_PAYLOAD',
    code: '000108',
    message: "Validation failed for create nft listing"
  },
  INVALID_PURCHASE_NFT_PAYLOAD: {
    error: 'INVALID_PURCHASE_NFT_PAYLOAD',
    code: '000109',
    message: "Validation failed for purchase nft"
  },
  INVALID_CANCEL_LISTING_NFT_PAYLOAD: {
    error: 'INVALID_CANCEL_LISTING_NFT_PAYLOAD',
    code: '000110',
    message: "Validation failed for cancel nft listing"
  },
  INVALID_UPDATE_LISTING_NFT_PAYLOAD: {
    error: 'INVALID_UPDATE_LISTING_NFT_PAYLOAD',
    code: '000111',
    message: "Validation failed for update nft listing"
  },
  INVALID_TRANSFER_NFT_PAYLOAD: {
    error: 'INVALID_TRANSFER_NFT_PAYLOAD',
    code: '000112',
    message: "Validation failed for transfer NFT"
  },
  INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD',
    code: '000113',
    message: "Validation failed for fetch NFTs by mint addresses"
  },
  INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD',
    code: '000114',
    message: "Validation failed for fetch NFTs by creator addresses"
  },
  INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD',
    code: '000115',
    message: "Validation failed for fetch NFTs by update authorities addresses"
  },
  INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD: {
    error: 'INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD',
    code: '000116',
    message: "Validation failed for fetch NFTs by update authorities addresses"
  },
  ERROR_USER_NOT_AUTHENTICATED: {
    error: 'ERROR_USER_NOT_AUTHENTICATED',
    code: '000117',
    message: "User is not authenticated. Please login"
  },
  INVALID_API_KEY: {
    error: 'INVALID_API_KEY',
    code: '000118',
    message: "You are currently using an deprecated API Key. Please create a new API Key for your project on the Mirror World Dashboard (https://app.mirrorworld.fun)"
  },
  INVALID_API_ENVIRONMENT: {
    error: 'INVALID_API_ENVIRONMENT',
    code: '000119',
    message: "The API Key you provided cannot be used in the staging environment. Only `ClusterEnvironment.testnet` is available on staging."
  },
  INVALID_CREATE_ACTION_PAYLOAD: {
    error: 'INVALID_CREATE_ACTION_PAYLOAD',
    code: '000120',
    message: "Validation failed for requesting approval for action"
  },
  INVALID_UPDATE_NFT_PAYLOAD: {
    error: 'INVALID_UPDATE_NFT_PAYLOAD',
    code: '000121',
    message: "Validation failed for update NFT mint"
  },
  INVALID_CREATE_MARKETPLACE_PAYLOAD: {
    error: 'INVALID_CREATE_MARKETPLACE_PAYLOAD',
    code: '000122',
    message: "Validation failed for create marketplace"
  },
  INVALID_UPDATE_MARKETPLACE_PAYLOAD: {
    error: 'INVALID_UPDATE_MARKETPLACE_PAYLOAD',
    code: '000123',
    message: "Validation failed for update marketplace"
  }
};
var ErrorCodes = __ErrorCodes__;
var MirrorWorldSDKError = /*#__PURE__*/function (_Error) {
  _inherits(MirrorWorldSDKError, _Error);

  var _super = _createSuper(MirrorWorldSDKError);

  // @ts-expect-error Here we invoke the initializer at
  // `super` after determining the error message
  function MirrorWorldSDKError(error) {
    var _this;

    _classCallCheck(this, MirrorWorldSDKError);

    var message;

    if (typeof error.message === 'function') {
      message = error.message();
    } else {
      message = error.message;
    }

    _this = _super.call(this, message);

    _defineProperty(_assertThisInitialized(_this), "data", null);

    _this.message = message;
    _this.description = message;
    _this.code = error.code;
    _this.error = error.error;
    _this.data = null;
    return _this;
  }

  _createClass(MirrorWorldSDKError, null, [{
    key: "new",
    value: function _new(errorCode, message) {
      var error = ErrorCodes[errorCode];
      var payload = new MirrorWorldSDKError(error);
      if (message) return MirrorWorldSDKError.withMessage(payload, message); else return payload;
    }
  }, {
    key: "withMessage",
    value: function withMessage(error, _message) {
      var message;

      if (typeof _message === 'function') {
        message = _message();
      } else {
        message = _message;
      }

      error.message = message;
      return error;
    }
  }]);

  return MirrorWorldSDKError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/* Throws parsed error based on MirrorWorld API Error Standard */

function throwError(error, customMessage) {
  throw MirrorWorldSDKError["new"](error, customMessage);
}
function toErrorMessage(error, customMessage) {
  var e = MirrorWorldSDKError["new"](error, customMessage);
  return "E:".concat(e.code, ": ").concat(e.error, ": ").concat(e.message);
}

var clientOptionsSchema = joi.object({
  env: joi.string().optional().valid(ClusterEnvironment.mainnet, ClusterEnvironment.testnet, ClusterEnvironment.local),
  apiKey: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_OPTIONS', toErrorMessage('INVALID_OPTIONS', '`apiKey` is required'))),
  autoLoginCredentials: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_OPTIONS', toErrorMessage('INVALID_OPTIONS', '`autoLoginCredentials` should be a string.'))),
  staging: joi["boolean"]().optional().error(MirrorWorldSDKError["new"]('INVALID_OPTIONS', toErrorMessage('INVALID_OPTIONS', '`staging` should be a boolean.')))
});

var canUseDom = Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);

var SolanaCommitment;

(function (SolanaCommitment) {
  SolanaCommitment["confirmed"] = "confirmed";
  SolanaCommitment["finalized"] = "finalized";
})(SolanaCommitment || (SolanaCommitment = {}));

var transferSOLSchema = joi.object({
  to_publickey: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`to_publickey` should be a valid public key'))),
  amount: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`amount` should be a valid number')))
});
var transferSPLTokenSchema = joi.object({
  to_publickey: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`to_publickey` should be a valid public key'))),
  decimals: joi.number().required().integer().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`decimals` should be a valid integer'))),
  amount: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`amount` should be a valid number'))),
  token_mint: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', toErrorMessage('INVALID_TRANSFER_SPL_TOKEN_PAYLOAD', '`token_mint` should be a valid address')))
});

var createVerifiedCollectionSchema = joi.object({
  name: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', '`name` should be a valid string'))),
  symbol: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', '`symbol` should be a valid string of less than 10 characters'))),
  confirmation: joi.string().valid('confirmed', 'finalized').optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', '`commitment` should be one of "confirmed" or "finalized"'))),
  url: joi.string().uri().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', '`metadata uri` should be a valid url')))
});
joi.object({
  collection_mint: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', '`parentCollection` should be a valid mint address'))),
  name: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', '`name` should be a valid string'))),
  symbol: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', '`symbol` should be a valid string of less than 10 characters'))),
  url: joi.string().uri().required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_SUB_COLLECTION_PAYLOAD', '`metadataUri` should be a valid url'))),
  confirmation: joi.string().valid('confirmed', 'finalized').optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', toErrorMessage('INVALID_CREATE_VERIFIED_COLLECTION_PAYLOAD', '`commitment` should be one of "confirmed" or "finalized"')))
});
var mintNFTSchema = joi.object({
  collection_mint: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_MINT_NFT_PAYLOAD', toErrorMessage('INVALID_MINT_NFT_PAYLOAD', '`collection` should be a valid collection address'))),
  name: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_MINT_NFT_PAYLOAD', toErrorMessage('INVALID_MINT_NFT_PAYLOAD', '`name` should be a valid string'))),
  symbol: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_MINT_NFT_PAYLOAD', toErrorMessage('INVALID_MINT_NFT_PAYLOAD', '`symbol` should be a valid string of less than 10 characters'))),
  url: joi.string().uri().required().error(MirrorWorldSDKError["new"]('INVALID_MINT_NFT_PAYLOAD', toErrorMessage('INVALID_MINT_NFT_PAYLOAD', '`metadataUri` should be a valid url')))
});
var updateNFTSchema = joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`mint_address` should be a valid mint address'))),
  name: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`name` should be a valid string'))),
  symbol: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`symbol` should be a valid string of less than 10 characters'))),
  update_authority: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`update_authority` should be a valid publick key string'))),
  seller_fee_basis_points: joi.number().min(0).max(10000).optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`seller_fee_basis_points` should be a valid number between 0 and 10000'))),
  url: joi.string().uri().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`metadataUri` should be a valid url'))),
  confirmation: joi.string().valid('confirmed', 'finalized').optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_NFT_PAYLOAD', '`commitment` should be one of "confirmed" or "finalized"')))
});
var transferNFTSchema = joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_NFT_PAYLOAD', toErrorMessage('INVALID_TRANSFER_NFT_PAYLOAD', '`mintAddress` should be a valid mint address'))),
  to_wallet_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_TRANSFER_NFT_PAYLOAD', toErrorMessage('INVALID_TRANSFER_NFT_PAYLOAD', '`recipientAddress` should be a valid wallet address')))
});
var fetchNFTsByMintAddressesSchema = joi.object({
  mint_addresses: joi.array().items(joi.string()).required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', '`mintAddresses` should be a valid array of mint addresses'))),
  limit: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', '`limit` should be a integer'))),
  offset: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_MINT_ADDRESSES_PAYLOAD', '`offset` should be a integer')))
});
var fetchNFTsByCreatorAddressesSchema = joi.object({
  creators: joi.array().items(joi.string()).required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', '`creators` should be a valid array of creator addresses'))),
  limit: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', '`limit` should be a integer'))),
  offset: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_CREATOR_ADDRESSES_PAYLOAD', '`offset` should be a integer')))
});
var fetchNFTsByUpdateAuthoritiesSchema = joi.object({
  update_authorities: joi.array().items(joi.string()).required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', '`udpateAuthorities` should be a valid array of update authority addresses'))),
  limit: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', '`limit` should be a integer'))),
  offset: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', '`offset` should be a integer')))
});
var fetchNFTsByOwnerAddressesSchema = joi.object({
  owners: joi.array().items(joi.string()).required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_OWNERS_PAYLOAD', '`owners` should be a valid array of owner addresses'))),
  limit: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', '`limit` should be a integer'))),
  offset: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', toErrorMessage('INVALID_FETCH_NFT_BY_UPDATE_AUTHORITIES_PAYLOAD', '`offset` should be a integer')))
});

var listNFTSchema = joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_LIST_NFT_PAYLOAD', toErrorMessage('INVALID_LIST_NFT_PAYLOAD', '`mintAddress` should be a valid mint address'))),
  price: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_LIST_NFT_PAYLOAD', toErrorMessage('INVALID_LIST_NFT_PAYLOAD', '`price` should be a valid number'))),
  auction_house: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_LIST_NFT_PAYLOAD', toErrorMessage('INVALID_LIST_NFT_PAYLOAD', '`auction_house` should be a valid auction_house address')))
});
var buyNFTSchema = joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_PURCHASE_NFT_PAYLOAD', toErrorMessage('INVALID_PURCHASE_NFT_PAYLOAD', '`mintAddress` should be a valid mint address'))),
  price: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_PURCHASE_NFT_PAYLOAD', toErrorMessage('INVALID_PURCHASE_NFT_PAYLOAD', '`price` should be a valid number'))),
  auction_house: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_PURCHASE_NFT_PAYLOAD', toErrorMessage('INVALID_PURCHASE_NFT_PAYLOAD', '`auction_house` should be a valid auction_house address')))
});
joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_LISTING_NFT_PAYLOAD', '`mintAddress` should be a valid mint address'))),
  price: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_LISTING_NFT_PAYLOAD', '`price` should be a valid number'))),
  auction_house: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_UPDATE_LISTING_NFT_PAYLOAD', '`auction_house` should be a valid auction_house address')))
});
var cancelNFTListingSchema = joi.object({
  mint_address: joi.string().required().error(MirrorWorldSDKError["new"]('INVALID_CANCEL_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_CANCEL_LISTING_NFT_PAYLOAD', '`mintAddress` should be a valid mint address'))),
  price: joi.number().required().error(MirrorWorldSDKError["new"]('INVALID_CANCEL_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_CANCEL_LISTING_NFT_PAYLOAD', '`price` should be a valid number'))),
  auction_house: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_CANCEL_LISTING_NFT_PAYLOAD', toErrorMessage('INVALID_CANCEL_LISTING_NFT_PAYLOAD', '`auction_house` should be a valid auction_house address')))
});
var strorefrontConfigValidator = function strorefrontConfigValidator(error) {
  return joi.object({
    name: joi.string().required().error(MirrorWorldSDKError["new"](error, toErrorMessage(error, ' The `storefront.name` should be a valid string.'))),
    subdomain: joi.string().required().error(MirrorWorldSDKError["new"](error, toErrorMessage(error, ' The `storefront.subdomain` should be a valid string.'))),
    description: joi.string().required().error(MirrorWorldSDKError["new"](error, toErrorMessage(error, ' The `storefront.description` should be a valid string.'))),
    logo: joi.string().uri().required().error(MirrorWorldSDKError["new"](error, toErrorMessage(error, ' The `storefront.logo` should be a valid URL.'))),
    banner: joi.string().uri().required().error(MirrorWorldSDKError["new"](error, toErrorMessage(error, ' The `storefront.banner` should be a valid URL.')))
  });
};
var createMarketplaceSchema = joi.object({
  treasury_mint: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_CREATE_MARKETPLACE_PAYLOAD', '`treasury_mint` should be a valid SPL mint address'))),
  seller_fee_basis_points: joi.number().min(0).max(10000).required().error(MirrorWorldSDKError["new"]('INVALID_CREATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_CREATE_MARKETPLACE_PAYLOAD', '`seller_fee_basis_points` should be a valid number between 0 and 10000'))),
  collections: joi.array().optional().items(joi.string()).error(MirrorWorldSDKError["new"]('INVALID_CREATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_CREATE_MARKETPLACE_PAYLOAD', '`collections` should be a valid array of SPL mint addresses'))),
  storefront: strorefrontConfigValidator('INVALID_CREATE_MARKETPLACE_PAYLOAD').optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_CREATE_MARKETPLACE_PAYLOAD', '`storefront` should be a valid Storefront configuration object.')))
});
var updateMarketplaceSchema = joi.object({
  treasury_mint: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_UPDATE_MARKETPLACE_PAYLOAD', '`treasury_mint` should be a valid SPL mint address'))),
  seller_fee_basis_points: joi.number().min(0).max(10000).required().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_UPDATE_MARKETPLACE_PAYLOAD', '`seller_fee_basis_points` should be a valid number between 0 and 10000'))),
  collections: joi.array().optional().items(joi.string()).error(MirrorWorldSDKError["new"]('INVALID_UPDATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_UPDATE_MARKETPLACE_PAYLOAD', '`collections` should be a valid array of SPL mint addresses'))),
  storefront: strorefrontConfigValidator('INVALID_UPDATE_MARKETPLACE_PAYLOAD').optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_UPDATE_MARKETPLACE_PAYLOAD', '`storefront` should be a valid Storefront configuration object.'))),
  new_authority: joi.string().optional().error(MirrorWorldSDKError["new"]('INVALID_UPDATE_MARKETPLACE_PAYLOAD', toErrorMessage('INVALID_UPDATE_MARKETPLACE_PAYLOAD', '`new_authority` should be a valid Solana address')))
});

var validActions = ['mint_nft', 'update_nft', 'transfer_spl_token', 'transfer_sol', 'create_collection', 'create_sub_collection', 'list_nft', 'buy_nft', 'cancel_listing', 'update_listing', 'transfer_nft', 'interaction', 'create_marketplace', 'update_marketplace'];

var _joi$string$required;
var createActionSchema = joi.object({
  type: (_joi$string$required = joi.string().required()).valid.apply(_joi$string$required, _toConsumableArray(validActions)).error(MirrorWorldSDKError["new"]('INVALID_CREATE_ACTION_PAYLOAD', toErrorMessage('INVALID_CREATE_ACTION_PAYLOAD', '`type` should be a one of: ' + ['mint_nft', 'update_nft', 'transfer_sol', 'transfer_spl_token', 'create_collection', 'create_sub_collection', 'list_nft', 'buy_nft', 'cancel_listing', 'update_listing', 'transfer_nft', 'interaction', 'create_marketplace', 'update_marketplace'].join(', ')))),
  value: joi.number().optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_ACTION_PAYLOAD', toErrorMessage('INVALID_CREATE_ACTION_PAYLOAD', '`value` should be a valid number'))),
  params: joi.object().optional().error(MirrorWorldSDKError["new"]('INVALID_CREATE_ACTION_PAYLOAD', toErrorMessage('INVALID_CREATE_ACTION_PAYLOAD', '`params` should be a valid object')))
});

var MirrorWorld = /*#__PURE__*/function () {
  // System variables
  function MirrorWorld(options) {
    var _this = this;

    _classCallCheck(this, MirrorWorld);

    _defineProperty(this, "_tokens", []);

    _defineProperty(this, "_transactions", []);

    _defineProperty(this, "_nfts", []);

    _defineProperty(this, "getApprovalToken", function (payload) {
      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(resolve, reject) {
          var result, response, action, approvalPath, authWindow;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  result = createActionSchema.validate(payload);

                  if (!result.error) {
                    _context2.next = 4;
                    break;
                  }

                  throw result.error;

                case 4:
                  _context2.next = 6;
                  return _this.sso.post("/v1/auth/actions/request", payload);

                case 6:
                  response = _context2.sent;
                  action = response.data.data;
                  console.debug('action_created', action);
                  console.debug('action:requesting_approval for', action.uuid);
                  approvalPath = "/approve/".concat(action.uuid);
                  _context2.next = 13;
                  return _this.openWallet(approvalPath);

                case 13:
                  authWindow = _context2.sent;
                  window.addEventListener('message', /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
                      var _event$data;

                      var _yield$import, deserialize, _event$data2, _payload;

                      return _regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return import('bson');

                            case 2:
                              _yield$import = _context.sent;
                              deserialize = _yield$import.deserialize;

                              if (((_event$data = event.data) === null || _event$data === void 0 ? void 0 : _event$data.name) === 'mw:action:approve') {
                                _payload = deserialize(event.data.payload);
                                console.debug('auth:approved_action', _payload);

                                if (_payload.action && _payload.action.uuid === action.uuid) {
                                  authWindow && authWindow.close();
                                  resolve({
                                    authorization_token: _payload.authorization_token,
                                    action: _payload.action
                                  });
                                } else if (((_event$data2 = event.data) === null || _event$data2 === void 0 ? void 0 : _event$data2.name) === 'mw:action:cancel') {
                                  reject("User denied approval for action:".concat(action.uuid, "."));
                                }
                              }

                            case 5:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function (_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  }());
                  _context2.next = 20;
                  break;

                case 17:
                  _context2.prev = 17;
                  _context2.t0 = _context2["catch"](0);
                  reject(_context2.t0.message);

                case 20:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 17]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });

    var _result = clientOptionsSchema.validate(options);

    if (_result.error) {
      throw _result.error;
    }

    var _result$value = _result.value,
      apiKey = _result$value.apiKey,
      _result$value$env = _result$value.env,
      env = _result$value$env === void 0 ? ClusterEnvironment.mainnet : _result$value$env,
      autoLoginCredentials = _result$value.autoLoginCredentials,
      _result$value$staging = _result$value.staging,
      staging = _result$value$staging === void 0 ? false : _result$value$staging;
    this._staging = staging;
    this._apiKey = apiKey;
    this._env = env;
    this._api = createAPIClient({
      apiKey: apiKey,
      staging: staging
    }, env);
    this.on('ready', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!autoLoginCredentials) {
                _context3.next = 5;
                break;
              }

              console.debug({
                autoLoginCredentials: autoLoginCredentials
              });
              _context3.next = 4;
              return _this.refreshAccessToken(autoLoginCredentials);

            case 4:
              _this.defineInternalListeners();

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    this.emit('ready', undefined);
    return this;
  }
  /* Get sdk's api client instance */


  _createClass(MirrorWorld, [{
    key: "api",
    get: function get() {
      return this._api.client;
    }
    /* Get sdk's api client instance */

  }, {
    key: "sso",
    get: function get() {
      return this._api.sso;
    }
    /** Get application's apiKey instance */

  }, {
    key: "apiKey",
    get: function get() {
      return this._apiKey;
    }
    /** Get instance's environment */

  }, {
    key: "clusterEnv",
    get: function get() {
      return this._env;
    }
    /** Get instance's environment */

  }, {
    key: "network",
    get: function get() {
      return this._env === ClusterEnvironment.mainnet ? 'mainnet' : this._env === ClusterEnvironment.testnet ? 'devnet' : 'devnet';
    }
    /** Get current user */

  }, {
    key: "user",
    get: function get() {
      return this._user;
    },
    set: function set(value) {
      this.emit('update:user', undefined);
      this._user = value;
    }
    /** Get current user's wallet */

  }, {
    key: "wallet",
    get: function get() {
      return this._user.wallet;
    }
    /** Get current user tokens */

  }, {
    key: "tokens",
    get: function get() {
      return this._tokens;
    }
    /** Set current user tokens */
    ,
    set: function set(value) {
      this._tokens = value;
    }
    /** Get current user transactions */

  }, {
    key: "transactions",
    get: function get() {
      return this._transactions;
    }
    /** Set current user transactions */
    ,
    set: function set(value) {
      this._transactions = value;
    }
  }, {
    key: "nfts",
    get: function get() {
      return this._nfts;
    },
    set: function set(value) {
      this._nfts = value;
    }
    /** Get current user */

  }, {
    key: "isLoggedIn",
    get: function get() {
      return !!this.user && !!this.userRefreshToken;
    }
  }, {
    key: "on",
    value: function on(event, handler) {
      return emitter.on(event, handler);
    }
  }, {
    key: "emit",
    value: function emit(event, payload) {
      return emitter.emit(event, payload);
    }
  }, {
    key: "defineInternalListeners",
    value: function defineInternalListeners() {
      this.on('update:user', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.debug('user updated');

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
    }
  }, {
    key: "useCredentials",
    value: function useCredentials(_ref5) {
      var _this2 = this;

      var accessToken = _ref5.accessToken;

      var createAccessTokenInterceptor = function createAccessTokenInterceptor(accessToken) {
        return function (config) {
          return _objectSpread(_objectSpread({}, config), {}, {
            headers: _objectSpread(_objectSpread({}, config.headers), {}, _defineProperty({}, 'x-api-key', _this2.apiKey), accessToken && {
              Authorization: "Bearer ".concat(accessToken)
            })
          });
        };
      };

      var serviceCredentialsInterceptorId = this.api.interceptors.request.use(createAccessTokenInterceptor(accessToken));
      var ssoCredentialsInterceptorId = this.sso.interceptors.request.use(createAccessTokenInterceptor(accessToken));
      this.on('logout', function () {
        _this2.api.interceptors.request.eject(serviceCredentialsInterceptorId);

        _this2.api.interceptors.request.eject(ssoCredentialsInterceptorId);
      });
    }
  }, {
    key: "loginWithEmail",
    value: function () {
      var _loginWithEmail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(credentials) {
        var response, accessToken;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.sso.post('/v1/auth/login', credentials);

              case 2:
                response = _context5.sent;
                accessToken = response.data.data.access_token;
                this.userRefreshToken = response.data.data.refresh_token;
                this.user = response.data.data.user;
                this.useCredentials({
                  accessToken: accessToken
                });
                this.emit('login:email', this.user);
                this.emit('login', this.user);
                return _context5.abrupt("return", this);

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function loginWithEmail(_x4) {
        return _loginWithEmail.apply(this, arguments);
      }

      return loginWithEmail;
    }()
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.sso.post('/v1/auth/logout');

              case 3:
                this._user = undefined;
                this.emit('logout', null);
                _context6.next = 9;
                break;

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function logout() {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }, {
    key: "refreshAccessToken",
    value: function () {
      var _refreshAccessToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(refreshToken) {
        var response, accessToken, user;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.sso.get('/v1/auth/refresh-token', {
                  headers: {
                    'x-refresh-token': refreshToken
                  }
                });

              case 2:
                response = _context7.sent;
                accessToken = response.data.data.access_token;
                this.userRefreshToken = response.data.data.refresh_token;
                user = response.data.data.user;
                this.user = user;
                this.useCredentials({
                  accessToken: accessToken
                });
                this.emit('auth:refreshToken', this.userRefreshToken);
                return _context7.abrupt("return", user);

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function refreshAccessToken(_x5) {
        return _refreshAccessToken.apply(this, arguments);
      }

      return refreshAccessToken;
    }()
  }, {
    key: "fetchUser",
    value: function () {
      var _fetchUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
        var response, user;
        return _regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.sso.get('/v1/auth/me').then();

              case 2:
                response = _context8.sent;
                user = response.data.data;
                this.user = user;
                return _context8.abrupt("return", user);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function fetchUser() {
        return _fetchUser.apply(this, arguments);
      }

      return fetchUser;
    }()
  }, {
    key: "authView",
    get: function get() {
      var result = mapServiceKeyToAuthView(this.apiKey, this._env, this._staging);
      return "".concat(result.baseURL);
    }
    /**
     * Opens wallet window
     * @param path
     * @private
     */

  }, {
    key: "openWallet",
    value: function () {
      var _openWallet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9(path) {
        var w, h, dualScreenLeft, dualScreenTop, width, height, systemZoom, left, top, authWindow;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!canUseDom) {
                  console.warn("Auth Window Login is only available in the Browser.");
                }

                w = 380;
                h = 720; // Check if user has multiple screens first.

                dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
                dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
                width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                systemZoom = width / window.screen.availWidth;
                left = (width - w) / 2 / systemZoom + dualScreenLeft;
                top = (height - h) / 2 / systemZoom + dualScreenTop;
                _context9.next = 12;
                const url = "".concat(this.authView).concat(path)
                // const a = function () {
                //   var a = document.createElement('a');
                //   a.setAttribute('href', url);
                //   a.setAttribute('target', '_blank');
                //   a.setAttribute('id', 'id');
                //   // 防止反复添加
                //   if (!document.getElementById('id')) {
                //     document.body.appendChild(a);
                //   }
                //   a.click();
                // }
                // return a()

                // return setTimeout(() => {
                //   window.open("".concat(this.authView).concat(path), '_self', "\n            popup=true\n            width=".concat(w, ",\n            height=").concat(h, ",\n            top=").concat(top, ",\n            left=").concat(left));
                // }, 4000);
                // let newWindow = window.open('about:blank')
                // return window.open("".concat(this.authView).concat(path), '_self', "\n            popup=true\n            width=".concat(w, ",\n            height=").concat(h, ",\n            top=").concat(top, ",\n            left=").concat(left));
                function openUrl(url) {
                  // var a = document.createElement('a');
                  // a.setAttribute('href', url);
                  // a.setAttribute('target', '_blank');
                  // a.setAttribute('id', '123');
                  // // 防止反复添加  
                  // if (!document.getElementById('123')) {
                  //   document.body.appendChild(a);
                  // }
                  // a.click();
                }
                // try {
                //   return window.open("".concat(this.authView).concat(path), '_blank', "\n            popup=true\n            width=".concat(w, ",\n            height=").concat(h, ",\n            top=").concat(top, ",\n            left=").concat(left));
                // } catch (error) {
                //   console.log(error, 'error');
                // }
                const ele = document.createElement('div');
                ele.innerHTML = "go to url";
                ele.style = "color:red; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);width:200px; height: 200px; background: pink; z-index: 999999; text-align: center; line-height: 200px;"
                ele.onclick = () => {
                  window.open("".concat(this.authView).concat(path), '_blank', "\n            popup=true\n            width=".concat(w, ",\n            height=").concat(h, ",\n            top=").concat(top, ",\n            left=").concat(left));
                }
                document.body.insertBefore(ele, document.body.firstElementChild);
              case 12:
                authWindow = _context9.sent;
                if (!!window.focus && !!(authWindow !== null && authWindow !== void 0 && authWindow.focus)) authWindow.focus();
                return _context9.abrupt("return", authWindow);

              case 15:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function openWallet(_x6) {
        return _openWallet.apply(this, arguments);
      }

      return openWallet;
    }()
    /***
     * Logs in a user. Opens a popup window for the login operation
     */

  }, {
    key: "login",
    value: function login() {
      var _this3 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee11(resolve, reject) {
          var authWindow;
          return _regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.prev = 0;
                  _context11.next = 3;
                  return _this3.openWallet('');

                case 3:
                  authWindow = _context11.sent;
                  window.addEventListener('message', /*#__PURE__*/function () {
                    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(event) {
                      var _event$data3;

                      var _yield$import2, deserialize, _payload2;

                      return _regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              _context10.next = 2;
                              return import('bson');

                            case 2:
                              _yield$import2 = _context10.sent;
                              deserialize = _yield$import2.deserialize;

                              if (!(((_event$data3 = event.data) === null || _event$data3 === void 0 ? void 0 : _event$data3.name) === 'mw:auth:login')) {
                                _context10.next = 14;
                                break;
                              }

                              _payload2 = deserialize(event.data.payload);
                              console.debug('auth:payload', _payload2);

                              if (!(_payload2.access_token && _payload2.refresh_token)) {
                                _context10.next = 14;
                                break;
                              }

                              _this3.userRefreshToken = _payload2.refresh_token;

                              _this3.useCredentials({
                                accessToken: _payload2.access_token
                              });

                              _context10.next = 12;
                              return _this3.fetchUser();

                            case 12:
                              authWindow && authWindow.close();
                              resolve({
                                user: _this3.user,
                                refreshToken: _this3.userRefreshToken
                              });

                            case 14:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      }, _callee10);
                    }));

                    return function (_x9) {
                      return _ref7.apply(this, arguments);
                    };
                  }());
                  _context11.next = 10;
                  break;

                case 7:
                  _context11.prev = 7;
                  _context11.t0 = _context11["catch"](0);
                  reject(_context11.t0.message);

                case 10:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, null, [[0, 7]]);
        }));

        return function (_x7, _x8) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getNftDetails",
    value:
      /**
       * Fetches an NFT's mint address on Solana
       * @param mintAddress
       */
      function () {
        var _getNftDetails = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee12(mintAddress) {
          var response;
          return _regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return this.api.get("/solana/nft/".concat(mintAddress));

                case 2:
                  response = _context12.sent;
                  return _context12.abrupt("return", response.data.data);

                case 4:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));

        function getNftDetails(_x10) {
          return _getNftDetails.apply(this, arguments);
        }

        return getNftDetails;
      }()
    /**
     * Fetches the current user's tokens
     */

  }, {
    key: "getTokens",
    value: function () {
      var _getTokens = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee13() {
        var response, tokens;
        return _regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.api.get("/wallet/tokens");

              case 2:
                response = _context13.sent;
                tokens = response.data.data;
                this.tokens = tokens;
                return _context13.abrupt("return", tokens);

              case 6:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getTokens() {
        return _getTokens.apply(this, arguments);
      }

      return getTokens;
    }()
    /**
     * Fetches the wallet transactions for a user
     */

  }, {
    key: "getTransactions",
    value: function () {
      var _getTransactions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee14() {
        var response, transactions;
        return _regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.api.get("/wallet/transactions");

              case 2:
                response = _context14.sent;
                transactions = response.data.data.transactions;
                this.transactions = transactions;
                return _context14.abrupt("return", transactions);

              case 6:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function getTransactions() {
        return _getTransactions.apply(this, arguments);
      }

      return getTransactions;
    }()
    /**
     * Fetches the current user's NFTs.
     */

  }, {
    key: "getNFTs",
    value: function () {
      var _getNFTs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee15(payload) {
        var nfts;
        return _regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!this.user && !this.isLoggedIn) {
                  throwError('ERROR_USER_NOT_AUTHENTICATED');
                }

                _context15.next = 3;
                return this.fetchNFTsByOwnerAddresses(_objectSpread({
                  owners: [this.user.wallet.sol_address]
                }, payload));

              case 3:
                nfts = _context15.sent;
                this.nfts = nfts;
                return _context15.abrupt("return", nfts);

              case 6:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function getNFTs(_x11) {
        return _getNFTs.apply(this, arguments);
      }

      return getNFTs;
    }()
    /**
     * Fetches the NFTs owned by a specific address.
     */

  }, {
    key: "getNFTsOwnedByAddress",
    value: function () {
      var _getNFTsOwnedByAddress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee16(address, payload) {
        return _regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!this.user && !this.isLoggedIn) {
                  throwError('ERROR_USER_NOT_AUTHENTICATED');
                }

                _context16.next = 3;
                return this.fetchNFTsByOwnerAddresses(_objectSpread({
                  owners: [address]
                }, payload));

              case 3:
                return _context16.abrupt("return", _context16.sent);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getNFTsOwnedByAddress(_x12, _x13) {
        return _getNFTsOwnedByAddress.apply(this, arguments);
      }

      return getNFTsOwnedByAddress;
    }()
    /**
     * Transfer SPL token to a recipient
     */

  }, {
    key: "transferSPLToken",
    value: function () {
      var _transferSPLToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee17(payload) {
        var result, _yield$this$getApprov, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                result = transferSPLTokenSchema.validate({
                  to_publickey: payload.recipientAddress,
                  amount: payload.amount,
                  token_mint: payload.tokenMint,
                  decimals: payload.tokenDecimals
                });

                if (!result.error) {
                  _context17.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context17.next = 5;
                return this.getApprovalToken({
                  type: 'transfer_spl_token',
                  value: payload.amount,
                  params: payload
                });

              case 5:
                _yield$this$getApprov = _context17.sent;
                authorization_token = _yield$this$getApprov.authorization_token;
                _context17.next = 9;
                return this.api.post("/wallet/transfer-token", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context17.sent;
                return _context17.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function transferSPLToken(_x14) {
        return _transferSPLToken.apply(this, arguments);
      }

      return transferSPLToken;
    }()
    /**
     * Transfer SOL to wallet address
     */

  }, {
    key: "transferSOL",
    value: function () {
      var _transferSOL = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee18(payload) {
        var result, _yield$this$getApprov2, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                result = transferSOLSchema.validate({
                  to_publickey: payload.recipientAddress,
                  amount: payload.amount
                });

                if (!result.error) {
                  _context18.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context18.next = 5;
                return this.getApprovalToken({
                  type: 'transfer_sol',
                  value: payload.amount,
                  params: payload
                });

              case 5:
                _yield$this$getApprov2 = _context18.sent;
                authorization_token = _yield$this$getApprov2.authorization_token;
                _context18.next = 9;
                return this.api.post("/wallet/transfer-sol", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context18.sent;
                return _context18.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function transferSOL(_x15) {
        return _transferSOL.apply(this, arguments);
      }

      return transferSOL;
    }()
    /**
     * @service Marketplace
     * Create Verified Collection
     */

  }, {
    key: "createVerifiedCollection",
    value: function () {
      var _createVerifiedCollection = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee19(payload) {
        var commitment,
          result,
          _yield$this$getApprov3,
          authorization_token,
          response,
          _args19 = arguments;

        return _regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                commitment = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : SolanaCommitment.confirmed;
                result = createVerifiedCollectionSchema.validate({
                  name: payload.name,
                  symbol: payload.symbol,
                  url: payload.metadataUri,
                  confirmation: commitment
                });

                if (!result.error) {
                  _context19.next = 4;
                  break;
                }

                throw result.error;

              case 4:
                _context19.next = 6;
                return this.getApprovalToken({
                  type: 'create_collection',
                  value: 0,
                  params: payload
                });

              case 6:
                _yield$this$getApprov3 = _context19.sent;
                authorization_token = _yield$this$getApprov3.authorization_token;
                _context19.next = 10;
                return this.api.post("/solana/mint/collection", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 10:
                response = _context19.sent;
                return _context19.abrupt("return", response.data.data);

              case 12:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function createVerifiedCollection(_x16) {
        return _createVerifiedCollection.apply(this, arguments);
      }

      return createVerifiedCollection;
    }()
    /**
     * @service Marketplace
     * Mint NFT into collection
     */

  }, {
    key: "mintNFT",
    value: function () {
      var _mintNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee20(payload) {
        var result, _yield$this$getApprov4, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                result = mintNFTSchema.validate({
                  name: payload.name,
                  symbol: payload.symbol,
                  url: payload.metadataUri,
                  collection_mint: payload.collection
                });

                if (!result.error) {
                  _context20.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context20.next = 5;
                return this.getApprovalToken({
                  type: 'mint_nft',
                  value: 0,
                  params: payload
                });

              case 5:
                _yield$this$getApprov4 = _context20.sent;
                authorization_token = _yield$this$getApprov4.authorization_token;
                _context20.next = 9;
                return this.api.post("/solana/mint/nft", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context20.sent;
                return _context20.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function mintNFT(_x17) {
        return _mintNFT.apply(this, arguments);
      }

      return mintNFT;
    }()
    /**
     * @service Marketplace
     * Update NFT metadata
     */

  }, {
    key: "updateNFT",
    value: function () {
      var _updateNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee21(payload) {
        var commitment,
          result,
          _yield$this$getApprov5,
          authorization_token,
          response,
          _args21 = arguments;

        return _regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                commitment = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : SolanaCommitment.confirmed;
                result = updateNFTSchema.validate({
                  mint_address: payload.mintAddress,
                  name: payload.name,
                  symbol: payload.symbol,
                  url: payload.metadataUri,
                  update_authority: payload.updateAuthority,
                  seller_fee_basis_points: payload.sellerFeeBasisPoints,
                  confirmation: commitment
                });

                if (!result.error) {
                  _context21.next = 4;
                  break;
                }

                throw result.error;

              case 4:
                _context21.next = 6;
                return this.getApprovalToken({
                  type: 'update_nft',
                  value: 0,
                  params: payload
                });

              case 6:
                _yield$this$getApprov5 = _context21.sent;
                authorization_token = _yield$this$getApprov5.authorization_token;
                _context21.next = 10;
                return this.api.post("/solana/mint/update", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 10:
                response = _context21.sent;
                return _context21.abrupt("return", response.data.data);

              case 12:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function updateNFT(_x18) {
        return _updateNFT.apply(this, arguments);
      }

      return updateNFT;
    }()
    /**
     * @service Marketplace
     * List NFT ion Mirror World Marketplace
     */

  }, {
    key: "listNFT",
    value: function () {
      var _listNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee22(payload) {
        var result, _yield$this$getApprov6, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                result = listNFTSchema.validate({
                  mint_address: payload.mintAddress,
                  price: payload.price,
                  auction_house: payload.auctionHouse
                });

                if (!result.error) {
                  _context22.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context22.next = 5;
                return this.getApprovalToken({
                  type: 'list_nft',
                  value: payload.price,
                  params: payload
                });

              case 5:
                _yield$this$getApprov6 = _context22.sent;
                authorization_token = _yield$this$getApprov6.authorization_token;
                _context22.next = 9;
                return this.api.post("/solana/marketplace/list", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context22.sent;
                return _context22.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function listNFT(_x19) {
        return _listNFT.apply(this, arguments);
      }

      return listNFT;
    }()
    /**
     * @service Marketplace
     * Purchase NFT on Mirror World Marketplace
     */

  }, {
    key: "buyNFT",
    value: function () {
      var _buyNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee23(payload) {
        var result, _yield$this$getApprov7, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                result = buyNFTSchema.validate({
                  mint_address: payload.mintAddress,
                  price: payload.price,
                  auction_house: payload.auctionHouse
                });

                if (!result.error) {
                  _context23.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context23.next = 5;
                return this.getApprovalToken({
                  type: 'buy_nft',
                  value: payload.price,
                  params: payload
                });

              case 5:
                _yield$this$getApprov7 = _context23.sent;
                authorization_token = _yield$this$getApprov7.authorization_token;
                _context23.next = 9;
                return this.api.post("/solana/marketplace/buy", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context23.sent;
                return _context23.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function buyNFT(_x20) {
        return _buyNFT.apply(this, arguments);
      }

      return buyNFT;
    }()
    /**
     * @service Marketplace
     * Update NFT Listing on Mirror World Marketplace
     */

  }, {
    key: "updateNFTListing",
    value: function () {
      var _updateNFTListing = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee24(payload) {
        var result, _yield$this$getApprov8, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                result = buyNFTSchema.validate({
                  mint_address: payload.mintAddress,
                  price: payload.price,
                  auction_house: payload.auctionHouse
                });

                if (!result.error) {
                  _context24.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context24.next = 5;
                return this.getApprovalToken({
                  type: 'update_listing',
                  value: payload.price,
                  params: payload
                });

              case 5:
                _yield$this$getApprov8 = _context24.sent;
                authorization_token = _yield$this$getApprov8.authorization_token;
                _context24.next = 9;
                return this.api.post("/solana/marketplace/update", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context24.sent;
                return _context24.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function updateNFTListing(_x21) {
        return _updateNFTListing.apply(this, arguments);
      }

      return updateNFTListing;
    }()
    /**
     * @service Marketplace
     * Cancel listing NFT on Mirror World Marketplace
     */

  }, {
    key: "cancelNFTListing",
    value: function () {
      var _cancelNFTListing = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee25(payload) {
        var result, _yield$this$getApprov9, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                result = cancelNFTListingSchema.validate({
                  mint_address: payload.mintAddress,
                  price: payload.price,
                  auction_house: payload.auctionHouse
                });

                if (!result.error) {
                  _context25.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context25.next = 5;
                return this.getApprovalToken({
                  type: 'cancel_listing',
                  value: payload.price,
                  params: payload
                });

              case 5:
                _yield$this$getApprov9 = _context25.sent;
                authorization_token = _yield$this$getApprov9.authorization_token;
                _context25.next = 9;
                return this.api.post("/solana/marketplace/cancel", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context25.sent;
                return _context25.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function cancelNFTListing(_x22) {
        return _cancelNFTListing.apply(this, arguments);
      }

      return cancelNFTListing;
    }()
    /**
     * @service Marketplace
     * Transfer NFT from holder's wallet to another address
     */

  }, {
    key: "transferNFT",
    value: function () {
      var _transferNFT = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee26(payload) {
        var result, _yield$this$getApprov10, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                result = transferNFTSchema.validate({
                  mint_address: payload.mintAddress,
                  to_wallet_address: payload.recipientAddress
                });

                if (!result.error) {
                  _context26.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context26.next = 5;
                return this.getApprovalToken({
                  type: 'transfer_nft',
                  value: 0,
                  params: payload
                });

              case 5:
                _yield$this$getApprov10 = _context26.sent;
                authorization_token = _yield$this$getApprov10.authorization_token;
                _context26.next = 9;
                return this.api.post("/solana/marketplace/transfer", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context26.sent;
                return _context26.abrupt("return", response.data.data);

              case 11:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function transferNFT(_x23) {
        return _transferNFT.apply(this, arguments);
      }

      return transferNFT;
    }()
    /**
     * @service Marketplace
     * Fetch NFTs By Mint Addresses. Returns a detailed payload of all NFTs whose `mintAddresses`
     * are provided
     */

  }, {
    key: "fetchNFTsByMintAddresses",
    value: function () {
      var _fetchNFTsByMintAddresses = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee27(payload) {
        var _response$data, _response$data$data;

        var result, response;
        return _regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                result = fetchNFTsByMintAddressesSchema.validate({
                  mint_addresses: payload.mintAddresses,
                  limit: payload.limit,
                  offset: payload.offset
                });

                if (!result.error) {
                  _context27.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context27.next = 5;
                return this.api.post("/solana/nft/mints", result.value);

              case 5:
                response = _context27.sent;
                return _context27.abrupt("return", (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$data = _response$data.data) === null || _response$data$data === void 0 ? void 0 : _response$data$data.nfts);

              case 7:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function fetchNFTsByMintAddresses(_x24) {
        return _fetchNFTsByMintAddresses.apply(this, arguments);
      }

      return fetchNFTsByMintAddresses;
    }()
    /**
     * @service Marketplace
     * Fetch NFTs By Creator Addresses. Returns a detailed payload of all NFTs whose `creatorAddresses`
     * are provided
     */

  }, {
    key: "fetchNFTsByCreatorAddresses",
    value: function () {
      var _fetchNFTsByCreatorAddresses = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee28(payload) {
        var _response$data2, _response$data2$data;

        var result, response;
        return _regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                result = fetchNFTsByCreatorAddressesSchema.validate({
                  creators: payload.creatorAddresses,
                  limit: payload.limit,
                  offset: payload.offset
                });

                if (!result.error) {
                  _context28.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context28.next = 5;
                return this.api.post("/solana/nft/creators", result.value);

              case 5:
                response = _context28.sent;
                return _context28.abrupt("return", (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$data = _response$data2.data) === null || _response$data2$data === void 0 ? void 0 : _response$data2$data.nfts);

              case 7:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function fetchNFTsByCreatorAddresses(_x25) {
        return _fetchNFTsByCreatorAddresses.apply(this, arguments);
      }

      return fetchNFTsByCreatorAddresses;
    }()
    /**
     * @service Marketplace
     * Fetch NFTs By Update Authorities Addresses. Returns a detailed payload of all NFTs whose `updateAuthorities`
     * are provided
     */

  }, {
    key: "fetchNFTsByUpdateAuthorities",
    value: function () {
      var _fetchNFTsByUpdateAuthorities = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee29(payload) {
        var _response$data3, _response$data3$data;

        var result, response;
        return _regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                result = fetchNFTsByUpdateAuthoritiesSchema.validate({
                  update_authorities: payload.updateAuthorities,
                  limit: payload.limit,
                  offset: payload.offset
                });

                if (!result.error) {
                  _context29.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context29.next = 5;
                return this.api.post("/solana/nft/udpate-authorities", result.value);

              case 5:
                response = _context29.sent;
                return _context29.abrupt("return", (_response$data3 = response.data) === null || _response$data3 === void 0 ? void 0 : (_response$data3$data = _response$data3.data) === null || _response$data3$data === void 0 ? void 0 : _response$data3$data.nfts);

              case 7:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function fetchNFTsByUpdateAuthorities(_x26) {
        return _fetchNFTsByUpdateAuthorities.apply(this, arguments);
      }

      return fetchNFTsByUpdateAuthorities;
    }()
    /**
     * @service Marketplace
     * Fetch NFTs By Owners Addresses. Returns a detailed payload of all NFTs whose `owners`
     * are provided
     */

  }, {
    key: "fetchNFTsByOwnerAddresses",
    value: function () {
      var _fetchNFTsByOwnerAddresses = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee30(payload) {
        var _response$data4, _response$data4$data;

        var result, response;
        return _regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                result = fetchNFTsByOwnerAddressesSchema.validate({
                  owners: payload.owners,
                  limit: payload.limit,
                  offset: payload.offset
                });

                if (!result.error) {
                  _context30.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context30.next = 5;
                return this.api.post("/solana/nft/owners", result.value);

              case 5:
                response = _context30.sent;
                return _context30.abrupt("return", (_response$data4 = response.data) === null || _response$data4 === void 0 ? void 0 : (_response$data4$data = _response$data4.data) === null || _response$data4$data === void 0 ? void 0 : _response$data4$data.nfts);

              case 7:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function fetchNFTsByOwnerAddresses(_x27) {
        return _fetchNFTsByOwnerAddresses.apply(this, arguments);
      }

      return fetchNFTsByOwnerAddresses;
    }()
    /**
     * @service Marketplace
     * Fetch Solana NFT Marketplace Activity
     */

  }, {
    key: "fetchNFTMarketplaceActivity",
    value: function () {
      var _fetchNFTMarketplaceActivity = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee31(mintAddress) {
        var _response$data5;

        var response;
        return _regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return this.api.get("/solana/activity/".concat(mintAddress));

              case 2:
                response = _context31.sent;
                return _context31.abrupt("return", (_response$data5 = response.data) === null || _response$data5 === void 0 ? void 0 : _response$data5.data);

              case 4:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function fetchNFTMarketplaceActivity(_x28) {
        return _fetchNFTMarketplaceActivity.apply(this, arguments);
      }

      return fetchNFTMarketplaceActivity;
    }()
    /**
     * Creates a new marketplace instance.
     * @param payload
     */

  }, {
    key: "createMarketplace",
    value: function () {
      var _createMarketplace = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee32(payload) {
        var _response$data6, _response$data6$data;

        var result, _yield$this$getApprov11, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                result = createMarketplaceSchema.validate({
                  treasury_mint: payload.treasuryMint,
                  collections: payload.collections,
                  seller_fee_basis_points: payload.sellerFeeBasisPoints,
                  storefront: payload.storefront
                });

                if (!result.error) {
                  _context32.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context32.next = 5;
                return this.getApprovalToken({
                  type: 'create_marketplace',
                  value: 0,
                  params: payload
                });

              case 5:
                _yield$this$getApprov11 = _context32.sent;
                authorization_token = _yield$this$getApprov11.authorization_token;
                _context32.next = 9;
                return this.api.post("/solana/marketplaces/create", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context32.sent;
                return _context32.abrupt("return", (_response$data6 = response.data) === null || _response$data6 === void 0 ? void 0 : (_response$data6$data = _response$data6.data) === null || _response$data6$data === void 0 ? void 0 : _response$data6$data.marketplace);

              case 11:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function createMarketplace(_x29) {
        return _createMarketplace.apply(this, arguments);
      }

      return createMarketplace;
    }()
    /**
     * Updates a marketplace instance.
     * @param payload
     */

  }, {
    key: "updateMarketplace",
    value: function () {
      var _updateMarketplace = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee33(payload) {
        var _response$data7, _response$data7$data;

        var result, _yield$this$getApprov12, authorization_token, response;

        return _regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                result = updateMarketplaceSchema.validate({
                  treasury_mint: payload.treasuryMint,
                  collections: payload.collections,
                  seller_fee_basis_points: payload.sellerFeeBasisPoints,
                  storefront: payload.storefront,
                  new_authority: payload.newAuthority
                });

                if (!result.error) {
                  _context33.next = 3;
                  break;
                }

                throw result.error;

              case 3:
                _context33.next = 5;
                return this.getApprovalToken({
                  type: 'update_marketplace',
                  value: 0,
                  params: payload
                });

              case 5:
                _yield$this$getApprov12 = _context33.sent;
                authorization_token = _yield$this$getApprov12.authorization_token;
                _context33.next = 9;
                return this.api.post("/solana/marketplaces/update", result.value, {
                  headers: {
                    'x-authorization-token': authorization_token
                  }
                });

              case 9:
                response = _context33.sent;
                return _context33.abrupt("return", (_response$data7 = response.data) === null || _response$data7 === void 0 ? void 0 : (_response$data7$data = _response$data7.data) === null || _response$data7$data === void 0 ? void 0 : _response$data7$data.marketplace);

              case 11:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function updateMarketplace(_x30) {
        return _updateMarketplace.apply(this, arguments);
      }

      return updateMarketplace;
    }()
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

  }, {
    key: "queryMarketplaces",
    value: function () {
      var _queryMarketplaces = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee34(query) {
        var pagination,
          params,
          response,
          _args34 = arguments;
        return _regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                pagination = _args34.length > 1 && _args34[1] !== undefined ? _args34[1] : {
                  page: 1,
                  count: 24
                };
                params = qs.stringify(_objectSpread(_objectSpread({}, query), pagination));
                _context34.next = 4;
                return this.api.get("/solana/marketplaces?".concat(params));

              case 4:
                response = _context34.sent;
                return _context34.abrupt("return", response.data.data.data);

              case 6:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function queryMarketplaces(_x31) {
        return _queryMarketplaces.apply(this, arguments);
      }

      return queryMarketplaces;
    }()
  }], [{
    key: "emit",
    value: function emit(event, payload) {
      return emitter.emit(event, payload);
    }
  }]);

  return MirrorWorld;
}();

export { ClusterEnvironment, MirrorWorld };
