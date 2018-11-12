import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TigerEatsApp from './components/TigerEatsApp';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<TigerEatsApp />, document.getElementById('root'));
serviceWorker.unregister();
