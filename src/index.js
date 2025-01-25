import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from "./store/index";
import { ErrorBoundary } from './ErrorBoundary';

if (process.env.NODE_ENV === "production") {
  console.log = () => {}; // 本番環境で console.log を無効化
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
          <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);


