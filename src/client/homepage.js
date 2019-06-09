import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/createStore'
import Homepage from './components/Homepage.jsx';


ReactDOM.render(<Provider store={store} ><Homepage /></Provider>, document.getElementById('root'));

