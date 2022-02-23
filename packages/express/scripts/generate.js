const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
    {
        option: 'Controller',
        defaultCase: '(pascalCase)',
        entry: {
            folderPath: './scripts/templates/controller',
        },
        stringReplacers: ['__Controller__', '__UC__'],
        output: {
            path: './',
            pathAndFileNameDefaultCase: '(pascalCase)',
            overwrite: true,
        },
    },
]);
