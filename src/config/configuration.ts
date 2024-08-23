export default () => ({
  hostUrl: process.env.HOST_URL || 'http://localhost:5000',
  bcrytSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  token: {
    expirationTime: parseInt(process.env.TOKEN_EXPIRATION_TIME) || 3600,
  },
});
