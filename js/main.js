import { attachFormBehavior } from './formController.js';

function setBirthDayMax() {
  let input = document.getElementById('birth-day');
  if(!input) {
    return;
  }

  let today = new Date();

  today.setFullYear(today.getFullYear() - 18);
  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let day = String(today.getDate()).padStart(2, '0');

  input.max = `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', () => {
  setBirthDayMax();
  attachFormBehavior();
});
