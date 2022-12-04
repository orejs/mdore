import { SmileOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useMount, useUnmount } from 'ahooks';
import { Button, Result } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { PREVIEW_ID } from './constant';
import type { MarkdownEditorProps } from './store';
import { Store } from './store';
import { isPC } from './utils';

interface EditorProps {
  store: Store;
}

const MdEditor = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .md-editor-navbar {
    height: 30px;
    flex: none;
    position: relative;
    box-shadow: 0 4px 10px rgb(0 0 0 / 5%);
    z-index: 2;
    background: #fff;
  }
  .md-editor-left-nav,
  .md-editor-navbar {
    display: flex;
    align-items: center;
  }
  .md-editor-left-nav {
    flex: 1 1;
    justify-content: flex-start;
  }
  .md-editor-right-nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .md-editor-title {
    padding: 0 10px 0 20px;
    font-size: 16px;
  }
  .md-editor-article-title,
  .md-editor-title {
    font-weight: 700;
    font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light,
      PingFang SC, Cambria, Cochin, Georgia, Times, Times New Roman, serif;
  }
  .md-editor-text-container {
    display: flex;
    height: calc(100vh - 50px);
    width: 100%;
  }
  .md-editor-marked-text,
  .md-editor-md-editing,
  .md-editor-style-editing {
    position: relative;
    width: 33.3%;
    flex-grow: 1;
    word-wrap: break-word;
  }
  .md-editor-md-editing,
  .md-editor-style-editing {
    z-index: 1;
  }
  .md-editor-md-editing .CodeMirror {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .CodeMirror .cm-focused {
    outline: none !important;
  }
  .md-editor-marked-text {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  .md-editor-wx-box {
    overflow-y: auto;
    padding: 25px 20px;
    height: 100%;
    width: 375px;
    box-shadow: 0 0 60px rgb(0 0 0 / 10%);
  }

  .md-editor-footer-container {
    display: flex;
    justify-content: space-between;
    height: 20px;
    width: 100%;
    padding: 0 10px;
  }
  .md-editor-footer-left-container {
    display: flex;
    align-items: center;
    background: #fff;
    font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light,
      PingFang SC, Cambria, Cochin, Georgia, Times, Times New Roman, serif;
  }
  .md-editor-footer-left-container > div {
    font-size: 12px;
    margin: 0;
    padding: 0 10px;
  }
  .md-editor-footer-right-container {
    display: flex;
    align-items: center;
  }
`;

const Editor = observer<EditorProps>(({ store }) => {
  const editor = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const { title, parseHtml, lineCount, wordCount, publishLoading, onPublish } =
    store;
  useMount(() => store.mount(editor.current!, preview.current!));
  useUnmount(() => store.unmount());

  return (
    <MdEditor>
      <div className="md-editor-navbar">
        <div className="md-editor-left-nav">
          <section className="md-editor-title">{title}</section>
        </div>
        <div className="md-editor-right-nav">
          <Button loading={publishLoading} type="primary" onClick={onPublish}>
            发布
          </Button>
        </div>
      </div>
      <div className="md-editor-text-container">
        <div className="md-editor-md-editor">
          <div ref={editor} className="CodeMirror" />
        </div>

        <div className="md-editor-rich-text">
          <div className="md-editor-wx-box" ref={preview}>
            <section
              id={PREVIEW_ID}
              data-tool="mdBore编辑器"
              data-website="https://b.ore.work"
              dangerouslySetInnerHTML={{
                __html: parseHtml,
              }}
            />
          </div>
        </div>
      </div>
      <div className="md-editor-footer-container">
        <div className="md-editor-footer-left-container">
          <div>
            行数：
            {lineCount}
          </div>
          <div>
            字数：
            {wordCount}
          </div>
          <div>主题：全栈蓝</div>
        </div>
        <div className="md-editor-footer-right-container"></div>
      </div>
    </MdEditor>
  );
});

function MarkdownEditor(props: MarkdownEditorProps) {
  console.log('MarkdownEditor555');
  
  if (isPC()) return <Editor store={new Store(props)} />;
  return (
    <Result
      icon={<SmileOutlined />}
      title="请使用 PC 端打开排版工具"
      subTitle="更多 Markdown Nice 信息，请扫码关注公众号「编程如画」"
    />
  );
}

export default MarkdownEditor;
