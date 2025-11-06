import * as validators from './validators.js';
import * as ui from './ui.js';

const fieldNames = ['first-name','last-name','email','password','password-confirm','birth-day'];

export function createFormState() {
  const values = {};
  const validity = {};
  const errors = {};
  fieldNames.forEach(name => {
    values[name] = '';
    validity[name] = false;
    errors[name] = null;
  });
  return { values, validity, errors, isFormValid: false, isSubmitting: false };
}

function updateFormValidity(formState, form) {
  formState.isFormValid = Object.values(formState.validity).every(Boolean);
  const submitButton = form.querySelector('[data-button]');
  if (formState.isFormValid) {
    form.classList.add('valid');
    form.classList.remove('invalid');
    if (submitButton) submitButton.disabled = false;
  } else {
    form.classList.remove('valid');
    form.classList.add('invalid');
    if (submitButton) submitButton.disabled = true;
  }
}

function validateField(fieldName, formState, form, showMessage = true) {
  let value = formState.values[fieldName];
  let res = { valid:false, message: 'This field is required' };

  switch(fieldName) {
    case 'first-name':
    case 'last-name':
      res = validators.validateName(value);
      break;
    case 'email':
      res = validators.validateEmail(value);
      break;
    case 'password':
      res = validators.validatePassword(value);
      break;
    case 'password-confirm':
      res = validators.validateConfirmPassword(formState.values['password'], value);
      break;
    case 'birth-day':
      res = validators.validateBirthDay(value, 18);
      break;
    default:
      res = { valid:false, message: 'Unknown field' };
  }

  formState.validity[fieldName] = res.valid;
  formState.errors[fieldName] = res.message;

  const inputElement = form.querySelector(`[data-field="${fieldName}"]`);
  if (!inputElement) return;

  if (res.valid) {
    ui.setFieldValid(inputElement);
    if (showMessage) ui.setErrorMessage(fieldName, form, '');
  } else {
    ui.setFieldInvalid(inputElement);
    if (showMessage) ui.setErrorMessage(fieldName, form, res.message);
  }

  if (fieldName === 'password') {
    const confirmField = 'password-confirm';
    const confirmEl = form.querySelector(`[data-field="${confirmField}"]`);
    if (confirmEl) {
      const confirmRes = validators.validateConfirmPassword(formState.values['password'], formState.values['password-confirm']);
      formState.validity[confirmField] = confirmRes.valid;
      formState.errors[confirmField] = confirmRes.message;

      if (confirmEl.classList.contains('valid') || confirmEl.classList.contains('invalid')) {
        if (confirmRes.valid) {
          ui.setFieldValid(confirmEl);
          ui.setErrorMessage(confirmField, form, '');
        } else {
          ui.setFieldInvalid(confirmEl);
          ui.setErrorMessage(confirmField, form, confirmRes.message);
        }
      }
    }
  }

  updateFormValidity(formState, form);
}

export function attachFormBehavior() {
  const forms = document.querySelectorAll('[data-form]');
  forms.forEach(form => {
    const formState = createFormState();

    fieldNames.forEach(name => {
      const input = form.querySelector(`[data-field="${name}"]`);
      if (!input) return;

      input.addEventListener('input', e => {
        formState.values[name] = e.target.value.trim();
        validateField(name, formState, form, false);
      }, { passive: true });

      input.addEventListener('blur', e => {
        formState.values[name] = e.target.value.trim();
        validateField(name, formState, form, true);
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      fieldNames.forEach(name => validateField(name, formState, form, true));

      if (!formState.isFormValid) {
        const firstInvalid = fieldNames.find(name => !formState.validity[name]);
        if (firstInvalid) {
          const el = form.querySelector(`[data-field="${firstInvalid}"]`);
          if (el) el.focus();
        }
        return;
      }

      try {
        formState.isSubmitting = true;
        const submitButton = form.querySelector('[data-button]');
        if (submitButton) submitButton.disabled = true;
        ui.setFormStatus('Submitting...', form);

        await new Promise(res => setTimeout(res, 900));

        ui.setFormStatus('Form submitted successfully!', form);

        form.reset();

        fieldNames.forEach(name => {
          formState.values[name] = '';
          formState.validity[name] = false;
          formState.errors[name] = null;
          const inputEl = form.querySelector(`[data-field="${name}"]`);
          if (inputEl) {
            ui.clearFieldState(inputEl);
            ui.setErrorMessage(name, form, '');
          }
        });

        updateFormValidity(formState, form);

      } catch (err) {
        ui.setFormStatus('An error occurred during submission. Try again.', form);
        const submitButton = form.querySelector('[data-button]');
        if (submitButton) submitButton.disabled = false;
      } finally {
        formState.isSubmitting = false;
      }
    });
  });
}
