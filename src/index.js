import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/chatContext';
import OneSignalReact from 'react-onesignal';

OneSignalReact.init({
  appId: 'e9a0dd62-7875-4412-bd6e-1669e538a979',
  safari_web_id: "web.onesignal.auto.3d5e9a66-9429-4fce-a7e3-61aa58d6c253",
  notifyButton: {
    enable: true,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ChatContextProvider>
  </AuthContextProvider>
);


