/**
 * @description 富文本编辑器
 * @author tangcong
 * @date 2023/05/31
 */
import React, { useEffect, useRef, useState } from 'react';
import BraftEditor, {
  EditorState,
  ControlType,
  ExtendControlType,
  ImageControlType,
  HooksType,
} from 'braft-editor';
import { useMount } from 'ahooks';
import { StrikethroughOutlined } from '@ant-design/icons';
import './editor.less';

export type RichTextEditorProps = {
  //默认值
  defaultValue?: string | any;
  //工具栏
  controls?: EditorState[];
  //工具栏指定不需要配置项
  excludeControls?: EditorState[];
  //内容区样式
  contentStyle?: React.CSSProperties;
  //自定义控件（组件自带了一个预览功能showPreview、其余扩展功能抛出给用户自控）
  extendControls?: ExtendControlType[]; //支持button、dropdown、modal和component四种类型
  placeholder?: string;
  //ctrl+s 触发
  onEditorSave?: (editorState: EditorState) => void;
  readOnly?: boolean;
  imageControls?: ImageControlType[];
  //校验从本地选择的媒体文件
  validateMediaFn?: (file: File) => boolean;
  //工具栏各种功能触发时提供的方法（见https://www.yuque.com/braft-editor/be/gz44tn#gug9gs）
  hookFn?: HooksType;
  //是否添加预览功能
  showPreview?: boolean;
};

export type UploadValidateParamsType = {
  file: File;
  progress: (progress: number) => void;
  libraryId: string;
  success: (res: {
    url: string;
    meta: {
      id: string;
      title: string;
      alt: string;
      loop: boolean;
      autoPlay: boolean;
      controls: boolean;
      poster: string;
    };
  }) => void;
  error: (err: { msg: string }) => void;
};

//集成antd组件方法（暂时不抛出、后续要扩展按照此方法设置）
// const extendControls = [
//   {
//     key: 'antd-uploader',
//     type: 'component',
//     component: (
//       <Upload
//         accept="image/*"
//         showUploadList={false}
//         customRequest={this.uploadHandler}
//       >
//         {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
//         {/*<button type="button" className="control-item button upload-button" data-title="插入图片">*/}
//         {/*  <Icon type="picture" theme="filled" />*/}
//         {/*</button>*/}
//       </Upload>
//     )
//   }
// ]

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  //默认工具栏配置（可不设置、输出的是原本的设置）
  const defaultControls: ControlType[] = [
    'undo', //撤销
    'redo', //重做
    //自定义工具栏样式{key:string,title:string,text:React.ReactNode}
    {
      key: 'clear',
      title: '清空内容',
      text: '清空',
    },
    'separator', //分割线
    'font-family', //字体
    'headings', //标题
    'font-size', //字号
    'separator',
    'bold', //加粗
    'italic', //斜体
    'underline', //下划线
    {
      key: 'strike-through',
      title: '删除线',
      text: <StrikethroughOutlined />,
    },
    'separator',
    'text-color', //文字颜色&文字背景色
    'separator',
    'text-indent', //缩进
    'text-align', //文字对齐
    'list-ul', //无序列表
    'list-ol', //有序列表
    'separator',
    'superscript', //上标
    'subscript', //下标
    'remove-styles', //清楚样式
    'blockquote', //引用
    'code', //代码快
    'hr', //水平线
    'separator',
    'emoji', //表情
    'media', //媒体资源
    'link', //链接
    'separator',
    'fullscreen', //全屏
  ];
  //编辑器内容
  const [editorState, setEditorState] = useState<EditorState>();
  //记录值
  const editorRef = useRef<EditorState>(null);
  //工具栏
  const [controls] = useState<ControlType[]>(defaultControls);
  //扩展功能
  const [finallyExtendControls, setFinallyExtendControls] = useState<
    ExtendControlType[]
  >([]);
  //预览窗口
  const previewWindowRef = useRef<Window | null>(null);
  //----------预览功能----------
  const preview = () => {
    if (previewWindowRef.current) {
      previewWindowRef.current?.close();
    }
    previewWindowRef.current = window.open();
    previewWindowRef.current?.document.write(buildPreViewHtml());
    previewWindowRef.current?.document.close();
  };
  //todo
  const buildPreViewHtml = () => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${editorRef.current?.toHTML()}</div>
        </body>
      </html>
    `;
  };
  const [preViewExtendControls] = useState<ExtendControlType[]>([
    {
      key: 'custom-button',
      type: 'button',
      text: '预览',
      onClick: preview,
    },
  ]);
  //----------预览功能----------

  //初始化editorState
  useMount(() => {
    setEditorState(BraftEditor.createEditorState(props?.defaultValue));
  });

  useEffect(() => {
    if (props?.showPreview) {
      props?.extendControls?.length
        ? setFinallyExtendControls([
            ...preViewExtendControls,
            ...props?.extendControls,
          ])
        : setFinallyExtendControls(preViewExtendControls);
    } else {
      setFinallyExtendControls(props?.extendControls || []);
    }
  }, [props?.showPreview]);

  const handleEditorChange = (editorState: EditorState) => {
    editorRef.current = editorState; //记录editor供预览组件使用，否则拿不到最新的值
    setEditorState(editorState);
  };

  //自定义上传媒体文件的方法（若定义改方法需要进行媒体资源的上传操作；若不定义图片会转换为base64、视频源会失效）
  const handleUploadFn = (params: UploadValidateParamsType) => {
    console.log(params, '---params---');
  };

  //自定义上传文件的校验方法
  const handleValidateFn = async (file: File) => {
    if (props?.validateMediaFn) {
      return props?.validateMediaFn(file);
    }
    return true;
  };

  return (
    // @ts-ignore
    <BraftEditor
      value={editorState}
      // defaultValue={props?.defaultValue}
      placeholder={props?.placeholder ?? '请输入'}
      contentStyle={props?.contentStyle ?? { minHeight: 400 }}
      readOnly={props?.readOnly}
      controls={props?.controls ?? controls}
      excludeControls={props?.excludeControls}
      extendControls={finallyExtendControls}
      media={{
        //上传功能（编辑器本身不带上传功能，需要通过uploadFn实现）
        uploadFn: handleUploadFn,
        validateFn: handleValidateFn,
        //支持的MIME类型
        accepts: {
          image:
            'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
          video: 'video/mp4,video/webm,video/ogg', //默认只支持 video/mp4格式
          audio: 'audio/mp3,audio/ogg,audio/mpeg', //默认只支持 audio/mp3格式
        },
      }}
      hooks={{ ...props.hookFn }}
      imageControls={props?.imageControls}
      onChange={handleEditorChange}
      onSave={() => {
        props?.onEditorSave && props.onEditorSave(editorState);
      }}
    />
  );
};

export default React.memo(RichTextEditor);
