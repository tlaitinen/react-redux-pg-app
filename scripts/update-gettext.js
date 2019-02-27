const { 
	GettextExtractor, JsExtractors
} = require('gettext-extractor');

function extract(path) {

  const extractor = new GettextExtractor();

  extractor
    .createJsParser([
      JsExtractors.callExpression(['i18n.gettext', 'props.i18n.gettext'], {
        arguments: {
          text: 0,
          context: 1 
        }
      })
    ])
    .parseFilesGlob(`./src/${path}/**/*.@(ts|tsx)`);
  extractor.savePotFile(`./src/${path}/locale/templates/LC_MESSAGES/messages.pot`);
  extractor.printStats();
}
['frontend', 'backend'].forEach(extract);
