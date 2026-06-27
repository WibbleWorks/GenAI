module.exports = {
  testDir: '.',
  fullyParallel: false,
  use: {
    browserName: 'chromium',
    headless: false,
    slowMo: 50,
    viewport: { width: 1280, height: 720 },
  },
};