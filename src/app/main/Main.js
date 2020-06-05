import React, { useState, useEffect } from 'react';
import List from './list/List';
import './main.css';
import checkLogin from './main.helper';

export default function Main() {

    let [loggedIn, setloggedInState] = useState(false);
    let [messages, setMessagesState] = useState([]);
    let [selectedMessageId, setSelectedMessageIdState] = useState(null);
    // useEffect(() => {
        checkLogin({ setloggedInState, setMessagesState });
    // }, [messages]);

    return <main className="page-content">
        {
            messages.length === 0 ? <div> Loading... </div> :
                <React.Fragment>
                    <List messages={messages} showMessage={(id) => { setSelectedMessageIdState(id) }} />
                    <div className="item-viewer">{loggedIn ? "Logged In" : "Not Logged in"} {selectedMessageId}</div>
                </React.Fragment>
        }

    </main>;
}