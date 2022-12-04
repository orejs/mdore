function makeRule(md: any) {
  return function replaceListItem() {
    md.renderer.rules.list_item_open = function replaceOpen() {
      return '<li><section>';
    };
    md.renderer.rules.list_item_close = function replaceClose() {
      return '</section></li>';
    };
  };
}

export default (md: any) => {
  md.core.ruler.push('replace-li', makeRule(md));
};
