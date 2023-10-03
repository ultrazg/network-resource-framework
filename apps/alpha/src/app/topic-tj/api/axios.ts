import { getAction, postAction } from '@alpha/utils/http';

// 全局开关 要是想要关闭全局缓存 设置这个参数就好了
let key = false;


interface CecheData {
    url: string,
    key: string
}

// 对于加载的数据进行缓存
class Ceche {

    public datas: Array<CecheData> = [];

    // get (url: string, key: string){
    //     return 
    // }

}

function _getAction (url: string, param?: any, header?: any){
    return getAction(url, param, header).then((res: any)=>{
        return res;
    });
} 

function _postAction (url: string, param?: any, header?: any){
    return postAction(url, param, header);
}

export { getAction, postAction }