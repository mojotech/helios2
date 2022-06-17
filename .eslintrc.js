module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', 'import', 'graphql', 'react-hooks', 'html'],
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
    'react/jsx-one-expression-per-line': [0],
    'react/destructuring-assignment': [0],
    'react-hooks/rules-of-hooks': 'error',
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
};
