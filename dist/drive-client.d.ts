export declare class GoogleDriveClient {
    private appName;
    private apiClient;
    constructor(appName: string);
    listFiles(pageSize?: number): Promise<FileInfo[]>;
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
