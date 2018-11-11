module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:ante/recommended',
    'plugin:ante/style'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 6,
    sourceType: 'module'
  },
  plugins: [
    'eslint-plugin-ante'
  ],
  rules: {
    'id-blacklist': [
      'error',
      'e',
      'err',
      'evt',
      'req',
      'res',
      'arr'
    ],
    'no-magic-numbers': [
      'error',
      {
        ignore: [
          -1,
          0,
          1,
          2
        ]
      }
    ],
    'prefer-destructuring': [
      'off'
    ]
  }
};
