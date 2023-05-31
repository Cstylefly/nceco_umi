import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import styles from './login.less';
import { login } from '@/api/login/login';
import { message } from 'antd';

const Login: React.FC = () => {
  return (
    <div className={styles.box}>
      <div className={styles.FormBox}>
        <div className={styles.Top}>
          <div className={styles.FormTitle}>{'👏登录👏'}</div>
          <div className={styles.FormDivider} />
        </div>
        <div className={styles.Form}>
          <ProForm<{
            userName: string;
            password: string;
          }>
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                size: 'large',
                className: styles.FormButton,
              },
            }}
            onFinish={async (values) => {
              const res = await login(values);
              if (res.data?.status) {
                message.success('登录成功');
              }
            }}
            isKeyPressSubmit
          >
            <ProFormText
              width={'md'}
              name="userName"
              placeholder={'请输入用户名'}
              fieldProps={{
                size: 'large',
              }}
            />
            <ProFormText.Password
              width={'md'}
              name="password"
              placeholder={'请输入密码'}
              fieldProps={{
                size: 'large',
              }}
            />
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
