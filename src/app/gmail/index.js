import { default as config } from './credentials.json';
const gapi = window.gapi;

const CLIENT_ID = config.client_id;
const API_KEY = config.api_key;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';


// function listLabels() {
//     gapi.client.gmail.users.labels.list({
//         'userId': 'me'
//     }).then(function (response) {
//         const labels = response.result.labels;
//         console.log(labels)
//     });
// }
function getMessage(userId, messageId, callback) {
    var request = gapi.client.gmail.users.messages.get({
        'userId': userId,
        'id': messageId
    });
    request.execute(callback);
}

function listMessages(userId, query, callback) {
    const getPageOfMessages = function (request, result) {
        request.execute(function (resp) {
            result = result.concat(resp.messages);
            const nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.gmail.users.messages.list({
                    'userId': userId,
                    'pageToken': nextPageToken,
                    'q': query
                });
                getPageOfMessages(request, result);
            } else {
                callback(result);
            }
        });
    };
    const initialRequest = gapi.client.gmail.users.messages.list({
        'userId': userId,
        'q': query
    });
    getPageOfMessages(initialRequest, []);
}

export default function GoogleService() {
    this.status = function (cb) {
        gapi.load('client:auth2', async () => {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });
            const status = gapi.auth2.getAuthInstance().isSignedIn.get();
            cb(status);

        })
    };
    this.login = function () {
        console.log("Attempting login")
        gapi.auth2.getAuthInstance().signIn();
    }
    this.logout = function () {
        gapi.auth2.getAuthInstance().signOut();
    }
    this.listen = function (cb) {
        return gapi.auth2.getAuthInstance().isSignedIn.listen(cb);
    }
    this.getMessagesList = function (cb) {
        const userId = 'me';
        const query = "";
        listMessages(userId, query, cb);
    }
    this.getMessage = function (messageId, cb) {
        const userId = 'me';
        getMessage(userId, messageId, cb)
    }
}