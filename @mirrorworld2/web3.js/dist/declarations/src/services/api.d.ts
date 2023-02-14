import { AxiosInstance } from 'axios';
import { ClusterEnvironment } from './cluster';
export interface MirrorWorldAPIClientOptions {
    env?: ClusterEnvironment;
    apiKey: string;
    clientId?: string;
    staging?: boolean;
}
export interface ErrorAPIResponse {
    code: number;
    data?: null;
    error: string;
    message: string;
}
export declare function throwError(response: ErrorAPIResponse): void;
export declare function handleAPIError(response: ErrorAPIResponse): void;
export declare const mapServiceKeyToEnvironment: (apiKey: string, environment: ClusterEnvironment, sso?: boolean, staging?: boolean) => {
    environment: string;
    baseURL: string;
} | undefined;
export declare const mapServiceKeyToAuthView: (apiKey: string, environment: ClusterEnvironment, staging?: boolean) => {
    baseURL: string;
};
export declare class MirrorWorldAPIClient {
    client: AxiosInstance;
    sso: AxiosInstance;
    constructor({ env, apiKey, staging, }: MirrorWorldAPIClientOptions);
    static defineErrorResponseHandlers(client: AxiosInstance): void;
    static defineRequestHandlers(client: AxiosInstance, apiKey: string, authToken?: string): void;
}
export interface ClientOptions {
    apiKey: string;
    staging?: boolean;
}
export declare function createAPIClient({ apiKey, staging }: ClientOptions, environment?: ClusterEnvironment): MirrorWorldAPIClient;
