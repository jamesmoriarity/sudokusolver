import { hot } from 'react-hot-loader';
import React from 'react';
import './App.css';

var message = 'zWelcome to sudokusolverz';
var App = function App() {
  return React.createElement(
    'div',
    { className: 'App' },
    React.createElement(
      'h1',
      null,
      message,
      '*!'
    )
  );
};

export default hot(module)(App);
