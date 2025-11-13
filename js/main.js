import { createForm } from './formController.js';
import * as validators from './validators.js';

export function setBirthDayMax() {
  const inputs = document.querySelectorAll('input[data-field="birth-day"]');
  if (!inputs.length) return;

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const maxDate = today.toISOString().split('T')[0];

  inputs.forEach(input => input.max = maxDate);
}

document.addEventListener('DOMContentLoaded', () => {
  setBirthDayMax();

  const formEl = document.querySelector('[data-form]');
  if (!formEl) return;

  createForm({
    root: formEl,
    validators: {
      'first-name': validators.validateName,
      'last-name': validators.validateName,
      'email': validators.validateEmail,
      'password': validators.validatePassword,
      'password-confirm': (value, values) => validators.validateConfirmPassword(values.password, value),
      'birth-day': validators.validateBirthDay,
    },
    apiClient: async (data) => {
      console.log('Submitting data to API', data);
      await new Promise(res => setTimeout(res, 500));
    }
  });
});
