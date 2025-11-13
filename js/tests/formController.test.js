import { createForm, resetFormState } from '../formController.js';

function jestMock(name) {
  const fn = (...args) => fn.calls.push(args);
  fn.calls = [];
  return fn;
}

const mockUI = {
  setFieldValid: jestMock('setFieldValid'),
  setFieldInvalid: jestMock('setFieldInvalid'),
  setErrorMessage: jestMock('setErrorMessage'),
  setFormStatus: jestMock('setFormStatus'),
  clearFieldState: jestMock('clearFieldState'),
};

export async function runFormControllerTests(logTest) {
  const form = document.createElement('form');
  form.innerHTML = `
    <input data-field="name" />
    <input data-field="email" />
    <button data-button>Submit</button>
  `;
  document.body.appendChild(form);

  const validators = {
    name: value => ({ valid: value.trim().length >= 2, message: value ? null : 'Required' }),
    email: value => ({ valid: value.includes('@'), message: value.includes('@') ? null : 'Invalid email' }),
  };

  const { state, validateField, submit } = createForm({
    root: form,
    validators,
    apiClient: async () => Promise.resolve('ok'),
    ui: mockUI,
  });

  Object.values(mockUI).forEach(fn => fn.calls && (fn.calls = []));

  const nameInput = form.querySelector('[data-field="name"]');
  const emailInput = form.querySelector('[data-field="email"]');
  const submitButton = form.querySelector('[data-button]');

  logTest('FormController', 'initial values empty', state.values, { name: '', email: '' });
  logTest('FormController', 'initial validity false', Object.values(state.validity).every(v => v === false), true);

  state.values.name = '';
  validateField('name');
  logTest('FormController', 'empty name invalid', state.validity.name, false);

  state.values.name = 'John';
  validateField('name');
  logTest('FormController', 'valid name passes', state.validity.name, true);

  state.values.email = 'wrong.email';
  validateField('email');
  logTest('FormController', 'invalid email fails', state.validity.email, false);

  state.values.email = 'john@example.com';
  validateField('email');
  logTest('FormController', 'valid email passes', state.validity.email, true);

  logTest('FormController', 'submit enabled when form valid', submitButton.disabled, false);

  nameInput.value = 'A';
  nameInput.dispatchEvent(new Event('input', { bubbles: true }));
  logTest('FormController', 'handleInput updates state', state.values.name, 'A');

  state.values.name = 'John';
  state.values.email = 'john@example.com';
  Object.values(mockUI).forEach(fn => fn.calls && (fn.calls = []));

  const validSubmitEvent = new Event('submit', { bubbles: true });
  Object.defineProperty(validSubmitEvent, 'preventDefault', { value: () => {}, writable: false });

  await submit(validSubmitEvent);
  await new Promise(res => setTimeout(res, 0));
  logTest('FormController', 'submit triggers ui.setFormStatus', mockUI.setFormStatus.calls.length > 0, true);
  logTest('FormController', 'submit keeps button disabled while submitting', submitButton.disabled, true);

  resetFormState(state, form, mockUI);
  nameInput.value = '';
  emailInput.value = 'wrong';
  submitButton.disabled = false;
  Object.values(mockUI).forEach(fn => fn.calls && (fn.calls = []));

  const invalidSubmitEvent = new Event('submit', { bubbles: true });
  Object.defineProperty(invalidSubmitEvent, 'preventDefault', { value: () => {}, writable: false });

  await submit(invalidSubmitEvent);
  await new Promise(res => setTimeout(res, 0));

  logTest('FormController', 'invalid submit keeps button enabled', submitButton.disabled, false);

  logTest('FormController', 'ui.setErrorMessage called', mockUI.setErrorMessage.calls.length > 0, true);
  logTest('FormController', 'ui.setFieldValid or Invalid called', (mockUI.setFieldValid.calls.length + mockUI.setFieldInvalid.calls.length) > 0, true);

  document.body.removeChild(form);
}
