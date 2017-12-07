"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getSelectedAccount() {
    return require('application-settings').getString('gapi:acct_name');
}
exports.getSelectedAccount = getSelectedAccount;
