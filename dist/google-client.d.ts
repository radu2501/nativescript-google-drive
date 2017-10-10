import { QueryParam } from './google-client.qparams';
export declare class GoogleDriveClient {
    private appName;
    private scopes;
    private application;
    constructor(appName: string, scopes?: string[]);
    downloadFile(googleId: string, output: string): Promise<void>;
    uploadFile(path: string, parent: string, mimeType?: string): Promise<string>;
    fileExists(fileName: string): Promise<boolean>;
    folderExists(folderName: string): Promise<boolean>;
    ensureFolderExists(folderName: string): Promise<void | string>;
    createFile(fileName: string, mimeType: string): Promise<string>;
    createFolder(folderName: string): Promise<string>;
    uploadToAppFolder(path: string, mimeType?: string): Promise<string>;
    listAppFolder(): Promise<FileInfo[]>;
    lookupFileId(fileName: string): Promise<string>;
    listFiles(queryParams?: QueryParam[]): Promise<FileInfo[]>;
    private getNativeQueryParam(param);
    private getTaskCallback(onComplete, onError);
    private getService(credential);
    private chooseAccount(credential);
    private setActivityResultCallback(callback);
    private getForegroundActivity();
    private getGapiCredentials();
}
export interface FileInfo {
    name: string;
    id: string;
}
