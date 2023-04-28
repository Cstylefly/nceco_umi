import { request } from 'umi'

export type ResponseType<T = any> = {
    data:T, // data的类型不固定，只在调用的时候确定类型
    code?:string,
    message?:string,
    status?:boolean,
    [key:string]:any
}



//服务器返回状态码
const respone_code = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}


/**
 * todo 最初版
 * HTTP request
 * GET
 * @param url 请求地址
 * @param params 参数
 */
export async function get<T>(url:string,params:any = {}):Promise<ResponseType<T>>{
    //处理get请求的参数
    const append_params = Object.entries(params).map(([key,value]) => `${key}=${value}`).join('&');
    return request(`${url}${url.includes('?') ? '&':'?'}${append_params}`,{
        method:'GET',
        headers:{},
        getResponse:true
    })
}

/**
 * todo 最初版
 * HTTP request
 * POST
 * @param url 请求地址
 * @param params 参数
 */
export async function post<T>(url:string,data:any):Promise<ResponseType<T>>{
    return request(url,{
        method:'POST',
        data,
        getResponse:true
    })
}

/**
 * todo 最初版
 * HTTP request
 * DELETE
 * @param url 请求地址
 * @param params 参数
 */
export async function del<T>(url:string,data:any):Promise<ResponseType<T>>{
    return request(url,{
        method:'DELETE',
        data,
        getResponse:true
    })
}