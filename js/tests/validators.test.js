import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateBirthDay,
  calculateAgeFromISO,
} from '../validators.js';

export function runValidatorTests(logTest) {
  // validateName
  logTest('Validators', 'validateName - valid name', validateName('John'), { valid: true, message: null });
  logTest('Validators', 'validateName - empty name', validateName(''), { valid: false, message: 'Please enter your name' });
  logTest('Validators', 'validateName - too short name', validateName('J'), { valid: false, message: 'Name must be at least 2 characters long' });
  logTest('Validators', 'validateName - too long name', validateName('J'.repeat(60)), { valid: false, message: 'Name must be no more than 50 characters long' });
  logTest('Validators', 'validateName - invalid chars', validateName('John123'), { valid: false, message: 'Name contains invalid characters' });

  // validateEmail
  logTest('Validators', 'validateEmail - valid', validateEmail('user@example.com'), { valid: true, message: null });
  logTest('Validators', 'validateEmail - missing @', validateEmail('userexample.com'), { valid: false, message: 'Please enter a valid email address' });
  logTest('Validators', 'validateEmail - empty', validateEmail(''), { valid: false, message: 'Please enter your email' });

  // validatePassword
  logTest('Validators', 'validatePassword - valid', validatePassword('Abcdef1!'), { valid: true, message: null });
  logTest('Validators', 'validatePassword - missing digit', validatePassword('Abcdefg!'), { valid: false, message: 'Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character' });
  logTest('Validators', 'validatePassword - too short', validatePassword('Ab1!a'), { valid: false, message: 'Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character' });
  logTest('Validators', 'validatePassword - too long', validatePassword('A'.repeat(130)), { valid: false, message: 'Password is too long' });

  // validateConfirmPassword
  logTest('Validators', 'validateConfirmPassword - match', validateConfirmPassword('Abcdef1!', 'Abcdef1!'), { valid: true, message: null });
  logTest('Validators', 'validateConfirmPassword - mismatch', validateConfirmPassword('Abcdef1!', 'WrongPassword'), { valid: false, message: 'Passwords do not match' });
  logTest('Validators', 'validateConfirmPassword - empty', validateConfirmPassword('Abcdef1!', ''), { valid: false, message: 'Please confirm your password' });

  // calculateAgeFromISO
  const today = new Date();
  const adult = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  const invalid = 'invalid-date';
  logTest('Validators', 'calculateAgeFromISO - valid date', calculateAgeFromISO(adult) >= 25, true);
  logTest('Validators', 'calculateAgeFromISO - invalid date', calculateAgeFromISO(invalid), null);

  // validateBirthDay
  const minor = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()).toISOString().slice(0, 10);
  logTest('Validators', 'validateBirthDay - adult', validateBirthDay(adult, 18), { valid: true, message: null });
  logTest('Validators', 'validateBirthDay - minor', validateBirthDay(minor, 18), { valid: false, message: 'You must be at least 18 years old' });
  logTest('Validators', 'validateBirthDay - empty', validateBirthDay(''), { valid: false, message: 'Please enter your birth date' });
}
