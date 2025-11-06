import { attachFormBehavior } from './formController.js';

function setBirthDayMax() {
  const inputs = document.querySelectorAll('input[data-field="birth-day"]');
  if (!inputs.length) return;

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const maxDate = `${yyyy}-${mm}-${dd}`;

  inputs.forEach(input => input.max = maxDate);
}

document.addEventListener('DOMContentLoaded', () => {
  setBirthDayMax();
  attachFormBehavior();
});
