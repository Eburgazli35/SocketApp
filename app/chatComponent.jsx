'use client';
import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import './globals.css';

const ChatComponent = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [notificationSound, setNotificationSound] = useState(null);

    useEffect(() => {
        setNotificationSound(new Audio('/notification.mp3'));
    }, []);
    
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('//10.10.20.3:8088/ChatHub', {
            withCredentials: true,
            mode: 'no-cors'
        })
        .withAutomaticReconnect()
        .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Bağlantı kuruldu!');
                    // Bağlantı kurulduktan sonra mesajları dinle
                    connection.on('ReceiveMessage', (user, message) => {
                        setMessages(prevMessages => [...prevMessages, { user, message }]);
                        if (notificationSound && user !== username) {
                            notificationSound.play(); 
                        }
                    });
                })
                .catch(error => console.error('Bağlantı başarısız: ', error));
            
            // Bağlantı durumu değişimlerini dinleme
            connection.onclose(err => {
                console.error('Bağlantı kapandı:', err);
            });
        }
    }, [connection, notificationSound, username]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (connection && message.trim() && username.trim()) {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke('SendMessage', username, message)
                    .then(() => setMessage('')) // Başarılıysa mesajı temizle
                    .catch(error => console.error('Send failed: ', error));
            } else {
                console.log('Bağlantı bağlı değil, tekrar başlatılıyor...');
                connection.start() // Bağlantıyı yeniden başlatmayı deneyin
                    .then(() => {
                        console.log('Bağlantı başarıyla başlatıldı.');
                        return connection.invoke('SendMessage', username, message);
                    })
                    .then(() => setMessage(''))
                    .catch(error => console.error('Send failed: ', error));
            }
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div className="max-w-lg mx-auto p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
            <div className="mb-4">
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Kullanıcı adı girin..."
                />
            </div>
            <ul className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <li key={index} className="p-2 border-b border-gray-200">
                        <strong className="text-blue-600">{msg.user}</strong>: {msg.message}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mesaj gönder..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatComponent;
