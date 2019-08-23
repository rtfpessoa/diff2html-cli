module.exports = {
  'verbose': true,
  'preset': 'ts-jest',
  'testEnvironment': 'node',
  'coverageDirectory': './coverage',
  'coverageReporters': ['lcov', 'text', 'html'],
  'coverageThreshold': {
    'global': {
      'statements': 40,
      'branches': 15,
      'functions': 33,
      'lines': 40
    }
  }
};
