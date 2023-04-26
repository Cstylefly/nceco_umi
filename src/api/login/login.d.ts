declare namespace API{
    //登录请求需要的参数类型定义
    type LoginItemType = {
        userName:string,
        password:string
    }
    //登录返回的data数据类型定义
    type LoginUserInfoType = {
        type:string,
        id:string,
        name:string,
        avatar?:string
    } & Pick<LoginItemType,'userName'>
}