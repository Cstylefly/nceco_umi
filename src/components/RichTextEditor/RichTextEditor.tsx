/**
 * @description 富文本编辑器
 * @author tangcong
 * @date 2023/05/31
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BraftEditor, {
  EditorState,
  ControlType,
  ExtendControlType,
  ImageControlType,
  HooksType,
} from 'braft-editor';
// @ts-ignore
// 官方没提供 @types/braft-utils
import { ContentUtils } from 'braft-utils';
import { useMount } from 'ahooks';
import { Upload } from 'antd';
import { PictureOutlined, StrikethroughOutlined } from '@ant-design/icons';
import 'braft-editor/dist/index.css';
import './editor.less';

export type RichTextEditorProps = {
  //默认值
  value?: EditorState;
  //额外添加的工具栏功能
  extraControls?: EditorState[];
  //工具栏指定不需要配置项
  excludeControls?: EditorState[];
  //内容区样式
  contentStyle?: React.CSSProperties;
  //自定义控件（组件自带了一个预览功能showPreview）
  extendControls?: ExtendControlType[]; //支持button、dropdown、modal和component四种类型
  placeholder?: string | any;
  //ctrl+s 触发
  onEditorSave?: (editorState: EditorState) => void;
  readonly?: boolean;
  imageControls?: ImageControlType[];
  //校验从本地选择的媒体文件
  validateMediaFn?: (file: File) => boolean;
  //工具栏各种功能触发时提供的方法（见https://www.yuque.com/braft-editor/be/gz44tn#gug9gs）
  hookFn?: HooksType;
  onChange?: (editorState: EditorState) => void;
  showImgLoad: boolean;
};

const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  //编辑器内容
  const [editorState, setEditorState] = useState<EditorState>();
  //记录值
  const editorRef = useRef<EditorState>(null);

  //上传图片的组件
  const EditorUploadImage = useMemo(() => {
    return (
      <Upload
        accept={'image/*'}
        showUploadList={false}
        customRequest={(params) => {
          if (params?.file) {
            setEditorState(
              ContentUtils.insertMedias(editorRef.current, [
                {
                  type: 'IMAGE',
                  url: URL.createObjectURL(params.file as any),
                },
              ]),
            );
          }
        }}
      >
        <button
          className={'control-item button'}
          type={'button'}
          data-title={'图片上传'}
        >
          <PictureOutlined />
        </button>
      </Upload>
    );
  }, []);

  //默认工具栏配置（可不设置、输出的是原本的设置）
  const [defaultControls, setDefaultControls] = useState<ControlType[]>([
    'undo', //撤销
    'redo', //重做
    //自定义工具栏样式{key:string,title:string,text:React.ReactNode}
    {
      key: 'clear',
      title: '清空内容',
      text: '清空',
    },
    'separator', //分割线
    // 'font-family',//字体
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
    // 自定义一个图片上传功能
    // @ts-ignore
    props?.showImgLoad
      ? {
          key: 'image-upload',
          type: 'component',
          component: EditorUploadImage,
        }
      : '',
    'link', //链接
    'separator',
    'separator',
    'fullscreen', //全屏
  ]);

  //初始化editorState
  useMount(() => {
    setEditorState(BraftEditor.createEditorState(props?.value));
    editorRef.current = BraftEditor.createEditorState(props?.value);
  });

  useEffect(() => {
    //设置最新的工具栏
    if ((props?.extraControls || []).length) {
      setDefaultControls([...defaultControls, ...(props?.extraControls || [])]);
    }
  }, [props?.extraControls]);

  const handleEditorChange = (editorState: EditorState) => {
    editorRef.current = editorState; //记录editor供预览组件使用，否则拿不到最新的值
    props?.onChange && props?.onChange(editorState);
    setEditorState(editorState);
  };

  return (
    // @ts-ignore
    <BraftEditor
      value={editorState}
      placeholder={props?.placeholder ?? '请输入'}
      contentStyle={props?.contentStyle ?? { minHeight: 200 }}
      readOnly={props?.readonly}
      controls={defaultControls}
      excludeControls={props?.excludeControls}
      extendControls={props?.extendControls}
      // media={{
      //   //上传功能（编辑器本身不带上传功能，需要通过uploadFn实现）
      //   uploadFn:handleUploadFn,
      //   validateFn:handleValidateFn,
      //   //支持的MIME类型
      //   accepts:{
      //     image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg'
      //   }
      // }}
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
