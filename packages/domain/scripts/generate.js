const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
  // Example of generating a single file
  {
    option: 'Use Case',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './scripts/templates/',
    },
    stringReplacers: ['__UC__'],
    output: {
      path: './',
      pathAndFileNameDefaultCase: '(pascalCase)',
      overwrite: true,
    },
  },
]);
