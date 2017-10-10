"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DriveScopes = (function () {
    function DriveScopes() {
    }
    Object.defineProperty(DriveScopes, "DRIVE", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_APPDATA", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.appdata';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_FILE", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.file';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_METADATA", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.metadata';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_METADATA_READONLY", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.metadata.readonly';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_PHOTOS_READONLY", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.photos.readonly';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_READONLY", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.readonly';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "DRIVE_SCRIPTS", {
        get: function () {
            return 'https://www.googleapis.com/auth/drive.scripts';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveScopes, "ALL", {
        get: function () {
            return [
                DriveScopes.DRIVE,
                DriveScopes.DRIVE_APPDATA,
                DriveScopes.DRIVE_FILE,
                DriveScopes.DRIVE_METADATA,
                DriveScopes.DRIVE_METADATA_READONLY,
                DriveScopes.DRIVE_PHOTOS_READONLY,
                DriveScopes.DRIVE_SCRIPTS,
                DriveScopes.DRIVE_READONLY
            ];
        },
        enumerable: true,
        configurable: true
    });
    return DriveScopes;
}());
exports.DriveScopes = DriveScopes;
