import * as validators from './validators.js';
import * as ui from './ui.js';

const ids = ['first-name','last-name','email','password','password-confirm','birth-day'];

export const formState = {
  values: {
    'first-name': '',
    'last-name': '',
    'email': '',
    'password': '',
    'password-confirm': '',
    'birth-day': ''
  },
  validity: {
    'first-name': false,
    'last-name': false,
    'email': false,
    'password': false,
    'password-confirm': false,
    'birth-day': false
  },
  errors: {
    'first-name': null,
    'last-name': null,
    'email': null,
    'password': null,
    'password-confirm': null,
    'birth-day': null
  },
  isFormValid: false,
  isSubmitting: false
};

function updateFormValidity(){
  formState.isFormValid = Object.values(formState.validity).every(Boolean);
  const form = document.getElementById('registration-form');
  if(formState.isFormValid){
    form.classList.add('valid');
    form.classList.remove('invalid');
    document.getElementById('form-button').disabled = false;
  } else {
    form.classList.remove('valid');
    form.classList.add('invalid');
    document.getElementById('form-button').disabled = true;
  }
}

function validateField(id, showMessage = true){
  let value = formState.values[id];
  let res = { valid:false, message: 'This field is required' };

  switch(id) {
    case 'first-name':
      res = validators.validateName(value);
      break;
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

  formState.validity[id] = res.valid;
  formState.errors[id] = res.message;

  let inputElement = document.getElementById(id);
  if(res.valid) {
    ui.setFieldValid(inputElement);
    if(showMessage) {
    ui.setErrorMessage(id, '');
  }
  } else {
    ui.setFieldInvalid(inputElement);
    if(showMessage) {
      ui.setErrorMessage(id, res.message);
    }
  }

  if (id === 'password') {
    let confirmId = 'password-confirm';
    let confirmElement = document.getElementById(confirmId);
    let confirmRes = validators.validateConfirmPassword(formState.values['password'], formState.values['password-confirm']);
    formState.validity[confirmId] = confirmRes.valid;
    formState.errors[confirmId] = confirmRes.message;

    if(confirmElement.classList.contains('invalid') || confirmElement.classList.contains('valid')) {
      if(confirmRes.valid) {
        ui.setFieldValid(confirmElement);
        ui.setErrorMessage(confirmId, '');
      } else {
        ui.setFieldInvalid(confirmElement);
        ui.setErrorMessage(confirmId, confirmRes.message);
      }
    }
  }

  updateFormValidity();
}

export function attachFormBehavior() {
  const form = document.getElementById('registration-form');
  if (!form) {
    return;
  }

  ids.forEach((id) => {
    let element = document.getElementById(id);

    if(!element) {
      return;
    }

    element.addEventListener('input', (e) => {
      formState.values[id] = e.target.value;
      formState.values[id] = e.target.value.trim();
      validateField(id, false);
    }, { passive: true });

    element.addEventListener('blur', (e) => {
        formState.values[id] = e.target.value;
        formState.values[id] = e.target.value.trim();
        validateField(id, true);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    ids.forEach(id => validateField(id, true));
    if(!formState.isFormValid) {
      let firstInvalid = ids.find(id => !formState.validity[id]);
      if(firstInvalid) {
        document.getElementById(firstInvalid).focus();
      }
      return;
    }

    try {
      formState.isSubmitting = true;
      document.getElementById('form-button').disabled = true;
      ui.setFormStatus('Submitting...');

      await new Promise((res) => setTimeout(res, 900));

      ui.setFormStatus('Form submitted successfully!');

      form.reset();

      ids.forEach(id => {
        formState.values[id] = '';
        formState.validity[id] = false;
        formState.errors[id] = null;
        let element = document.getElementById(id);
        if(element) {
          ui.clearFieldState(element);
          ui.setErrorMessage(id, '');
        }
      });
      updateFormValidity();
    } catch(err) {
      ui.setFormStatus('An error occurred during submission. Try again.');
      document.getElementById('form-button').disabled = false;
    } finally {
      formState.isSubmitting = false;
    }
  });
}
