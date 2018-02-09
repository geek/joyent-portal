module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['ui-toolkit', 'icons', 'my-joy-beta', 'navigation', 'bundle', 'images']
    ]
  }
};
