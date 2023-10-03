import { EffectCallback, useEffect, useState } from "react";

// 关于执行方法节流
export function Throttle(fn: Function){
    let key: any = null;
    return function(...arg: any){
        return new Promise(()=>{
            if( key ){
                clearTimeout(key);
            }
            key = setTimeout(()=>{
                fn && fn(...arg);
            }, 500)
        })
    }
}


// 接口执行最后一次请求
export function LastInterface(fn: Function){
    let time = new Date().getTime();
    return function(...arg: any){
        return new Promise((resolve: any)=>{
            time = new Date().getTime();
            const timeold = time;
            fn && fn(...arg).then((res: any)=>{
                if( timeold === time )
                    resolve(res);
            });
        })
    }
}
