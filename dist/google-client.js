"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Drive = com.google.api.services.drive.Drive;
var GoogleAccountCredential = com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
var Arrays = java.util.Arrays;
var ExponentialBackOff = com.google.api.client.util.ExponentialBackOff;
var AndroidHttp = com.google.api.client.extensions.android.http.AndroidHttp;
var JacksonFactory = com.google.api.client.json.jackson2.JacksonFactory;
var Manifest = android.Manifest;
var AccountManager = android.accounts.AccountManager;
var permissions = require("nativescript-permissions");
var google_drive_scopes_1 = require("./google-drive.scopes");
var util = require("./util");
var PREF_ACCT_NAME = 'gapi:acct_name';
var REQUEST_ACCOUNT_PICKER = 1000;
var REQUEST_AUTHORIZATION = 1001;
var RESULT_OK = -1;
var FOLDER_TYPE = 'application/vnd.google-apps.folder';
var DriveTasks = ro.nicoara.radu.googledrive.Tasks;
var GoogleDriveClient = (function () {
    function GoogleDriveClient(appName, scopes) {
        if (scopes === void 0) { scopes = [google_drive_scopes_1.DriveScopes.DRIVE]; }
        this.appName = appName;
        this.scopes = scopes;
        this.application = require('application').android;
    }
    Object.defineProperty(GoogleDriveClient, "SELECTED_ACCOUNT", {
        get: function () {
            return util.getSelectedAccount();
        },
        enumerable: true,
        configurable: true
    });
    GoogleDriveClient.prototype.chooseUserAccount = function () {
        var credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials, true).then(function () { return Promise.resolve(GoogleDriveClient.SELECTED_ACCOUNT); });
    };
    GoogleDriveClient.prototype.downloadFile = function (googleId, output) {
        var _this = this;
        var credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then(function (credentials) { return Promise.resolve(credentials); })
            .then(function (credentials) { return _this.getService(credentials); }).then(function (service) {
            return new Promise(function (resolve, reject) {
                DriveTasks.downloadFile(service, googleId, output, _this.getTaskCallback(resolve, reject));
            });
        });
    };
    GoogleDriveClient.prototype.uploadFile = function (path, parent, mimeType) {
        var _this = this;
        if (mimeType === void 0) { mimeType = null; }
        var credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then(function (credentials) { return Promise.resolve(_this.getService(credentials)); })
            .then(function (service) {
            return new Promise(function (resolve, reject) {
                DriveTasks.uploadFile(service, path, parent, mimeType, _this.getTaskCallback(resolve, reject));
            });
        });
    };
    GoogleDriveClient.prototype.fileExists = function (fileName) {
        return this.listFiles([{ key: 'name', operator: '=', value: fileName }])
            .then(function (files) { return Promise.resolve(!!files && files.length > 0); });
    };
    GoogleDriveClient.prototype.folderExists = function (folderName) {
        return this.listFiles([{
                key: 'name',
                operator: '=',
                value: folderName
            }, {
                key: 'mimeType',
                operator: '=',
                value: FOLDER_TYPE
            }]).then(function (files) { return Promise.resolve((!!files && files.length > 0)); });
    };
    GoogleDriveClient.prototype.ensureFolderExists = function (folderName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.folderExists(folderName).then(function (exists) {
                if (exists) {
                    return resolve();
                }
                _this.createFolder(folderName).then(function () { return resolve(); }).catch(function (err) { return reject(err); });
            });
        });
    };
    GoogleDriveClient.prototype.createFile = function (fileName, mimeType) {
        var _this = this;
        var credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then(function (credentials) { return Promise.resolve(_this.getService(credentials)); })
            .then(function (service) {
            return new Promise(function (resolve, reject) {
                DriveTasks.createFile(service, fileName, mimeType, _this.getTaskCallback(resolve, reject));
            });
        });
    };
    GoogleDriveClient.prototype.deleteFile = function (googleId) {
        var _this = this;
        var credentials = this.getGapiCredentials();
        return this.chooseAccount(credentials).then(function (credentials) { return Promise.resolve(credentials); })
            .then(function (credentials) { return _this.getService(credentials); })
            .then(function (service) {
            return new Promise(function (resolve, reject) {
                DriveTasks.deleteFile(service, googleId, _this.getTaskCallback(resolve, reject));
            });
        });
    };
    GoogleDriveClient.prototype.createFolder = function (folderName) {
        return this.createFile(folderName, FOLDER_TYPE);
    };
    GoogleDriveClient.prototype.uploadToAppFolder = function (path, mimeType) {
        return this.uploadFile(path, 'appDataFolder', mimeType);
    };
    GoogleDriveClient.prototype.listAppFolder = function () {
        return this.listFiles([{ key: 'appDataFolder', operator: 'in', value: 'parents' }]);
    };
    GoogleDriveClient.prototype.lookupFileId = function (fileName) {
        return this.listFiles([{
                key: 'name',
                value: fileName,
                operator: '='
            }]).then(function (files) {
            if (!files || files.length < 1) {
                return Promise.reject(new Error('File not found.'));
            }
            return Promise.resolve(files[0].id);
        });
    };
    GoogleDriveClient.prototype.listFiles = function (queryParams) {
        var _this = this;
        if (queryParams === void 0) { queryParams = null; }
        var credentials = this.getGapiCredentials();
        var qParams = null;
        if (!!queryParams) {
            qParams = queryParams.map(function (param) { return _this.getNativeQueryParam(param); });
        }
        return this.chooseAccount(credentials).then(function (credentials) { return Promise.resolve(_this.getService(credentials)); })
            .then(function (service) {
            return new Promise(function (resolve, reject) {
                DriveTasks.listFiles(service, qParams, _this.getTaskCallback(function (files) {
                    var fileArray = [];
                    for (var i = 0; i < files.size(); i++) {
                        var f = files.get(i);
                        fileArray.push({
                            name: f.getName(),
                            id: f.getId()
                        });
                    }
                    resolve(fileArray);
                }, function (err) {
                    if (err.isTransientAuthError()) {
                        _this.setActivityResultCallback(function (requestCode, resultCode, data) {
                            if (resultCode === RESULT_OK) {
                                _this.listFiles(queryParams).then(function () { return resolve(); })
                                    .catch(function (err) { return reject(err); });
                            }
                            else {
                                reject(err);
                            }
                        });
                        _this.getForegroundActivity().startActivityForResult(err.getCause().getIntent(), REQUEST_AUTHORIZATION);
                    }
                    else {
                        reject(err);
                    }
                }));
            });
        });
    };
    GoogleDriveClient.prototype.getNativeQueryParam = function (param) {
        return new ro.nicoara.radu.googledrive.QueryParam(param.key, "'" + param.value + "'", param.operator);
    };
    GoogleDriveClient.prototype.getTaskCallback = function (onComplete, onError) {
        return new ro.nicoara.radu.googledrive.OnCompleteCallback({
            onComplete: onComplete,
            onError: onError
        });
    };
    GoogleDriveClient.prototype.getService = function (credential) {
        var transport = AndroidHttp.newCompatibleTransport();
        var jsonFactory = JacksonFactory.getDefaultInstance();
        return new Drive.Builder(transport, jsonFactory, credential).setApplicationName(this.appName).build();
    };
    GoogleDriveClient.prototype.chooseAccount = function (credential, override) {
        var _this = this;
        if (override === void 0) { override = false; }
        return new Promise(function (resolve, reject) {
            if (permissions.hasPermission(Manifest.permission.GET_ACCOUNTS)) {
                var acctName = require('application-settings').getString(PREF_ACCT_NAME);
                if (!!acctName && !override) {
                    credential.setSelectedAccountName(acctName);
                    return resolve(credential);
                }
                else {
                    var intent = credential.newChooseAccountIntent();
                    _this.setActivityResultCallback(function (requestCode, resultCode, data) {
                        if (requestCode === REQUEST_ACCOUNT_PICKER && resultCode === RESULT_OK && !!data.getExtras()) {
                            var acctName_1 = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                            credential.setSelectedAccountName(acctName_1);
                            require('application-settings').setString(PREF_ACCT_NAME, acctName_1);
                            return resolve(credential);
                        }
                        else {
                            return reject({ requestCode: requestCode, resultCode: resultCode });
                        }
                    });
                    _this.getForegroundActivity().startActivityForResult(intent, REQUEST_ACCOUNT_PICKER);
                }
            }
            else {
                permissions.requestPermission(Manifest.permission.GET_ACCOUNTS)
                    .then(function () {
                    _this.chooseAccount(credential).then(function () { return resolve(); });
                })
                    .catch(function () {
                    reject();
                });
            }
        });
    };
    GoogleDriveClient.prototype.setActivityResultCallback = function (callback) {
        var activity = this.getForegroundActivity();
        var prevCallback = activity.onActivityResult;
        activity.onActivityResult = function (requestCode, resultCode, data) {
            callback(requestCode, resultCode, data);
            activity.onActivityResult = prevCallback;
        };
    };
    GoogleDriveClient.prototype.getForegroundActivity = function () {
        return this.application.startActivity;
    };
    GoogleDriveClient.prototype.getGapiCredentials = function () {
        var ctx = this.application.context;
        var crd = GoogleAccountCredential.usingOAuth2(ctx, Arrays.asList(this.scopes)).setBackOff(new ExponentialBackOff());
        return crd;
    };
    return GoogleDriveClient;
}());
exports.GoogleDriveClient = GoogleDriveClient;
