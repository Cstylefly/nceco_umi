/**
 * @author tangcong
 * @date 2023/06/01
 */
import React from 'react';
import { ProFormItem, ProFormItemProps } from '@ant-design/pro-form';
import RichTextEditor, {
  RichTextEditorProps,
} from '@/components/RichTextEditor/RichTextEditor';
import {
  ExtendsProps,
  ProFormFieldItemProps,
  ProFormGridConfig,
} from '@ant-design/pro-form/es/typing';

export type ProFormRichTextEditorProps = {
  richTextEditorProps: RichTextEditorProps;
} & ProFormFieldItemProps &
  Omit<ProFormItemProps, 'valueType'> &
  Pick<ProFormGridConfig, 'colProps'> &
  ExtendsProps;

//将RichTextEditor设置成表单项
const ProFormRichTextEditor: React.FC<ProFormRichTextEditorProps> = (props) => {
  const { richTextEditorProps, ...formProps } = props;
  return (
    <ProFormItem {...formProps}>
      <RichTextEditor {...richTextEditorProps} {...formProps} />
    </ProFormItem>
  );
};

export default React.memo(ProFormRichTextEditor);
