import React, { useState } from 'react';
import axios from 'axios';

export default function Notificate() {
    const [token, setToken] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const handleSendNotification = async (event) => {
        event.preventDefault();

        const message = {
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: { data: 'goes here' },
            _displayInForeground: true,
        };

        //const response = await axios.post('https://exp.host/--/api/v2/push/send', message);
        const response = await axios.post('http://localhost:3001/send-notification', { token, title, body });

        console.log(response.data);
    };

    return (
        <div>
            <form onSubmit={handleSendNotification}>
                <label>
                    Token:
                    <input type="text" value={token} onChange={(event) => setToken(event.target.value)} required />
                </label>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
                </label>
                <label>
                    Body:
                    <input type="text" value={body} onChange={(event) => setBody(event.target.value)} required />
                </label>
                <input type="submit" value="Send notification" />
            </form>
        </div>
    );
}
