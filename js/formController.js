import * as validators from './validators.js';
import * as ui from './ui.js';

const fieldNames = ['first-name','last-name','email','password','password-confirm','birth-day'];

// Factory for creating form state
export function createFormState() {
  const state = {
    values: {},
    validity: {},
    errors: {},
    isFormValid: false,
    isSubmitting: false,
  };

  fieldNames.forEach(name => {
    state.values[name] = '';
    state.validity[name] = false;
    state.errors[name] = null;
  });

  return state;
}

/**
 * Validate a single field based on its name
 * Returns {valid, message}
 */
function validateFieldLogic(fieldName, formState) {
  const value = formState.values[fieldName];
  switch(fieldName) {
    case 'first-name':
    case 'last-name':
      return validators.validateName(value);
    case 'email':
      return validators.validateEmail(value);
    case 'password':
      return validators.validatePassword(value);
    case 'password-confirm':
      return validators.validateConfirmPassword(
        formState.values['password'],
        value
      );
    case 'birth-day':
      return validators.validateBirthDay(value, 18);
    default:
      return { valid: false, message: 'Unknown field' };
  }
}

// Update form validity and submit button state
function updateFormValidityUI(formState, form) {
  formState.isFormValid = Object.values(formState.validity).every(Boolean);
  const submitButton = form.querySelector('[data-button]');
  if (submitButton) submitButton.disabled = !formState.isFormValid;

  form.classList.toggle('valid', formState.isFormValid);
  form.classList.toggle('invalid', !formState.isFormValid);
}

// Apply validation to UI
function updateFieldUI(fieldName, formState, form) {
  const input = form.querySelector(`[data-field="${fieldName}"]`);
  if (!input) return;

  const { valid, message } = formState.errors[fieldName]
    ? { valid: formState.validity[fieldName], message: formState.errors[fieldName] }
    : { valid: true, message: '' };

  if (valid) {
    ui.setFieldValid(input);
    ui.setErrorMessage(fieldName, '');
  } else {
    ui.setFieldInvalid(input);
    ui.setErrorMessage(fieldName, message);
  }
}

// Main field validation function
function validateField(fieldName, formState, form) {
  const result = validateFieldLogic(fieldName, formState);

  formState.validity[fieldName] = result.valid;
  formState.errors[fieldName] = result.message;

  updateFieldUI(fieldName, formState, form);

  // Special case: if password changes, validate confirm password
  if (fieldName === 'password' && formState.values['password-confirm']) {
    validateField('password-confirm', formState, form);
  }

  updateFormValidityUI(formState, form);
}

// Attach form behavior: input, blur, submit
export function attachFormBehavior() {
  const forms = document.querySelectorAll('[data-form]');
  forms.forEach(form => {
    const formState = createFormState();

    // Attach listeners to each field
    fieldNames.forEach(name => {
      const input = form.querySelector(`[data-field="${name}"]`);
      if (!input) return;

      input.addEventListener('input', e => {
        formState.values[name] = e.target.value.trim();
        validateField(name, formState, form);
      }, { passive: true });

      input.addEventListener('blur', e => {
        formState.values[name] = e.target.value.trim();
        validateField(name, formState, form);
      });
    });

    // Submit handler
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validate all fields
      fieldNames.forEach(name => validateField(name, formState, form));

      if (!formState.isFormValid) {
        const firstInvalid = fieldNames.find(name => !formState.validity[name]);
        const el = form.querySelector(`[data-field="${firstInvalid}"]`);
        if (el) el.focus();
        return;
      }

      try {
        formState.isSubmitting = true;
        const submitButton = form.querySelector('[data-button]');
        if (submitButton) submitButton.disabled = true;

        ui.setFormStatus('Submitting...');

        // Fake async submit
        await new Promise(res => setTimeout(res, 900));

        ui.setFormStatus('Form submitted successfully!');

        // Reset form state
        form.reset();
        fieldNames.forEach(name => {
          formState.values[name] = '';
          formState.validity[name] = false;
          formState.errors[name] = null;
          const inputEl = form.querySelector(`[data-field="${name}"]`);
          if (inputEl) {
            ui.clearFieldState(inputEl);
            ui.setErrorMessage(name, '');
          }
        });

        updateFormValidityUI(formState, form);

      } catch (err) {
        console.error('Form submission error:', err);
        ui.setFormStatus('An error occurred during submission. Try again.');
        const submitButton = form.querySelector('[data-button]');
        if (submitButton) submitButton.disabled = false;
      } finally {
        formState.isSubmitting = false;
      }
    });
  });
}
