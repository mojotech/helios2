module.exports = {
  "parser": "babel-eslint",
  "extends": ["airbnb", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "react/jsx-indent": [0],
    "import/no-named-as-default": [0],
  },
  "env": {
    "browser": true,
  }
};
