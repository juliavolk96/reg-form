import {
  setFieldValid,
  setFieldInvalid,
  clearFieldState,
  setErrorMessage,
  setFormStatus,
} from '../ui.js';

export function runUITests(logTest) {
  // setFieldValid
  {
    const input = document.createElement('input');
    input.classList.add('invalid');
    setFieldValid(input);

    const passed =
      input.classList.contains('valid') &&
      !input.classList.contains('invalid') &&
      input.getAttribute('aria-invalid') === 'false';

    logTest('UI', 'setFieldValid adds .valid, removes .invalid, sets aria-invalid=false', passed, true);
  }

  // setFieldInvalid
  {
    const input = document.createElement('input');
    input.classList.add('valid');
    setFieldInvalid(input);

    const passed =
      input.classList.contains('invalid') &&
      !input.classList.contains('valid') &&
      input.getAttribute('aria-invalid') === 'true';

    logTest('UI', 'setFieldInvalid adds .invalid, removes .valid, sets aria-invalid=true', passed, true);
  }

  // clearFieldState
  {
    const input = document.createElement('input');
    input.classList.add('valid', 'invalid');
    clearFieldState(input);

    const passed =
      !input.classList.contains('valid') &&
      !input.classList.contains('invalid') &&
      input.getAttribute('aria-invalid') === 'false';

    logTest('UI', 'clearFieldState removes classes and resets aria-invalid', passed, true);
  }

  // setErrorMessage
  {
    const div = document.createElement('div');
    div.dataset.error = 'email';
    document.body.appendChild(div);

    setErrorMessage('email', 'Error!');
    logTest('UI', 'setErrorMessage sets text', div.textContent, 'Error!');

    setErrorMessage('email', '');
    logTest('UI', 'setErrorMessage clears text', div.textContent, '');

    try {
      setErrorMessage('non-existing', 'Should not fail');
      logTest('UI', 'setErrorMessage handles missing element gracefully', true, true);
    } catch (e) {
      logTest('UI', 'setErrorMessage handles missing element gracefully', false, true);
    }
  }

  // setFormStatus
  {
    const statusDiv = document.createElement('div');
    statusDiv.dataset.status = '';
    document.body.appendChild(statusDiv);

    setFormStatus('Form submitted');
    const passed =
      statusDiv.textContent === 'Form submitted' &&
      statusDiv.getAttribute('role') === 'status';

    logTest('UI', 'setFormStatus sets text and adds role=status', passed, true);

    document.body.removeChild(statusDiv);
    try {
      setFormStatus('Should not fail');
      logTest('UI', 'setFormStatus handles missing element gracefully', true, true);
    } catch (e) {
      logTest('UI', 'setFormStatus handles missing element gracefully', false, true);
    }
  }
}
