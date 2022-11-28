import { MJX_DATA_FORMULA, MJX_DATA_FORMULA_TYPE } from '../constant';

declare global {
  interface Window {
    MathJax: any;
  }
}

export const updateMathjax = () => {
  try {
    window.MathJax.texReset();
    window.MathJax.typesetClear();
    window.MathJax.typesetPromise();
  } catch (error) {}
};

export function initMathJax() {
  const addContainer = (math: any, doc: any) => {
    const tag = 'span';
    const spanClass = math.display
      ? 'span-block-equation'
      : 'span-inline-equation';
    const cls = math.display ? 'block-equation' : 'inline-equation';
    math.typesetRoot.className = cls;
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA, math.math);
    math.typesetRoot.setAttribute(MJX_DATA_FORMULA_TYPE, cls);
    math.typesetRoot = doc.adaptor.node(
      tag,
      { class: spanClass, style: 'cursor:pointer' },
      [math.typesetRoot],
    );
  };
  try {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        tags: 'ams',
      },
      svg: {
        fontCache: 'none',
      },
      options: {
        renderActions: {
          addMenu: [0, '', ''],
          addContainer: [
            190,
            (doc: any) => {
              for (const math of doc.math) {
                addContainer(math, doc);
              }
            },
            addContainer,
          ],
        },
      },
    };
    (function () {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      script.async = true;
      document.head.appendChild(script);
    })();
  } catch (e) {
    console.log(e);
  }
}
