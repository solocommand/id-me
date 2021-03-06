const tokenService = require('@base-cms/id-me-token-client');
const { createError } = require('micro');
const { createRequiredParamError } = require('@base-cms/micro').service;
const findByEmail = require('./find-by-email');

module.exports = async ({ token } = {}) => {
  if (!token) throw createRequiredParamError('token');

  const { aud: email, jti } = await tokenService.request('verify', { sub: 'user-login-link', token });
  if (!email) throw createError(400, 'No email address was provided in the token payload');

  const user = await findByEmail({ email, fields: ['id', 'email'] });
  if (!user) throw createError(404, `No user was found for '${email}'`);

  // Create the authenticated token.
  const { token: authToken } = await tokenService.request('create', {
    sub: 'user-auth',
    payload: { aud: user.email },
  });

  // Invalidate the login link token.
  tokenService.request('invalidate', { jti });

  return { ...user.toObject(), authToken };
};
