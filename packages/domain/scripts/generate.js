const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
  {
    option: 'Use Case',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './scripts/templates/usecases',
    },
    stringReplacers: ['__UC__'],
    output: {
      path: './',
      pathAndFileNameDefaultCase: '(pascalCase)',
      overwrite: true,
    },
  },
  {
    option: 'Entity',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './scripts/templates/entt',
    },
    stringReplacers: ['__entt__'],
    output: {
      path: './',
      pathAndFileNameDefaultCase: '(pascalCase)',
      overwrite: true,
    },
  }
]);
