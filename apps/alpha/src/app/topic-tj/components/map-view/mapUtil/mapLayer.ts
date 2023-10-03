import png from "../../images/marker.png"
import labelBg from "../../images/labelBg.png"

import bg from "../../images/pointBg.png"
import tybg from "../../images/pointBg1.png"

import svg from "../../images/核心机房.svg"


export abstract class Renderer {

    public abstract layer: any;
    
    // constructor() {
    // }
    abstract render(view: any): void; // 必须在派生类中实现

}

// 打点渲染器类
export class RendererPoint extends Renderer {

    // 图层对象
    public layer: any;
    public labelLayer: any;

    // view对象
    public view: any;

    // 数据集
    public clickFn: Function = ()=>{
        // clickFn
    };

    // 最后一次时间戳
    public timerEnd: string = "";

    // 缩放
    public scalc: number = 1;

    public labelArray: Array<any> = []


    constructor (){

        super()

        // 初始化渲染
        this.layer = this.initLayer();
        this.labelLayer = this.initLabelLayer();

    }

    initLayer (){
        const widthWidth = window.innerWidth;
        const zoom = (widthWidth / 1920)
        const transform = 1 / (widthWidth / 1920)
        const scale = widthWidth > 1920 ? transform : ((widthWidth < 1400 ? 1 : zoom) / devicePixelRatio);
        return new window.mapvgl.IconLayer({
            // width: 100 / 4,
            // height: 153 / 4,
            offset: [0, -153 / 8],
            opacity: 1,
            icon: png,
            enablePicked: true, // 是否可以拾取
            selectedIndex: -1, // 选中项
            scale,
            // selectedColor: '#ff0000', // 选中项颜色
            autoSelect: false, // 根据鼠标位置来自动设置选中项
            onClick: (e: any, b: any) => { // 点击事件
                this.click(e.dataItem);
            }
        });
    }

    initLabelLayer (){
        return new window.mapvgl.TextLayer({
            width: 100 / 4,
            height: 153 / 4,
            enablePicked: true,
            autoSelect: true,
            offset: [0, -50],
            fontSize: 14,
            // selectedColor: '#f00', // 选中项颜色
            color: '#fff',
            padding: [5, 10],
            background: '#666',
            onClick: (e: any) => { // 点击事件
                this.click(e.dataItem);
            },
        });
    }

    render (view: any){
        view.addLayer(this.layer);
        view.addLayer(this.labelLayer);
    }

    // 将图片转化为canvasdom
    imgToCanvas (url: string, { width, height }: any){
        return new Promise((resovle)=>{



            const image = new Image();
            image.src = url || "./img/marker.png";

            image.onload = function(){
                // 
                const widthVal = width || image.height;
                const heightVal = height || image.height;
                var canvas = document.createElement("canvas");
                canvas.style.cssText=`width: ${widthVal}px;height: ${heightVal}px;`;
                canvas.width = widthVal;
                canvas.height = heightVal;
                var can2d = canvas.getContext("2d");
                can2d?.drawImage(image, 0, 0, image.width, image.height, 0, 0, widthVal, heightVal);

                resovle(canvas);
            }
        })
    }

    imgToCanvasBox (urls: string[], { width, height }: any){
        return new Promise((resolve)=>{
            Promise.all(urls.map((e)=>{ return this.imgToCanvas(e, { width, height }) })).then((canvas)=>{
                resolve(canvas);
            });
        })
    }

    addHtml (data: PointSetData[]){
        this.remove();
        this.labelArray = data.map((e: PointSetData)=>{
            let opts = {
                position: new BMapGL.Point(parseFloat(e.x), parseFloat(e.y)), // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(-16, -34), //设置文本偏移量(左右， 上下)
            };
            let iconLabel = new BMapGL.Label(e.icon, opts);
            iconLabel.setStyle({
                border: "none",
                padding: "0",
                color: "#fff",
                fontSize: "20px",
                height: e.width || "50px",
                width: e.height || "50px",
                backgroundColor: "rgba(255, 255, 255, 0)",
              });
            window.mapView.map.addOverlay(iconLabel);
            iconLabel.addEventListener("click",this.labelClick.bind(this));
            return { geometry: {
                type: 'Point',
                coordinates: [parseFloat(e.x), parseFloat(e.y)]
            }, attr: e.attr, overlay: iconLabel };
        });
    }

    labelClick (e: any){
        const dat = this.labelArray.find((e1)=>{ return e1.overlay === e.currentTarget });
        this.click(dat);
    }

    remove (){
        const a = this.labelArray;
        this.labelArray = [];
        a.forEach((label: any)=>{
            window.mapView.map.removeOverlay(label.overlay);
        })
    }

    add (data: PointSetData[]){
        // let icons = data.map((e)=>{ return e.icon }).filter((e)=>{ return e.indexOf("<") !== 0 });
        let icons = data.map((e)=>{ return e.icon });
        let setIcon = new Set(icons);
        icons = Array.from(setIcon);
        icons = icons.filter((e)=>{ return e !== undefined })
        const time = (new Date().getTime()).toString();
        this.timerEnd = time;
        this.imgToCanvasBox(icons, { width: data[0] && data[0].width, height: data[0] && data[0].height}).then((canvas: any)=>{
            if( this.timerEnd !== time ){
                return;
            }
            // const datas = data.filter((e)=>{ return e.icon.indexOf("<") !== 0 }).map((e: PointSetData)=>{
            const datas = data.map((e: PointSetData)=>{
                let properties: any = {};
                e.icon && (properties.icon = canvas[icons.indexOf(e.icon)]);
                e.text && (properties.text = e.text);
                e.width && (properties.width = (+e.width));
                e.height && (properties.height = (+e.height));

                // let opts = {
                //     position: new BMapGL.Point(parseFloat(e.x), parseFloat(e.y)), // 指定文本标注所在的地理位置
                //     offset: new BMapGL.Size(-16, -34), //设置文本偏移量(左右， 上下)
                // };
                // let iconLabel = new BMapGL.Label(`<svg class="icon" width="28px" height="26px" aria-hidden="true">
                //     <use xlink:href="#icon-sanzhongwangluoleixing"></use>
                // </svg>`, opts);
                // iconLabel.setStyle({
                //     border: "none",
                //     padding: "0",
                //     color: "#fff",
                //     fontSize: "16px",
                //     height: "28px",
                //     width: "26px",
                //     backgroundColor: "rgba(255, 255, 255, 0)",
                //   });
                // window.mapView.map.addOverlay(iconLabel);

                return {
                    geometry: {
                        type: 'Point',
                        coordinates: [e.x, e.y]
                    },
                    properties: properties,
    
                    attr: e.attr || {}
                }
            })

            this.layer.setData(datas);
            this.labelLayer.setData(datas);
        });

        // this.addHtml(data.filter((e)=>{ return e.icon.indexOf("<") === 0 }));
    }

    click (e: layerClickParams){
        this.clickFn(e);
    }

    clear (){
        this.add([])
    }

}

export class RendererLabel extends Renderer {
    // 图层对象
    public layer: any;

    public bglayer: any;

    public typelayer: any;

    // view对象
    public view: any;

    // 数据集
    public clickFn: Function = ()=>{
        // clickFn
    };

    public images: Array<any> | null = null;

    public labelArray:Array<any> = [];

    constructor (){
        super()

        // 初始化渲染
        this.layer = this.initLayer();
        // 显然背景
        this.bglayer = this.labelBgLayer();
        // 类型图层
        this.typelayer = this.typeLayer();

    }

    typeLayer (){
        return new window.mapvgl.IconLayer({
            height: 24,
            offset: [0, -55],
            opacity: 1,
            icon: labelBg,
            enablePicked: true, // 是否可以拾取
            selectedIndex: -1, // 选中项
            autoSelect: false, // 根据鼠标位置来自动设置选中项
            onClick: (e: any) => { // 点击事件
                this.click(e.dataItem);
            },
        });
    }

    labelBgLayer (){
        return new window.mapvgl.IconLayer({
            height: 28,
            offset: [0, -55],
            opacity: 1,
            icon: labelBg,
            enablePicked: true, // 是否可以拾取
            selectedIndex: -1, // 选中项
            autoSelect: false, // 根据鼠标位置来自动设置选中项
            onClick: (e: any) => { // 点击事件
                this.click(e.dataItem);
            },
        });
    }

    initLayer (){
        const widthWidth = window.innerWidth;
        const zoom = (widthWidth / 1920)
        const transform = 1 / (widthWidth / 1920)
        const scale = widthWidth > 1920 ? transform : ((widthWidth < 1400 ? 1 : zoom) / devicePixelRatio)
        return new window.mapvgl.LabelLayer({
            textAlign: 'center',
            textColor: '#fff',
            borderColor: '#020F3500',
            backgroundColor: '#020F3500',
            fontSize: 12,
            scale,
            // lineHeight: 16,
            collides: false, // 是否开启碰撞检测, 数量较多时建议打开 true
            enablePicked: false,
            autoSelect: true,
            offset: [0, -29],
            onClick: (e: any) => {
                // 点击事件
            },
        });
    }

    render (view: any){
        view.addLayer(this.bglayer);
        view.addLayer(this.typelayer);
        view.addLayer(this.layer);
    }

    add (data: PointSetData[]){
        this.remove();
        this.labelArray = data.map((e: PointSetData)=>{
            let opts = {
                position: new BMapGL.Point(parseFloat(e.x), parseFloat(e.y)), // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(-16, -34), //设置文本偏移量(左右， 上下)
            };
            let iconLabel = new BMapGL.Label(`<svg class="icon" width="28px" height="26px" aria-hidden="true">
                <use xlink:href="#icon-sanzhongwangluoleixing"></use>
            </svg>`, opts);
            iconLabel.setStyle({
                border: "none",
                padding: "0",
                color: "#fff",
                fontSize: "16px",
                height: "28px",
                width: "26px",
                backgroundColor: "rgba(255, 255, 255, 0)",
              });
            window.mapView.map.addOverlay(iconLabel);
            iconLabel.addEventListener("click",this.labelClick.bind(this));
            return { geometry: {
                type: 'Point',
                coordinates: [parseFloat(e.x), parseFloat(e.y)]
            }, attr: e.attr, overlay: iconLabel };
        });
    }

    labelClick (e: any){
        const dat = this.labelArray.find((e1)=>{ return e1.overlay === e.currentTarget });
        this.click(dat);
    }

    remove (){
        const a = this.labelArray;
        this.labelArray = [];
        a.forEach((label: any)=>{
            window.mapView.map.removeOverlay(label.overlay);
        })
    }

    add1 (data: LabelSetData[]){
        // this.textToDom("测试标题").then((canvas)=>{
            //

        this.getImage().then(([bg, tybg]: any)=>{
            const bgdatas = data.map((e: LabelSetData)=>{
                let properties: any = {};
                // if( e.typeText ){
                //     properties.width = e.text.length * 12 + 16 + e.typeText.length * 12 + 4 * 2;
                //     properties.offset = [(e.typeText.length * 12) , -55]
                // }else{
                //     properties.width = e.text.length * 12 + 16;
                // }
                properties.icon = this.getCanvas(e.text, e.typeText || "", bg, tybg);

                // properties.icon = "<div>测试dom</div>";
                return {
                    geometry: {
                        type: 'Point',
                        coordinates: [e.x, e.y]
                    },
                    properties
                }
            })
            this.bglayer.setData(bgdatas);

            // const datas = data.map((e: LabelSetData)=>{
            //     let properties: any = {};
            //     e.text && (properties.text = e.text);
            //     return {
            //         geometry: {
            //             type: 'Point',
            //             coordinates: [e.x, e.y]
            //         },
            //         properties
            //     }
            // })
            // this.layer.setData(datas);
        })
    }

    getImage (){
        return new Promise((resolve)=>{

            if( this.images ){
                resolve(this.images);
            }

            const image = new Image();
            image.src = bg
            image.onload = ()=>{
                const image1 = new Image();
                image1.src = tybg
                image1.onload = ()=>{
                    this.images = [image, image1];
                    resolve(this.images);
                }
            }
        })
    }

    getCanvas (title: string,type: string,image: any, image1: any){
        var canvas = document.createElement("canvas");
        const Can2d = canvas.getContext("2d");

        if( !Can2d ){ return; }

        // 标题文字
        // const title = "昆仑市接入机房2";
        const txy = Can2d?.measureText(title) || { width: 0 };

        // 类型名称
        // const type = "5月通";
        const tyxy = Can2d?.measureText(type) || { width: 0 };
 
        // 内边距
        const padding = 8;
        // 文字间隔
        const textMargin = 5;

        // 类型标题宽高
        let tyPadding = 8;
        let tyPadding1 = 2;
        let tyw = tyxy.width;
        let tyh = 12;
        if( type === "" ){
            tyPadding = 0;
            tyPadding1 = 0;
            tyw = tyxy.width;
            tyh = 12;    
        }

        // 整个bg的宽
        const tlw = txy?.width;
        const tlh = 12;

        canvas.width = padding * 2 + tyPadding * 2 + tyw + tlw + textMargin;
        canvas.height = tlh + padding * 2;

        // 绘制背景
        Can2d.drawImage(image, 0, 0, image.width, image.height, 0, 0, padding * 2 + tyPadding * 2 + tyw + tlw + textMargin, tlh + padding * 2);

        // 标记文字
        Can2d.fillStyle = "#ffffff"; 
        Can2d.textAlign = "center";
        Can2d.fillText(title, padding + tyPadding * 2 + tyw + tlw/2 + textMargin, tlh + padding - 2 );

        // 绘制类型
        Can2d?.drawImage(image1, 
          0, 0, image1.width, image1.height, 
          padding, padding - 2, tyw + tyPadding * 2, tyh + tyPadding1 * 2);

        Can2d.fillStyle = "#00FCFF"; 
        Can2d.textAlign = "center";
        Can2d.fillText(type, padding + tyPadding + tyw / 2 ,tlh + padding - 2);

        Can2d.strokeStyle="#004796"; //004796
        Can2d.moveTo(0 + 1,0 + 1);
        Can2d.lineTo(canvas.width - 1,0 + 1);
        Can2d.lineTo(canvas.width - 1,canvas.height -1);
        Can2d.lineTo(0 + 1,canvas.height - 1);
        Can2d.lineTo(0 + 1,0 + 1);
        Can2d.stroke();
        // document.body.appendChild(canvas);
        return canvas;
    }

    // 将文字转化为dom
    textToDom (text: string){

        return new Promise((resovle)=>{
            var a = document.createElement("div");
            a.style.cssText= `position: absolute;
            left: 100%;
            padding: 4px;
            border-radius: 0;
            font-size: 12px;
            font-family: PingFangSC,PingFangSC-Semibold,sans-serif;
            white-space: nowrap;
            font-weight: 600;
            text-align: left;
            color: #fff;
            line-height: 20px;
            background: linear-gradient(135deg,rgb(10 31 56/66%),rgb(6 44 69/94%));
            border: 1px solid;
            border-image: linear-gradient(229deg,rgb(30 84 137/60%) 2%,#273e67 48%,rgb(58 138 249/60%) 93%) 1 1;`
            a.innerText = text;
            document.body.appendChild(a);
            
            window.html2canvas(a).then((canvas: HTMLCanvasElement)=>{
                a.remove();
                resovle(canvas.toDataURL());
            })
        })
    }

    click (e: layerClickParams){
        this.clickFn(e);
    }

    clear (){
        // this.layer.clear()
        this.add([])
    }

}



// 图层原始数据
export interface layerClickParams  {
    geometry: {
        type: string,
        coordinates: Array<string>,
    },
    attr: any,
    properties: any
}


export interface Point {
    x: string | number,
    y: string | number
}

// 打点的数据集对象
export interface LabelSetData {
    x: string,
    y: string,
    text: string,
    typeText?: string,
    attr?: any,
    // [propName: string]:any
    textAlign: string,
    textColor: string,
    borderColor: string,
    backgroundColor: string,
    pickedTextColor?: string,
    pickedBorderColor?: string,
    pickedBackgroundColor?: string,
    padding:  any |[2, 5],
    borderRadius: number,
    fontSize: number,
    lineHeight: number,
    collides: boolean, // 是否开启碰撞检测, 数量较多时建议打开
    enablePicked: boolean,
    autoSelect: boolean,
    icon: string
    // onClick: e => {
    //     // 点击事件
    //     console.log('click', e);
    // },
}

// 打点的数据集对象
export interface LineSetData {
    points: Array<Array<string>>,
    icon?: string,
    width?: number,
    color?: string,
    style?: string,
    attr?: any,
    [propName: string]:any
}


export interface PointSetData {
    x: string,
    y: string,
    icon: string,
    text?: string,
    width?: string | number,
    height?: string | number,
    attr?: any,
    [propName: string]:any
}

// 打点渲染器数据集
export class RendererPointSetData {

    public datasArray: Array<PointSetData>;

    constructor (){

        // 初始化数据数组
        this.datasArray = [];
        
    }

}


// 线段渲染器
export class RendererLine extends Renderer {

    // 图层对象
    public layer: any;

    // view对象
    public view: any;

    // 数据集
    public clickFn: Function = ()=>{
        // clickFn
    };

    constructor (){

        super()

        // 初始化渲染
        this.layer = this.initLayer();

    }

    initLayer (){
        // return new window.mapvgl.LineRainbowLayer({
        return new window.mapvgl.LineLayer({
            width: 10,
            color: ['rgba(55, 71, 226, 1)'],
            style: 'solid',
            lineCap: "round",
            enablePicked: true,
            onClick: (e: any, b: any) => { // 点击事件
                // console.log('click', e);
                this.click(e.dataItem, b);
            },
        });
    }

    render (view: any){
        view.addLayer(this.layer);
    }

    add (data: LineSetData[]){
        this.layer.setData(data.map((e: LineSetData)=>{
            let properties: any = {};
            e.style && (properties.style = e.style);
            e.color && (properties.color = e.color);
            e.width && (properties.width = e.width);
            return {
                geometry: {
                    type: 'LineString',
                    coordinates: e.points
                },
                properties: properties,
                attr: e.attr || {}
            }
        }));
    }

    click (e: layerClickParams, b: any){
        this.clickFn(e, b);
    }

    clear (){
        this.add([]);
    }

}