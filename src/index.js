import React from 'react';
import { render } from 'react-dom';
import App from './App';
console.log('root = ' + document.getElementById('root'));
render(React.createElement(App, null), document.getElementById('root'));