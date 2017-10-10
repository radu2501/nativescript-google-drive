declare var com;

export class DriveScopes {
    static get DRIVE(): string {
        return 'https://www.googleapis.com/auth/drive';
    }
    static get DRIVE_APPDATA(): string {
        return 'https://www.googleapis.com/auth/drive.appdata';
    }
    static get DRIVE_FILE(): string {
        return 'https://www.googleapis.com/auth/drive.file';
    }
    static get DRIVE_METADATA(): string {
        return 'https://www.googleapis.com/auth/drive.metadata';
    }
    static get DRIVE_METADATA_READONLY(): string {
        return 'https://www.googleapis.com/auth/drive.metadata.readonly';
    }
    static get DRIVE_PHOTOS_READONLY(): string {
        return 'https://www.googleapis.com/auth/drive.photos.readonly';
    }
    static get DRIVE_READONLY(): string {
        return 'https://www.googleapis.com/auth/drive.readonly';
    }
    static get DRIVE_SCRIPTS(): string {
        return 'https://www.googleapis.com/auth/drive.scripts';
    }
    static get ALL(): string[] {
        return [
            DriveScopes.DRIVE,
            DriveScopes.DRIVE_APPDATA,
            DriveScopes.DRIVE_FILE,
            DriveScopes.DRIVE_METADATA,
            DriveScopes.DRIVE_METADATA_READONLY,
            DriveScopes.DRIVE_PHOTOS_READONLY,
            DriveScopes.DRIVE_SCRIPTS,
            DriveScopes.DRIVE_READONLY
        ]
    }
}