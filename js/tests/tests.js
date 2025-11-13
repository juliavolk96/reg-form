import { runUITests } from './ui.test.js';
import { runValidatorTests } from './validators.test.js';
import { runSecurityUtilsTests } from './securityUtils.test.js';
import { runFormControllerTests } from './formController.test.js';
import { runMainTests } from './main.test.js';

export function runTests(log) {
  console.log('Running tests...');
  runUITests(log);
  runValidatorTests(log);
  runSecurityUtilsTests(log);
  runFormControllerTests(log);
  runMainTests(log);
  console.log('All tests completed.');
}
