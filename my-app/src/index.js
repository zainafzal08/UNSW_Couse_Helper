import React from 'react';
import ReactDOM from 'react-dom';
import UNSWNavBar from './UNSWNavBar';
import CourseSearch from './CourseSearch';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<UNSWNavBar />, document.getElementById('nav-bar'));
ReactDOM.render(<CourseSearch />, document.getElementById('main-view'));
registerServiceWorker();
