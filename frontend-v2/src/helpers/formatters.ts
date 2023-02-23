import { formatDialect, postgresql } from 'sql-formatter';
const setSQLFormatter = function (monaco) {
  monaco.languages.registerDocumentFormattingEditProvider('sql', {
    provideDocumentFormattingEdits(model) {
      let content = model.getValue();
      const matches = content.match(/{{\W*.+?\W*}}/g);

      matches?.forEach((m) => {
        content = content.replaceAll(m, `/* ${m} */`);
      });

      const matchEEX = content.match(/<%={0,1}.+%>/gm);

      matchEEX?.forEach((m) => {
        content = content.replaceAll(m, `/* ${m} */`);
      });

      let formatted = formatDialect(content, {
        dialect: postgresql,
        keywordCase: 'upper',
      });
      matches?.forEach((m) => {
        formatted = formatted.replaceAll(`/* ${m} */`, m);
      });

      matchEEX?.forEach((m) => {
        formatted = formatted.replaceAll(`/* ${m} */`, m);
      });
      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });
};

export { setSQLFormatter };
