import { get,post,del,ResponseType } from '@/utils/request/request'

//模拟登录接口
export const login = (data:APP.LoginItemType) => {
    return post<ResponseType<API.LoginUserInfoType>>('/api/login', data)
}