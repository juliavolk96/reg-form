import { setBirthDayMax } from '../main.js';

export function runMainTests(logTest) {
  const input = document.createElement('input');
  input.setAttribute('data-field', 'birth-day');
  document.body.appendChild(input);

  setBirthDayMax();

  const max = input.getAttribute('max');
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const expectedMax = today.toISOString().split('T')[0];

  logTest('Main', 'setBirthDayMax sets correct max date', max, expectedMax);

  document.body.removeChild(input);

  try {
    setBirthDayMax();
    logTest('Main', 'setBirthDayMax handles no inputs gracefully', true, true);
  } catch (e) {
    logTest('Main', 'setBirthDayMax handles no inputs gracefully', false, true);
  }

  const firstBirthInput = document.createElement('input');
  const secondBirthInput = document.createElement('input');
  firstBirthInput.setAttribute('data-field', 'birth-day');
  secondBirthInput.setAttribute('data-field', 'birth-day');
  document.body.append(firstBirthInput, secondBirthInput);

  setBirthDayMax();

  const firstMax = firstBirthInput.getAttribute('max');
  const secondMax = secondBirthInput.getAttribute('max');

  logTest(
    'Main',
    'setBirthDayMax sets same max for all birth-day inputs',
    firstMax === secondMax,
    true
  );

  document.body.removeChild(firstBirthInput);
  document.body.removeChild(secondBirthInput);
}
