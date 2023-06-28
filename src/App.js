import React from 'react';
import './App.css';
import {HashRouter} from 'react-router-dom'
import RouterView from './router';
import {KeepAliveProvider} from 'keepalive-react-component'

function App() {
  return (
    <div>
      <HashRouter>
        <KeepAliveProvider>
          <RouterView />
        </KeepAliveProvider>
      </HashRouter>
    </div>
  );
}

export default App;
