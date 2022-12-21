import _ from 'lodash';
import './style.css';

function component() {
  const element = document.createElement('div');

  // lodash is now imported
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  console.log('console is working');
  console.log('console is working even after reverting to old config');
  
  

  return element;
}

document.body.appendChild(component());