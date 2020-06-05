import React, { useEffect, useRef } from 'react';
import ListItem from './ListItem';
import './list.css';
import * as moment from 'moment';
// import { default as nlp } from 'compromise';
// import { default as dates } from 'compromise-dates';
// import { default as numbers } from 'compromise-numbers';
// nlp.extend(dates);
// nlp.extend(numbers);

export default function List(props) {
    const listItems = [];
    // const labels = new Set();
    let selectedMessage = useRef("");
    useEffect(() => {
        if (props.messages.length > 0 && selectedMessage.current !== props.messages[0].id) {
            selectedMessage.current = props.messages[0].id;
            props.showMessage(selectedMessage.current);
        }
    });

    let messages = props.messages.map(message => {
        // labels.add(...message.labelIds)
        const payload = message.payload;
        const headers = payload.headers;
        const headersToGet = ["From", "Subject", "Received"]
        const data = {};

        headers.map(header => {
            if (headersToGet.indexOf(header.name) !== -1) {
                data[header.name] = header.value;
            };
            return header;
        })
        let dateString = data.Received;
        let date = null;
        let time = 0;
        if (dateString) {
            date = dateString.split(";")[1];
            if (!date) {
                dateString = dateString.replace(/,/g, ';')
                date = dateString.split(";")[1];
            }
            if (date) {
                date = date.split("(")[0];
                if (date.indexOf(",") !== -1) date = date.split(",")[1];
                if (date) {
                    date = date.trim();
                    time = moment(date, "DD MMM YYYY HH:mm:ss Z").utc();
                    date = moment(date, "DD MMM YYYY HH:mm:ss Z").format("DD MMM, YYYY HH:mm A");
                } else {
                    console.log(dateString)
                }
            }
        }
        return {
            id: message.id,
            sender: data.From,
            subject: data.Subject,
            receivedAt: date,
            time: time,
            message: payload.snippet,
        }
    });
    // console.log(labels)

    messages = messages.sort((a, b) => b.time - a.time);

    for (const message of messages) {
        listItems.push(<ListItem
            key={message.id}
            id={message.id}
            important={false}
            sender={message.sender}
            subject={message.subject}
            receivedAt={message.receivedAt}
            message={message.message}
            showMessage={() => { props.showMessage(message.id); }}
        />);
    }
    return <div className="mail-list">
        {listItems}
    </div>
}
