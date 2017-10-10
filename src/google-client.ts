import { QueryParam } from './google-client.qparams';
declare var com;
declare var java;
declare var android;


let Drive = com.google.api.services.drive.Drive;
let GoogleAccountCredential = com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
let Arrays = java.util.Arrays;
let ExponentialBackOff = com.google.api.client.util.ExponentialBackOff;
let AndroidHttp = com.google.api.client.extensions.android.http.AndroidHttp;
let JacksonFactory = com.google.api.client.json.jackson2.JacksonFactory;
let Manifest = android.Manifest;
let AccountManager = android.accounts.AccountManager;
declare var ro;


import * as permissions from 'nativescript-permissions';
import { DriveScopes } from './google-drive.scopes';

const PREF_ACCT_NAME: string = 'gapi:acct_name';
const REQUEST_ACCOUNT_PICKER = 1000;
const REQUEST_AUTHORIZATION = 1001;
const RESULT_OK = -1;
const FOLDER_TYPE = 'application/vnd.google-apps.folder';

let DriveTasks = ro.nicoara.radu.googledrive.Tasks;

export class GoogleDriveClient {
    private application: any;

    constructor(private appName: string, private scopes: string[] = [DriveScopes.DRIVE]) {
        this.application = require('application').android;
    }

    public downloadFile(googleId: string, output: string): Promise<void> {
        let credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then((credentials) => Promise.resolve(credentials))
            .then(service => {
                return new Promise<void>((resolve, reject) => {
                    DriveTasks.downloadFile(service, googleId, output, this.getTaskCallback(resolve, reject));
                });
            });
    }

    public uploadFile(path: string, parent: string, mimeType: string = null): Promise<string> {
        let credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then((credentials) => Promise.resolve(this.getService(credentials)))
            .then(service => {
                return new Promise<string>((resolve, reject) => {
                    DriveTasks.uploadFile(service, path, parent, mimeType, this.getTaskCallback(resolve, reject))
                });
            });
    }

    public fileExists(fileName: string): Promise<boolean> {
        return this.listFiles([{ key: 'name', operator: '=', value: fileName }])
            .then((files) => Promise.resolve(!!files && files.length > 0));
    }

    public folderExists(folderName: string): Promise<boolean> {
        return this.listFiles([{
            key: 'name',
            operator: '=',
            value: folderName
        }, {
            key: 'mimeType',
            operator: '=',
            value: FOLDER_TYPE
        }]).then((files) => Promise.resolve((!!files && files.length > 0) as boolean));
    }

    public ensureFolderExists(folderName: string): Promise<void | string> {
        return new Promise<void>((resolve, reject) => {
            this.folderExists(folderName).then(exists => {
                if (exists) {
                    return resolve();
                }
                this.createFolder(folderName).then(() => resolve()).catch((err) => reject(err));
            });
        });
    }

    public createFile(fileName: string, mimeType: string): Promise<string> {
        let credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then((credentials) => Promise.resolve(this.getService(credentials)))
            .then(service => {
                return new Promise<string>((resolve, reject) => {
                    DriveTasks.createFile(service, fileName, mimeType, this.getTaskCallback(resolve, reject));
                });
            });
    }

    public createFolder(folderName: string): Promise<string> {
        return this.createFile(folderName, FOLDER_TYPE);
    }

    public uploadToAppFolder(path: string, mimeType?: string): Promise<string> {
        return this.uploadFile(path, 'appDataFolder', mimeType);
    }

    public listAppFolder(): Promise<FileInfo[]> {
        return this.listFiles([{ key: 'appDataFolder', operator: 'in', value: 'parents' }]);
    }

    public lookupFileId(fileName: string): Promise<string> {
        return this.listFiles([{
            key: 'name',
            value: fileName,
            operator: '='
        }]).then(files => {
            if (!files || files.length < 1) {
                return Promise.reject(new Error('File not found.'));
            }
            return Promise.resolve(files[0].id);
        });
    }

    public listFiles(queryParams: QueryParam[] = null): Promise<FileInfo[]> {
        let credentials = this.getGapiCredentials();
        let qParams = null;
        if (!!queryParams) {
            qParams = queryParams.map((param) => this.getNativeQueryParam(param));
        }
        return this.chooseAccount(credentials).then((credentials) => Promise.resolve(this.getService(credentials)))
            .then(service => {
                console.log('got a service');
                return new Promise<FileInfo[]>((resolve, reject) => {
                    DriveTasks.listFiles(service, qParams, this.getTaskCallback(
                        (files) => {
                            console.log('im done')
                            let fileArray: FileInfo[] = [];
                            for (let i = 0; i < files.size(); i++) {
                                let f = files.get(i);
                                fileArray.push({
                                    name: f.getName(),
                                    id: f.getId()
                                });

                            }
                            resolve(fileArray);
                        },
                        (err) => {
                            console.log(err.getCause().getMessage());
                            if (err.isTransientAuthError()) {
                                this.setActivityResultCallback((requestCode, resultCode, data) => {
                                    if (resultCode === RESULT_OK) {
                                        this.listFiles(queryParams).then(() => resolve())
                                            .catch(err => reject(err));
                                    } else {
                                        reject(err);
                                    }
                                });
                                this.getForegroundActivity().startActivityForResult(err.getCause().getIntent(), REQUEST_AUTHORIZATION);
                            } else {
                                reject(err);
                            }
                        })
                    );
                });
            });
    }

    private getNativeQueryParam(param: QueryParam): any {
        return new ro.nicoara.radu.googledrive.QueryParam(param.key, `'${param.value}'`, param.operator);
    }

    private getTaskCallback(onComplete: Function, onError: Function) {
        return new ro.nicoara.radu.googledrive.OnCompleteCallback({
            onComplete: onComplete,
            onError: onError
        });
    }

    private getService(credential: any): any {
        let transport = AndroidHttp.newCompatibleTransport();
        let jsonFactory = JacksonFactory.getDefaultInstance();
        return new Drive.Builder(transport, jsonFactory, credential).setApplicationName(this.appName).build();
    }

    private chooseAccount(credential: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (permissions.hasPermission(Manifest.permission.GET_ACCOUNTS)) {
                let acctName: string = require('application-settings').getString(PREF_ACCT_NAME);
                if (!!acctName) {
                    console.log('selected acct name %s', acctName);
                    credential.setSelectedAccountName(acctName);
                    return resolve(credential);
                } else {
                    let intent = credential.newChooseAccountIntent();

                    this.setActivityResultCallback(function (requestCode, resultCode, data) {
                        console.log('in callback');
                        if (requestCode === REQUEST_ACCOUNT_PICKER && resultCode === RESULT_OK && !!data.getExtras()) {
                            let acctName: string = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                            console.log('selected acct name %s', acctName);
                            credential.setSelectedAccountName(acctName);
                            require('application-settings').setString(PREF_ACCT_NAME, acctName);
                            console.log('set acct name');
                            return resolve(credential);
                        } else {
                            return reject({ requestCode: requestCode, resultCode: resultCode })
                        }
                    });

                    this.getForegroundActivity().startActivityForResult(intent, REQUEST_ACCOUNT_PICKER);
                }
            } else {
                permissions.requestPermission(Manifest.permission.GET_ACCOUNTS)
                    .then(() => {
                        this.chooseAccount(credential).then(() => resolve());
                    })
                    .catch(() => {
                        reject();
                    })
            }
        });

    }

    private setActivityResultCallback(callback: Function) {
        console.log('setting callback')
        let activity = this.getForegroundActivity();
        let prevCallback = activity.onActivityResult;

        activity.onActivityResult = function (requestCode, resultCode, data) {
            console.log('callback called')
            callback(requestCode, resultCode, data);
            activity.onActivityResult = prevCallback;
        }

        console.log('DEBUG: calback set')
    }

    private getForegroundActivity(): any {
        return this.application.startActivity;
    }

    private getGapiCredentials(): any {
        let ctx = this.application.context;
        let crd = GoogleAccountCredential.usingOAuth2(ctx, Arrays.asList(this.scopes)).setBackOff(new ExponentialBackOff());
        return crd;
    }

}

export interface FileInfo {
    name: string;
    id: string;
}