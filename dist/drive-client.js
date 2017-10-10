"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jFile = java.io.File;
var ByteArrayOutputStream = java.io.ByteArrayOutputStream;
var OutputStream = java.io.OutputStream;
var Drive = com.google.android.gms.drive.Drive;
var GoogleAccountCredential = com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
var DriveScopes = com.google.api.services.drive.DriveScopes;
var Arrays = java.util.Arrays;
var ExponentialBackOff = com.google.api.client.util.ExponentialBackOff;
var AndroidHttp = com.google.api.client.extensions.android.http.AndroidHttp;
var JacksonFactory = com.google.api.client.json.jackson2.JacksonFactory;
var Manifest = android.manifest;
var AccountManager = android.accounts.AccountManager;
var SCOPES = [DriveScopes.DRIVE_METADATA_READONLY];
var PREF_ACCT_NAME = 'gapi:acct_name';
var REQUEST_ACCOUNT_PICKER = 1000;
var RESULT_OK = -1;
var permissions = require("nativescript-permissions");
var GoogleDriveClient = (function () {
    function GoogleDriveClient(appName) {
        this.appName = appName;
    }
    GoogleDriveClient.prototype.listFiles = function (pageSize) {
        var _this = this;
        if (pageSize === void 0) { pageSize = 10; }
        var credential = this.getGapiCredentials();
        return this.chooseAccount(credential).then(function () { return Promise.resolve(_this.getService(credential)); })
            .then(function (service) {
            var list = service.files().list().setPageSize(pageSize).setFields("nextPageToken, files(id, name)").execute();
            var fileList = list.getFiles();
            if (!fileList) {
                return Promise.resolve([]);
            }
            var fileArray = [];
            for (var i = 0; i < fileList.size(); i++) {
                var f = fileList.get(i);
                fileArray.push({
                    name: f.getName(),
                    id: f.getId()
                });
            }
            return Promise.resolve(fileArray);
        });
    };
    GoogleDriveClient.prototype.getService = function (credential) {
        var transport = AndroidHttp.newCompatibleTransport();
        var jsonFactory = JacksonFactory.getDefaultInstance();
        return new Drive.Builder(transport, jsonFactory, credential).setApplicationName(this.appName).build();
    };
    GoogleDriveClient.prototype.chooseAccount = function (credential) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var ctx = require('application').android.context;
            if (permissions.hasPermission(Manifest.permission.GET_ACCOUNTS)) {
                var acctName = require('application-settings').getString(PREF_ACCT_NAME);
                if (!!acctName) {
                    credential.setSelectedAccountName(acctName);
                    return resolve();
                }
                else {
                    var intent = credential.newChooseAccountIntent();
                    _this.getForegroundActivity().startActivityForResult(intent, REQUEST_ACCOUNT_PICKER);
                    _this.setActivityResultCallback(function (requestCode, resultCode, data) {
                        if (requestCode === REQUEST_ACCOUNT_PICKER && resultCode === RESULT_OK && !!data.getExtras()) {
                            var acctName_1 = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                            require('application-settings').setString(PREF_ACCT_NAME, acctName_1);
                            return resolve();
                        }
                    });
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
        require('application').android.onActivityResult = callback;
    };
    GoogleDriveClient.prototype.getForegroundActivity = function () {
        return require('application').android.foregroundActivity;
    };
    GoogleDriveClient.prototype.getGapiCredentials = function () {
        var ctx = require('application').android.context;
        var crd = GoogleAccountCredential.usingOAuth2(ctx, Arrays.asList(SCOPES)).setBackOff(new ExponentialBackOff());
    };
    return GoogleDriveClient;
}());
exports.GoogleDriveClient = GoogleDriveClient;
