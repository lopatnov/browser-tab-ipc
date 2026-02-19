module.exports = {
  preset: './preset',
  roots: ['tests'],
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {tsconfig: './tsconfig.json'}],
  },
};
