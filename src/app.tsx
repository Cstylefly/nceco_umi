import { history } from 'umi';
import styles from './app.less';
import Login from './pages/Login/Login';
type CurrentUser = {
  type: string;
};

const loginPath = '/login' // 登陆页路由

export async function getInitialState(): Promise<{
  currentUser: CurrentUser;
}> {
  return {
    currentUser: { type: 'admin' },
  };
}

export async function layout({initialState,setInitialState}:{initialState:any,setInitialState:any}) {
  return {
    menuDataRender: () => [
      {
        path: '/',
        name: 'Home',
      },
      {
        path:'/login',
        name:'Login',
        hiddenInMenuBar: true,
        layout:false,
        hideInMenu:true
      },
      {
        path: '/about',
        name: 'About',
        children: [
          { path: '/about/company', name: 'Company' },
          { path: '/about/investors', name: 'Investors' },
        ],
      },
    ],
    logo: () => {
      return (
        <img className={styles.logo_img} src={require('./imgs/logo1.png')} />
      );
    },
    footerRender: false,
    pageTitleRender:false, //修改浏览器左侧项目名显示样式为title而不是 title-pageName
    //rightContentRender：用于渲染头部右侧的节点，如用户头像，用户中心等。
    onPageChange:(location:{pathname?:string | undefined}) => {
      if(!initialState.currentUser?.userId){
        redirectLogin()
      }
    }
  };
}

//重定向到登陆页
const redirectLogin = () => {
  const {pathname,query} = history.location
  if(pathname === loginPath){
    history.replace({
      pathname:loginPath,
      query:{
        ...query
      }
    })
  }else{
    history.replace({
      pathname:loginPath,
      query:{
        redirect:query?.redirect || pathname,
        ...query
      }
    })
  }

}
