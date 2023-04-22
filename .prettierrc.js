module.exports = {
  printWidth: 100,

  overrides: [
    {
      files: '*.(js|ts)',
      options: {
        tabWidth: 2,
        singleQuote: true,
        quoteProps: 'consistent',
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
