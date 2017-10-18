module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'ui-toolkit',
        'my-joy-beta',
        'cloudapi-gql',
        'boilerplate',
        'create-instance'
      ]
    ]
  }
};
