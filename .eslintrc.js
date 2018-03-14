module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: ['react', 'import'],
  rules: {
    strict: 0,
    'react/jsx-filename-extension': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'no-unused-vars': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-undef': 0,
    'arrow-body-style': 0,
    'no-return-assign': 0,
    'react/prefer-stateless-function': 0
  },
};
