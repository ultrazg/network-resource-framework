// 事件处理器
export class Event {

    public fn: Array<Function> = [];

    on (fn: Function){
        this.fn.push(fn);
        return {
            // 解绑函数
            remove: this.off.bind(this, fn)
        }
    }

    emit (...arg: any){
        this.fn.forEach((e)=>{ return e(...arg); });
    }

    off (fn?: Function){
        if( fn === undefined ){
            this.fn = [];    
        }else {
            this.fn.splice(this.fn.indexOf(fn), 1);
        }
    }

}

window.Event = Event;

// 全局得订阅者广播器
export class Eventer {

    public id: string;

    public $event: Array<{ name: string, fn: Function }> = [];

    constructor (id: string){
        this.id = id;
        Eventer.Maps.push(this);
    }

    $on (name: string, fn: Function){
        this.$event.push({ name, fn });
    }

    $emit (name: string, ...arg: Array<any>){
        const e = this.$event.find((e)=>{ return e.name === name });
        return e && e.fn(...arg);
    }

    $off (name?: string){
        if( name == undefined ){
            this.$event = [];
        }else {
            let i = -1;
            const e = this.$event.find((e, ind)=>{ i = ind; return e.name === name });
            e && this.$event.splice(i, 1);
        }
    }

    static Maps: Array<Eventer> = [];

    static create (id: string){
        return new this(id);
    }

    static $getEmit(EventerId: string ,name: string, ...arg: Array<any>){
        const eventer = this.Maps.find((e)=>{ return e.id === EventerId });
        return eventer?.$emit(name, ...arg);
    }

    static $emit (name: string, ...arg: Array<any>){
        return this.Maps.map((evnter)=>{ return evnter.$emit(name, ...arg) });
    }

}

window.Eventer = Eventer;
