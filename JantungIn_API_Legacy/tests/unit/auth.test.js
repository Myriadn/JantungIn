'use strict';

const { generateToken, verifyToken } = require('../../src/utils/jwt');

describe('JWT Utils', () => {
  test('should generate a token', () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should verify a valid token', () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = generateToken(user);

    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });

  test('should throw error for invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow();
  });
});
