module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1',
    '^@spartan-ng/ui-input-helm$':
      '<rootDir>/src/app/shared/ui/ui-input-helm/src/index.ts',
    '^@spartan-ng/ui-button-helm$':
      '<rootDir>/src/app/shared/ui/ui-button-helm/src/index.ts',
    '^@spartan-ng/ui-label-helm$':
      '<rootDir>/src/app/shared/ui/ui-label-helm/src/index.ts',
    '^@spartan-ng/ui-icon-helm$':
      '<rootDir>/src/app/shared/ui/ui-icon-helm/src/index.ts',
    '^@spartan-ng/ui-card-helm$':
      '<rootDir>/src/app/shared/ui/ui-card-helm/src/index.ts',
    '^@spartan-ng/ui-sheet-helm$':
      '<rootDir>/src/app/shared/ui/ui-sheet-helm/src/index.ts',
    '^@spartan-ng/ui-menu-helm$':
      '<rootDir>/src/app/shared/ui/ui-menu-helm/src/index.ts',
    '^@spartan-ng/ui-sonner-helm$':
      '<rootDir>/src/app/shared/ui/ui-sonner-helm/src/index.ts',
    '^@spartan-ng/ui-tabs-helm$':
      '<rootDir>/src/app/shared/ui/ui-tabs-helm/src/index.ts',
    '^@spartan-ng/ui-pagination-helm$':
      '<rootDir>/src/app/shared/ui/ui-pagination-helm/src/index.ts',
    '^@spartan-ng/ui-select-helm$':
      '<rootDir>/src/app/shared/ui/ui-select-helm/src/index.ts',
    '^@prisma/client$': '<rootDir>/../server/node_modules/@prisma/client',
  },
};
