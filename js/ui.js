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
  let element = document.querySelector(`[data-error="${fieldId}"]`);
  if (!element) return;
  element.textContent = message || '';
}

export function setFormStatus(message) {
  let element = document.querySelector('[data-status]');
  if (!element) return;
  element.textContent = message || '';
}
