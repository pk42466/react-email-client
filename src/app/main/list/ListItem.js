import React from 'react';

export default function ListItem(props) {
    return <div className="list-item" onClick={() => props.showMessage(props.id)}>
        <div className="date">{props.receivedAt}</div>
        <div className="sender"><span className={props.important ? "important" : ""}></span>{props.sender.split("<")[0]}</div>
        <div className="subject">{props.subject}</div>
        <div className="message">{props.message}</div>
    </div>
}