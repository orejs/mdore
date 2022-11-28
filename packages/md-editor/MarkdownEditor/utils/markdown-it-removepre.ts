// 用来移除微信自定义代码前方的 pre code
export default (md: any) => {
  const oldFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens: any, idx: any, options: any, env: any, slf: any) => {
    const old = oldFence(tokens, idx, options, env, slf);
    const preReg = /<pre><code[\w\s-="]*>/;
    // 微信专属
    if (preReg.exec(old)) {
      const pre = preReg.exec(old)?.[0];
      const post = `</code></pre>`;
      return old.replace(pre, '').replace(post, '');
    }
    // 自定义
    else {
      return old;
    }
  };
};
