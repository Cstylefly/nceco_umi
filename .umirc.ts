import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  theme:{
    'primary-color':'#5a847f'
  },
  mock:{},
  //DOM无法配置在.umirc文件中，所以可以在运行时（app.ts中）配置路由菜单
  layout:{
    // layout: 'mix',
    name:'Nceco',
    locale:true, //是否开启国际化
    siderWidth: 200, //侧边栏的宽度
    navTheme:'light', //左侧导航的主题为 浅色 主题
  }
});
