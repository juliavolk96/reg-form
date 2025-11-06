export function validateName(value) {
  let userName = (value || '').trim();

  if (!userName) {
    return {valid:false, message: 'Please enter your name'};
  }
  if (userName.length < 2) {
    return {valid:false, message: 'Name must be at least 2 characters long'};
  }
  if (userName.length > 50) {
    return {valid:false, message: 'Name must be no more than 50 characters long'};
  }

  let regEx = /^[A-Za-zА-Яа-яЁё\-\'\s]+$/u;
  if (!regEx.test(userName)) {
    return {valid:false, message: 'Name contains invalid characters'};
  }
  return {valid:true, message: null};
}

export function validateEmail(value) {
  let email = (value || '').trim();

  if (!email) {
    return {valid:false, message: 'Please enter your email'};
  }

  let regEx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regEx.test(email)) {
    return {valid:false, message: 'Please enter a valid email address'};
  }
  return {valid:true, message: null};
}

export function validatePassword(value) {
  if (!value) {
    return {valid:false, message: 'Please enter your password'};
  }

  let regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regEx.test(value)) {
    return {valid:false, message: 'Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character'};
  }
  return {valid:true, message:null};
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return {valid:false, message: 'Please confirm your password'};
  }
  if (password !== confirmPassword) {
    return {valid:false, message: 'Passwords do not match'};
  }
  return {valid:true, message:null};
}

export function calculateAgeFromISO(isoDate) {
  if (!isoDate) {
    return null;
  }
  let birthDate = new Date(isoDate);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  let today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  let month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function validateBirthDay(isoDate, minAge = 18) {
  if (!isoDate) {
    return {valid:false, message: 'Please enter your birth date'};
  }

  let age = calculateAgeFromISO(isoDate);
  if (age === null) {
    return {valid:false, message: 'Please enter a valid date'};
  }
  if (age < minAge) {
    return {valid:false, message: `You must be at least ${minAge} years old`};
  }
  return {valid:true, message:null};
}
