import { currentUserStore } from "src/stores/currentUser";
import { rgbToHex } from "./colorGenerator";

const AGDraculaTheme = function() {
  const currentUser = currentUserStore();
  return {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        background: '211E1E',
        token: '',
      },
      {
        foreground: '726d86',
        token: 'comment',
      },
      {
        foreground: '726d86',
        token: 'comment.block',
      },
      {
        foreground: 'ad9361',
        token: 'string',
      },
      {
        foreground: 'cccccc',
        token: 'constant.numeric',
      },
      {
        foreground: 'a1a1ff',
        token: 'keyword',
      },
      {
        foreground: '2f006e',
        token: 'meta.preprocessor',
      },
      {
        fontStyle: 'bold',
        token: 'keyword.control.import',
      },
      {
        foreground: 'a1a1ff',
        token: 'support.function',
      },
      {
        foreground: '0000ff',
        token: 'declaration.function function-result',
      },
      {
        fontStyle: 'bold',
        token: 'declaration.function function-name',
      },
      {
        fontStyle: 'bold',
        token: 'declaration.function argument-name',
      },
      {
        foreground: '0000ff',
        token: 'declaration.function function-arg-type',
      },
      {
        fontStyle: 'italic',
        token: 'declaration.function function-argument',
      },
      {
        fontStyle: 'underline',
        token: 'declaration.class class-name',
      },
      {
        fontStyle: 'italic underline',
        token: 'declaration.class class-inheritance',
      },
      {
        foreground: 'fff9f9',
        background: 'ff0000',
        fontStyle: 'bold',
        token: 'invalid',
      },
      {
        background: 'ffd0d0',
        token: 'invalid.deprecated.trailing-whitespace',
      },
      {
        fontStyle: 'italic',
        token: 'declaration.section section-name',
      },
      {
        foreground: 'c10006',
        token: 'string.interpolation',
      },
      {
        foreground: '666666',
        token: 'string.regexp',
      },
      {
        foreground: 'c1c144',
        token: 'variable',
      },

      {
        foreground: '6782d3',
        token: 'constant',
      },
      {
        foreground: 'afa472',
        token: 'constant.character',
      },
      {
        foreground: 'de8e30',
        fontStyle: 'bold',
        token: 'constant.language',
      },
      {
        fontStyle: 'underline',
        token: 'embedded',
      },
      {
        foreground: '858ef4',
        token: 'keyword.markup.element-name',
      },
      {
        foreground: '9b456f',
        token: 'keyword.markup.attribute-name',
      },
      {
        foreground: '9b456f',
        token: 'meta.attribute-with-value',
      },
      {
        foreground: 'c82255',
        fontStyle: 'bold',
        token: 'keyword.exception',
      },
      {
        foreground: '47b8d6',
        token: 'keyword.operator',
      },
      {
        foreground: '6969fa',
        fontStyle: 'bold',
        token: 'keyword.control',
      },
      {
        foreground: '68685b',
        token: 'meta.tag.preprocessor.xml',
      },
      {
        foreground: '888888',
        token: 'meta.tag.sgml.doctype',
      },
      {
        fontStyle: 'italic',
        token: 'string.quoted.docinfo.doctype.DTD',
      },
      {
        foreground: 'c6c4ff',
        token: 'comment.other.server-side-include.xhtml',
      },
      {
        foreground: 'c6c4ff',
        token: 'comment.other.server-side-include.html',
      },
      {
        foreground: '858ef4',
        token: 'text.html declaration.tag',
      },
      {
        foreground: '858ef4',
        token: 'text.html meta.tag',
      },
      {
        foreground: '858ef4',
        token: 'text.html entity.name.tag.xhtml',
      },
      {
        foreground: '9b456f',
        token: 'keyword.markup.attribute-name',
      },
      {
        foreground: '777777',
        token: 'keyword.other.phpdoc.php',
      },
      {
        foreground: 'c82255',
        token: 'keyword.other.include.php',
      },
      {
        foreground: 'de8e20',
        fontStyle: 'bold',
        token: 'support.constant.core.php',
      },
      {
        foreground: 'de8e10',
        fontStyle: 'bold',
        token: 'support.constant.std.php',
      },
      {
        foreground: 'b72e1d',
        token: 'variable.other.global.php',
      },
      {
        foreground: '00ff00',
        token: 'variable.other.global.safer.php',
      },

      {
        foreground: 'bfa36d',
        token: 'string.quoted.single.php',
      },
      {
        foreground: '6969fa',
        token: 'keyword.storage.php',
      },
      {
        foreground: 'ad9361',
        token: 'string.quoted.double.php',
      },
      {
        foreground: 'ec9e00',
        token: 'entity.other.attribute-name.id.css',
      },
      {
        foreground: 'b8cd06',
        fontStyle: 'bold',
        token: 'entity.name.tag.css',
      },
      {
        foreground: 'edca06',
        token: 'entity.other.attribute-name.class.css',
      },
      {
        foreground: '2e759c',
        token: 'entity.other.attribute-name.pseudo-class.css',
      },
      {
        foreground: 'ffffff',
        background: 'ff0000',
        token: 'invalid.bad-comma.css',
      },
      {
        foreground: '9b2e4d',
        token: 'support.constant.property-value.css',
      },
      {
        foreground: 'e1c96b',
        token: 'support.type.property-name.css',
      },
      {
        foreground: '666633',
        token: 'constant.other.rgb-value.css',
      },
      {
        foreground: '666633',
        token: 'support.constant.font-name.css',
      },
      {
        foreground: '7171f3',
        token: 'support.constant.tm-language-def',
      },
      {
        foreground: '7171f3',
        token: 'support.constant.name.tm-language-def',
      },
      {
        foreground: '6969fa',
        token: 'keyword.other.unit.css',
      },
    ],
    colors: {
      'editor.foreground': '#f8f8f2',
      'editor.background': '#282a36',
      'editor.selectionBackground': '#44475a',
      'editor.lineHighlightBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f0',
      'editorWhitespace.foreground': '#3B3A32',
      'editorIndentGuide.activeBackground': '#9D550FB0',
      'editor.selectionHighlightBorder': '#222218',
      'editorHoverWidget.background': '#282a36',
      'editorHoverWidget.border': rgbToHex(currentUser.theme.primary_color),
      'quickInput.background': '#282a36',
      'quickInput.foreground': '#fff',
      'quickInput.list.focusBackground': rgbToHex(currentUser.theme.primary_color),
      'quickInputTitle.background': rgbToHex(currentUser.theme.primary_color),
      'editorWidget.foreground': '#fff',
      'editorWidget.background': '#282a36',
      'menu.background': '#282a36',
      'editorLink.activeForeground': rgbToHex(currentUser.theme.primary_color),
      'textLink.foreground': rgbToHex(currentUser.theme.primary_color),
      'textLink.activeForeground': '#6574cf',
    },
  }
};

export { AGDraculaTheme };
