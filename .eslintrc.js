module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', 'import', 'graphql'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-indent': [0],
    'import/no-named-as-default': [0],
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJson: require('./app/javascript/schema.json'),
      },
    ],
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config/webpacker.yml',
      },
    },
  },
};
