import GoogleService from '../gmail';
import { default as storage } from '../storage';

const googleService = new GoogleService();
const transactionName = "gmail";
let dataFetched = false;

function checkLogin({ setloggedInState, setMessagesState }) {
    googleService.status((isLoggedIn) => {
        setloggedInState(isLoggedIn);
        googleService.listen((isLoggedIn) => {
            if (isLoggedIn) {
                getMessagesList(setMessagesState);
                setloggedInState(isLoggedIn);
            }
        })
        if (!isLoggedIn) {
            googleService.login();
        } else {
            getMessagesList(setMessagesState);
        }
    });
}

function getMessagesList(setMessagesState) {
    getDataFromStorage(({ data }) => {
        if (data.length > 0) {
            data = data.sort((a, b) => a.id - b.id);
            setMessagesState(data);
        }
        else if (!dataFetched) {
            const messageIds = new Set();
            googleService.getMessagesList((messages) => {
                for (const message of messages) {
                    messageIds.add(message.id);
                }
                getMessages(messageIds, setMessagesState);
            })
        }
    })
}

function getMessages(messageIds, setMessagesState) {
    storage.connect(transactionName, (db) => {
        const ids = Array.from(messageIds);
        const messages = [];
        ids.map((id, key) => {
            googleService.getMessage(id, (data) => {
                const dataToPush = data.result;
                messages.push(dataToPush)
                storage.add(db, dataToPush);
                if (messages.length === ids.length) {
                    setMessagesState(messages);
                    dataFetched = true;
                }
            });
            return id;
        });
    });
}

function getDataFromStorage(cb) {
    storage.connect(transactionName, (db) => {
        storage.getAll(db, cb)
    });
}
export default checkLogin;