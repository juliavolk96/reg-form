import { clearFieldState } from "./ui.js";

export function setFieldValid(element) {
  element.classList.remove('invalid');
  element.classList.add('valid');
}

export function setFieldInvalid(element) {
  element.classList.remove('valid');
  element.classList.add('invalid');
}

export function clearFieldState(element) {
  element.classList.remove('valid');
  element.classList.remove('invalid');
}

export function setErrorMessage(fieldId, message) {
  let element = document.getElementById(fieldId + '-error');
  if (!element) return;
  element.textContent = message || '';
}

export function setFormStatus(message) {
  let element = document.getElementById('form-status');
  if (!element) return;
  element.textContent = message || '';
}
