import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  fastRefresh: {},
  theme: {
    'primary-color': '#5a847f',
  },
  mock: {},
  //DOM无法配置在.umirc文件中，所以可以在运行时（app.ts中）配置路由菜单
  layout: {
    // layout: 'mix',
    title: 'Nceco',
    locale: true, //是否开启国际化
    siderWidth: 200, //侧边栏的宽度
    navTheme: 'light', //左侧导航的主题为 浅色 主题
  },
  links: [
    { rel: 'icon', href: '/img/logo.jpeg' }, //修改项目浏览器左侧图标  umi的约定：“public 目录，此目录下所有文件会被 copy 到输出路径”  （注：还可以通过修改document.ejs文件里的link标签）
  ],
});
