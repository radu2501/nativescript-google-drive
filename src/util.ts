export function getSelectedAccount(): string {
    return require('application-settings').getString('gapi:acct_name');
}