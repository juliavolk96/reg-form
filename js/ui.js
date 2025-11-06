export function setFieldValid(element) {
  element.classList.remove('invalid');
  element.classList.add('valid');
  element.setAttribute('aria-invalid', 'false');
}

export function setFieldInvalid(element) {
  element.classList.remove('valid');
  element.classList.add('invalid');
  element.setAttribute('aria-invalid', 'true');
}

export function clearFieldState(element) {
  element.classList.remove('valid', 'invalid');
  element.setAttribute('aria-invalid', 'false');
}

export function setErrorMessage(fieldId, message) {
  const element = document.querySelector(`[data-error="${fieldId}"]`);
  if (!element) return;
  element.textContent = message || '';
}

export function setFormStatus(message) {
  const element = document.querySelector('[data-status]');
  if (!element) return;
  element.textContent = message || '';
  element.setAttribute('role', 'status');
}
