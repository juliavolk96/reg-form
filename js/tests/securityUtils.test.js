import { safeCompare } from '../securityUtils.js';

export function runSecurityUtilsTests(logTest) {
  logTest('SecurityUtils', 'equal strings', safeCompare('abc', 'abc'), true);
  logTest('SecurityUtils', 'different strings', safeCompare('abc', 'abd'), false);
  logTest('SecurityUtils', 'different lengths', safeCompare('abc', 'abcd'), false);
  logTest('SecurityUtils', 'empty strings', safeCompare('', ''), true);
  logTest('SecurityUtils', 'one undefined', safeCompare(undefined, 'abc'), false);
  logTest('SecurityUtils', 'both undefined', safeCompare(undefined, undefined), true);
}
