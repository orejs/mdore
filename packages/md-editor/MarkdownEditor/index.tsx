import MdOreEditor from './Editor';
import { markdownParser } from './utils/helper';

export { CODE_THEME_ID, PREVIEW_ID, THEME_ID } from './constant';
export type { MarkdownEditorProps } from './store';
export { initMathJax } from './utils';
export { parseMarkdown, MdOreEditor };

function parseMarkdown(content = '') {
  return markdownParser.render(content);
}
