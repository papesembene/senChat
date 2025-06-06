// import './index.css';
// import './style.css';
// import { ShowLoginForm }   from './components/Login.js';
// document.getElementById('app').appendChild(ShowLoginForm());

import './index.css';
import './style.css';
import { router } from './components/router.js';


window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);