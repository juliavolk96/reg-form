import * as ui from './ui.js';

export function createForm({ root, validators: fieldValidators, apiClient, minAge = 18 }) {
  const form = root;
  if (!form) throw new Error('Form element not provided');

  const state = {
    values: {},
    validity: {},
    errors: {},
    isFormValid: false,
    isSubmitting: false,
  };

  Object.keys(fieldValidators).forEach(field => {
    state.values[field] = '';
    state.validity[field] = false;
    state.errors[field] = null;
  });

  function validateField(fieldName) {
    const value = state.values[fieldName];
    const validator = fieldValidators[fieldName];
    if (!validator) return { valid: false, message: 'Unknown field' };

    const result = fieldName === 'birth-day' ? validator(value, minAge) : validator(value);
    state.validity[fieldName] = result.valid;
    state.errors[fieldName] = result.message;

    updateFieldUI(fieldName);

    if (fieldName === 'password' && 'password-confirm' in state.values && state.values['password-confirm']) {
      validateField('password-confirm');
    }

    updateFormValidityUI();
    return result;
  }

  function updateFieldUI(fieldName) {
    const input = form.querySelector(`[data-field="${fieldName}"]`);
    if (!input) return;

    const { valid, message } = { valid: state.validity[fieldName], message: state.errors[fieldName] };
    if (valid) ui.setFieldValid(input);
    else ui.setFieldInvalid(input);

    ui.setErrorMessage(fieldName, message);
  }

  function updateFormValidityUI() {
    state.isFormValid = Object.values(state.validity).every(Boolean);
    const submitButton = form.querySelector('[data-button]');
    if (submitButton) submitButton.disabled = !state.isFormValid;
    form.classList.toggle('valid', state.isFormValid);
    form.classList.toggle('invalid', !state.isFormValid);
  }

  function handleInput(e) {
    const fieldName = e.target.dataset.field;
    if (!fieldName || !(fieldName in state.values)) return;

    state.values[fieldName] = fieldName === 'password' ? e.target.value : e.target.value.trim();
    validateField(fieldName);
  }

  form.addEventListener('input', handleInput, { passive: true });
  form.addEventListener('blur', handleInput, true);

  async function handleSubmit(e) {
    e.preventDefault();
    Object.keys(state.values).forEach(validateField);

    if (!state.isFormValid) {
      const firstInvalid = Object.keys(state.validity).find(k => !state.validity[k]);
      const el = form.querySelector(`[data-field="${firstInvalid}"]`);
      if (el) el.focus();
      return;
    }

    try {
      state.isSubmitting = true;
      const submitButton = form.querySelector('[data-button]');
      if (submitButton) submitButton.disabled = true;

      ui.setFormStatus('Submitting...');

      if (typeof apiClient === 'function') {
        await apiClient({ ...state.values });
      } else {
        await new Promise(res => setTimeout(res, 900));
      }

      ui.setFormStatus('Form submitted successfully!');

      form.reset();
      Object.keys(state.values).forEach(field => {
        state.values[field] = '';
        state.validity[field] = false;
        state.errors[field] = null;
        const inputEl = form.querySelector(`[data-field="${field}"]`);
        if (inputEl) ui.clearFieldState(inputEl);
        ui.setErrorMessage(field, '');
      });

      updateFormValidityUI();
    } catch (err) {
      console.error('Form submission error:', err);
      ui.setFormStatus('An error occurred during submission. Try again.');
      const submitButton = form.querySelector('[data-button]');
      if (submitButton) submitButton.disabled = false;
    } finally {
      state.isSubmitting = false;
    }
  }

  form.addEventListener('submit', handleSubmit);

  return { state, validateField, submit: handleSubmit };
}
