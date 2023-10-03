import { RendererPoint, PointSetData, Renderer, layerClickParams, RendererLine, LineSetData, Point, LabelSetData, RendererLabel } from "./mapLayer";
import { mapJson, setMapSelfStyle } from "./mapJson";
import { getAction } from '@alpha/utils/http';
import { fetchStatesCodeList } from '@alpha/app/topic-tj/api/apiJson';
import { Event } from "./event";
import { Throttle } from "./util";

// 根据省份获取对应地市列表
const provinceCityList: { [propsName: string]: any } = {};
export function getCityListByProvince (province: string){
    if( provinceCityList[province] ){
        return Promise.resolve(provinceCityList[province])
    }
    return fetchStatesCodeList().then(function(res: any){
        let ref: any[] = [];
        const provinceIndex = res.findIndex((resData: any) => resData.value === `${province}`)
        if(provinceIndex !== -1 && res[provinceIndex]['children']) {
            res[provinceIndex]['children'].forEach((childItem: any) => {
                ref.push({ name: childItem.text, value: childItem.value, code: childItem.value })
            })
            provinceCityList[province] = ref;
            return ref;
        }
        return null;
    })
}
// 根据省份获取对应地市列表
export function getCountyListByCity (code: string = "230000000000", regionId: string = "350002000000000042766827"){
    if( provinceCityList[regionId] ){
        return Promise.resolve(provinceCityList[regionId]);
    }
    return getAction('/oss/building/getRoomRegionDataByRegionID', { code, regionId }).then(function(res: any){
        if( res.code == 200 ){
            let ref = [];
            for( var i in res.data ){
                ref.push({ name: res.data[i], value: i, code: i })
            }
            provinceCityList[regionId] = ref;
            return ref;
        }
        return null;
    })
}



export interface MapObjectParams {
    center: Array<string>,
    zoom?: number,
    [propName: string]: any
}

const mapJsonPolygon: any = {};

interface VariableInterface {
    queryPoint: Array<{ polygon: any, attr: any, cityPolygon: null | Array<any> }>
}
const variable: VariableInterface = {
    queryPoint: []
}
interface Dataset {
    name: string,
    datas: Array<PointSetData>
}
interface DatasetList {
    name: string,
    datas: Array<LineSetData>
}
interface DataLabelset {
    name: string,
    datas: Array<LabelSetData>
}
interface ProvinceAreaConfig {
    color: string,
    opacity: number
}

// 地图封装对象
export class MapObject {

    public params: MapObjectParams;

    public view: any | null;

    public map: any | null;

    // 当前地图省份
    public province: string = "";

    // 点对象数据集
    public dataset: Array<Dataset> = [];

    // 线对象数据集
    public datasetList: Array<DatasetList> = []
    
    // Label 对象数据集
    public dataLabelset: Array<DataLabelset> = [];

    public pointLayer: RendererPoint | null;

    public lineLayer: RendererLine | null;

    public labelLayer: RendererLabel | null;

    
    // public mapBoundsChangeFn: Function = () => {};
    
    public provinceArea: any | null = null;
    
    // 打开是否自动标记选中的省份边界
    public isProvinceArea: boolean = true;
    
    public provinceAreaConfig: ProvinceAreaConfig = { color: "#2865BC", opacity: 0.2 }
    
    // 事件管理 变化事件
    public layerClickFn: Event = new Event();
    public mapBoundsChange: Event = new Event();
    // 地图点击事件
    public mapClick: Event = new Event();
    // 地图没有点击到物体的触发事件
    public mapClickNoBody: Event = new Event();
    public mapClickNoBodyObject: Array<any> = [];
    
    // 当前级别 1 省级  2 地市
    public mapLevel: number = 1;

    // timer
    public timer: Date = new Date();
    public centerFn: any = null;

    public boundsChangeEventListener: Function = ()=>{}

    // 构造函数
    constructor(id: string, params?: MapObjectParams) {

        

        this.params = params || {
            center: ["109.69384052522959", "34.121834304894705"],
            zoom: 5
        };

        // 初始化map对象
        this.map = this.initMap(id);

        // 初始化mapV视图
        this.view = this.initView();

        // 初始化线段显示
        this.lineLayer = this.initLineLayer()

        // 初始化
        this.pointLayer = this.initLayer();
        
        // 初始化Label
        this.labelLayer = this.initLabelLayerLayer();
    }

    // 初始化新建
    initMap(id: string) {
        let BMap = this.getBMapGL();
        const map = new BMap.Map(id, {
            minZoom: 4, // 地图缩放的最小层级
            maxZoom: 19, // 地图缩放的最大层级
            enableMapClick: false, //构造底图时，关闭底图可点功能（关闭默认地图POI事件）
        });

        let point = new BMap.Point(...this.params.center);
        // map.centerAndZoom(point, this.params.zoom);

        map.disableInertialDragging();
        map.enableScrollWheelZoom();

        // 离线地图 设置主体颜色
        map.setOptions({
            styleUrl: setMapSelfStyle().styleUrl,
            style: {
                styleJson: setMapSelfStyle().style.styleJson,
            },
        });

        this.boundsChangeEventListener = Throttle((e: any)=>{
            this.boundsChange();
        })

        map.addEventListener("zoomend", this.boundsChangeEventListener);

        map.addEventListener("dragend", this.boundsChangeEventListener);

        map.addEventListener("animation_start", this.animation_start);

        map.addEventListener("animation_end", this.animation_end);

        map.addEventListener('click', (e: any) => {
            this.mapClick.emit({
                ...e
            })
            setTimeout(()=>{
                if( this.mapClickNoBodyObject.length === 0 ){
                    this.mapClickNoBody.emit(this.mapClickNoBodyObject);
                    this.mapClickNoBodyObject = [];
                };
            })
        });

        return map;
    }

    animation_start (e: any){
        const map = e.currentTarget;
        // map.disableScrollWheelZoom();
        // map.disableDragging();
    }

    animation_end (e: any){
        const map = e.currentTarget;
        // map.enableScrollWheelZoom();
        // map.enableDragging();
    }

    destroyed (){
        if( !this.map ) return;
        this.map.off("zoomend", this.boundsChangeEventListener);
        this.map.off("dragend", this.boundsChangeEventListener);
        this.map.off("animation_start", this.animation_start);
        this.map.off("animation_end", this.animation_end);
        this.map.off("click");
        this.map.getOverlays().forEach((e: any)=>{ e.remove(); return this.map.removeOverlay(e) });
        this.map && this.map.destroy();

        this.pointLayer?.clear();
        this.pointLayer?.layer.destroy();
        this.lineLayer?.clear();
        this.lineLayer?.layer.destroy();

        // 清除掉地图移动事件
        this.mapBoundsChange.off();
        this.mapClick.off();
        this.layerClickFn.off();
        this.mapClickNoBody.off();
        this.view.removeAllLayers();
        this.view.destroy();
        this.map = null;
    }

    renderLayer (){
        this.pointLayer?.layer.webglLayer.render();
        this.lineLayer?.layer.webglLayer.render();
        this.labelLayer?.layer.webglLayer.render();
    }

    initView() {
        if (this.map) {
            return new window.mapvgl.View({
                map: this.map
            });;
        }
        return null;
    }

    initLayer() {
        // 创建默认的打点图层
        var pointLayer = new RendererPoint();
        this.addLayer(pointLayer);
        pointLayer.clickFn = this.layerClick.bind(this,pointLayer);
        return pointLayer;
    }

    initLineLayer() {
        // 创建默认的画线图层
        var lineLayer = new RendererLine();
        this.addLayer(lineLayer);
        lineLayer.clickFn = this.layerClick.bind(this,lineLayer);
        return lineLayer;
    }

    initLabelLayerLayer(){
        // 创建默认的Label图层
        var labelLayer = new RendererLabel();
        this.addLayer(labelLayer);
        labelLayer.clickFn = this.layerClick.bind(this,labelLayer);
        return labelLayer;
    }

    layerClick(renderer: Renderer ,e: layerClickParams | undefined, b: any) {
        if( e ){
            this.mapClickNoBodyObject.push(e);
            const e1 = renderer.layer.data.filter((e1: any)=>{ return e1.geometry.coordinates.toString() === e.geometry.coordinates.toString() });
            this.layerClickFn.emit({ ...e1[0], zoom: this.map.getZoom(), arrayList: e1}, b);
        }
        renderer.layer.webglLayer.render();
    }

    showProvinceArea (polygon: any){
        
        if( this.provinceArea ) {
            this.map.removeOverlay(this.provinceArea);
            this.provinceArea = null;
        }
        if ( !this.isProvinceArea ){
            return;
        }
        this.getPolygonByName(polygon.attr.name).then((e)=>{
            e.polygon.setFillColor(this.provinceAreaConfig.color);
            e.polygon.setFillOpacity(this.provinceAreaConfig.opacity);
            e.polygon.setStrokeColor(this.provinceAreaConfig.color)
            e.polygon.setStrokeOpacity(0.1);
            this.provinceArea = e.polygon
            this.map.addOverlay(e.polygon);
        })
    }



    boundsChange (fn?: Function){
        const cneter = this.map.getCenter();
        this.queryPoint({ location: cneter.lat + "," + cneter.lng }).then((e: any)=>{
            if( e.province ){
                this.province = e.province.attr.code;
                if( this.mapLevel === 2 ){
                    // 如果是地市级别的
                    e.city && e.city.polygon && this.showProvinceArea(e.city);
                }else{
                    e.city && e.city.polygon && this.showProvinceArea(e.province);
                }
                this.getCityListByProvince(e.province.attr.code).then((eList: any)=>{
                    const cdeo = eList.find((e1: any)=>{ return e.city && e.city.attr && e1.name.indexOf(e.city.attr.name) > -1; });
                    if( this.mapLevel === 2 && cdeo ){
                        getCountyListByCity(e.province.attr.code, cdeo.code).then((cList)=>{
                            e.city.attr.cityId = cdeo.code
                            this.mapBoundsChange.emit({ cList, eList, ...e })
                            fn && fn({ cList, eList, ...e });
                        })
                    }else {
                        this.mapBoundsChange.emit({ eList, ...e })
                        fn && fn({ eList, ...e });
                    }
                })
            }else {
                this.mapBoundsChange.emit(e)
            }
        })
    }

    onclick(fn: Function) {
        this.layerClickFn.on(fn);
    }

    onChange(fn: Function) {
        this.mapBoundsChange.on(fn);
    }

    onMapNoClick (fn: Function){
        this.mapClickNoBody.on(fn);
    }

    onMapClick(fn: Function) {
        this.mapClick.on(fn);
    }

    addLayer(renderer: Renderer) {
        renderer.render(this.view);
    }

    getBMapGL() {
        return window.BMapGL;
    }

    setPoints(points: Array<PointSetData>, name: string) {
        // 处理一下数据  同样的point治显示一个
        this.dataset.push({ name, datas: points });
        this.renderPoint()
    }

    renderPoint (){
        const da = this.dataset.map((e)=>{ return e.datas });
        let ary: Array<PointSetData> = [];
        for( var i in da ){
            ary = ary.concat(da[i]);
        }
        this.pointLayer && this.pointLayer.add(ary);
    }

    // setPoint(point: PointSetData) {
    // }

    setLines(points: Array<LineSetData>, name: string) {
        this.datasetList.push({ name, datas: points });
        this.renderLine()
    }
    
    renderLine (){
        const da = this.datasetList.map((e)=>{ return e.datas });
        let ary: Array<LineSetData> = [];
        for( var i in da ){
            ary = ary.concat(da[i]);
        }
        this.lineLayer && this.lineLayer.add(ary);
    }

    setLabel(points: Array<LabelSetData>, name: string) {
        this.dataLabelset.push({ name, datas: points });
        this.renderLabel()
    }

    renderLabel(){
        const da = this.dataLabelset.map((e)=>{ return e.datas });
        let ary: Array<LabelSetData> = [];
        for( var i in da ){
            ary = ary.concat(da[i]);
        } 
        this.labelLayer && this.labelLayer.add(ary);
    }

    setViewport (data: Point[], option?: any) {
        let BMap = this.getBMapGL();
        const points = data.map((e) => { return new BMap.Point(e.x, e.y) });
        this.map.setViewport(points.filter((e) => { return e.lng }), { zoomFactor: -1, margins: [20, 20, 100, 250], ...option })
    }

    clearLine(name?:string) {
        if( !name ){
            this.datasetList = [];
        }
        let i = -1;
        const f = this.datasetList.find((e,ind)=>{ i = ind; return e.name === name });
        if( f ) this.datasetList.splice(i,1);
        this.renderLine();
    }

    clearPoint(name?:string) {
        if( !name ){
            this.dataset = [];
        }else {
            let i = -1;
            const f = this.dataset.find((e,ind)=>{ i = ind; return e.name === name });
            if( f ) this.dataset.splice(i,1);
        }
        this.renderPoint();
    }

    clearLabelPoint(name?:string){
        if( !name ){
            this.dataLabelset = [];
        }
        let i = -1;
        const f = this.dataLabelset.find((e,ind)=>{ i = ind; return e.name === name });
        if( f ) this.dataLabelset.splice(i,1);
        this.renderLabel();
    }

    clear(name?:string) {
        this.clearLine(name);
        this.clearPoint(name);
        this.clearLabelPoint(name);
    }


    // 获取全国省份地市区县层级
    mapJson: Array<any> = mapJson

    // 查询省 市 线
    getMapJson(keyword: string) {
        // 过滤字节
        const keys = keyword.replace("自治区", "").split("")
        // 查询省级
        let ref = this.mapJson.concat([]);
        // 查询市级
        this.mapJson.forEach((e) => { ref = ref.concat(e.cityArray) })
        // 迭代器
        let res = { index: 0, res: null };
        ref.forEach((e) => {
            var len = keys.filter((k) => { return e.name.indexOf(k) > -1 }).length;
            // 如果符合下表多余上一个则加入
            if (res.index < len) {
                res.index = len;
                res.res = e;
            }
        })
        return res.res;
    }

    // 根据名称获取对应得几何行政数据
    getPolygonByName(name: string) {
        // 查询到对应得地区数据
        const objJson = this.getMapJson(name);
        // 根据地区数据获取地区几何
        return this.getAreaPolygonMap([objJson]).then((res: any) => {
            return res[0];
        })
    }
    centerAndZoom (lng: Point['x'], lat: Point['y'], zoom?: number, fn?: Function){
        if( this.timer.getTime() - (new Date()).getTime() < 500 ){
            clearTimeout(this.centerFn);
        }
        this.centerFn = setTimeout(()=>{
            this.centerAndZoom_(lng, lat, zoom, fn);
        },  500)
        this.timer = new Date();
    }
    // 新增变化事件
    centerAndZoom_(lng: Point['x'], lat: Point['y'], zoom?: number, fn?: Function) {
        let BMap = this.getBMapGL();
        // 获取当前要对准的点
        let point = new BMap.Point(lng, lat);
        // 记录一下当前地图的中心点
        const center = this.map.getCenter();
        // 调用地图的拖动移动视角的方法
        this.map.centerAndZoom(point, zoom);
        // 检测一下地图的中心点是否有变化
        const p = this.map.getCenter();
        // 判断一下是否有移动过
        if( center.lng !== p.lng || center.lat !== p.lat ){
            // 调用变化时间
            this.boundsChange(fn);
        }else if( fn ){
            // 如果有变化说明正在移动  创建监听事件
            const key = this.mapBoundsChange.on((e: any)=>{
                key.remove();
                fn(e);
            })
        }
    }
    // 获取全国省份列表
    getProvince(province?: string) {
        return new Promise((resolve) => {
            const len = 12;
            let code;
            const ref = mapJson.map((res) => {
                code = res.code;
                for (var i = 0; i < len; i++)
                    code[i] || (code += "0");
                return {
                    name: res.name,
                    value: res.code,
                    code: code,
                    city: res.cityArray
                }
            })
            resolve(ref)
        })
    }

    getCityListByProvince (province: string){
        return getCityListByProvince(province);
    }

    getCenterProvinceAndCity(center: any = this.map.getCenter()) {
        // 根据中心点获取当前所在省份和地市
        return this.queryPoint({ location: center.lat + "," + center.lng }).then((res) => {
            return res
        });
    }

    isInclude(point: any, polygon: any) {
        return isPointInPolygon(point, polygon)
    }

    createPolygon(rings: any, attr: any) {
        const Polygon = new BMapGL.Polygon(rings.join(";"));
        return Polygon;
    }

    getProvincePolygon({ location, len }: any) {
        return new Promise((resolve) => {
            this.getProvince().then((data: any) => {
                // 获取各省的几何数据
                this.getAreaPolygon(data, "value").then((res: any) => {
                    for (var i in res) {
                        if (!res[i].polygin) continue;
                        let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                        var e = es[0];
                        var i1 = i;
                        e = e.split(";").map((e: any) => { return e.split(",") })
                        var polygon = this.createPolygon(e, { ...res[i] })
                        variable.queryPoint.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                    }
                    const graphic = variable.queryPoint.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                    if (!graphic) {
                        return resolve({ province: null, city: null })
                    }
                    // 判断是否存在地市级别数据缓存
                    if (!graphic.cityPolygon) {
                        graphic.cityPolygon = [];
                        // 根据查询到的省份查询地市
                        const city = graphic.attr.city = graphic.attr.city.map((res: any) => {
                            let code = res.code;
                            for (var i = 0; i < len; i++)
                                code[i] || (code += "0");
                            return {
                                value: res.code,
                                ...res,
                                code: code,
                            }
                        })
                        this.getAreaPolygon(city, "value").then((res: any) => {
                            for (var i in res) {
                                if (!res[i].polygin) continue;
                                let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                                var e = es[0];
                                if (!e) continue
                                var i1 = i;
                                e = e.split(";").map((e: any) => { return e.split(",") })
                                var polygon = this.createPolygon(e, { ...res[i] })
                                graphic.cityPolygon !== null && graphic.cityPolygon.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                            }
                            const selectCity = graphic.cityPolygon !== null && graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                            return resolve({ province: graphic, city: selectCity });
                        })
                    } else {
                        // 如果存在地市级别数据
                        const selectCity = graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                        return resolve({ province: graphic, city: selectCity });
                    }
                })
            })
        });
    }

    handleProvincePolygon({location, len}: any) {
        return new Promise((resolve) => {
            const graphic = variable.queryPoint.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) })
            if (!graphic) {
                return resolve({ province: null, city: null })
            }
            // 判断是否存在地市级别数据缓存
            if (!graphic.cityPolygon || graphic.cityPolygon.length == 0) {
                graphic.cityPolygon = [];
                // 根据查询到的省份查询地市
                const city = graphic.attr.city = graphic.attr.city.map((res: any) => {
                    let code = res.code;
                    for (var i = 0; i < len; i++)
                        code[i] || (code += "0");
                    return {
                        value: res.code,
                        ...res,
                        code: code,
                    }
                })
                this.getAreaPolygon(city, "value").then((res: any) => {
                    for (var i in res) {
                        if (!res[i].polygin) continue;
                        let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                        var e = es[0];
                        if (!e) continue
                        var i1 = i;
                        e = e.split(";").map((e: any) => { return e.split(",") })
                        var polygon = this.createPolygon(e, { ...res[i] });
                        graphic.cityPolygon && graphic.cityPolygon.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                    }
                    const selectCity = graphic.cityPolygon && graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                    return resolve({ province: graphic, city: selectCity });
                })
            } else {
                // 如果存在地市级别数据
                const selectCity = graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                return resolve({ province: graphic, city: selectCity });
            }
        })
    }

    queryPoint(param: { location: string }) {
        return new Promise((resolve) => {
            // 位置
            let location_ = param.location;
            if (!location_) { return }
            let location: Array<number> = location_.split(",").map((e)=>{ return parseFloat(e) });
            // 计算code的长度
            const len = 12;
            // 创建临时变量
            if (!variable.queryPoint || variable.queryPoint.length == 0) {
                variable.queryPoint = [];
                // 首先获取全省的区域视图
                this.getProvince().then((data: any) => {
                    // 获取各省的几何数据
                    this.getAreaPolygon(data, "value").then((res: any) => {
                        for (var i in res) {
                            if (!res[i].polygin) continue;
                            let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                            var e = es[0];
                            var i1 = i;
                            e = e.split(";").map((e: any) => { return e.split(",") })
                            var polygon = this.createPolygon(e, { ...res[i] })
                            variable.queryPoint.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                        }
                        const graphic = variable.queryPoint.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                        if (!graphic) {
                            return resolve({ province: null, city: null })
                        }
                        // 判断是否存在地市级别数据缓存
                        if (!graphic.cityPolygon) {
                            graphic.cityPolygon = [];
                            // 根据查询到的省份查询地市
                            const city = graphic.attr.city = graphic.attr.city.map((res: any) => {
                                let code = res.code;
                                for (var i = 0; i < len; i++)
                                    code[i] || (code += "0");
                                return {
                                    value: res.code,
                                    ...res,
                                    code: code,
                                }
                            })
                            this.getAreaPolygon(city, "value").then((res: any) => {
                                for (var i in res) {
                                    if (!res[i].polygin) continue;
                                    let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                                    var e = es[0];
                                    if (!e) continue
                                    var i1 = i;
                                    e = e.split(";").map((e: any) => { return e.split(",") })
                                    var polygon = this.createPolygon(e, { ...res[i] })
                                    graphic.cityPolygon !== null && graphic.cityPolygon.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                                }
                                const selectCity = graphic.cityPolygon !== null && graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                                return resolve({ province: graphic, city: selectCity });
                            })
                        } else {
                            // 如果存在地市级别数据
                            const selectCity = graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                            return resolve({ province: graphic, city: selectCity });
                        }
                    })
                })
            } else {
                const graphic = variable.queryPoint.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) })
                if (!graphic) {
                    return resolve({ province: null, city: null })
                }
                // 判断是否存在地市级别数据缓存
                if (!graphic.cityPolygon || graphic.cityPolygon.length == 0) {
                    graphic.cityPolygon = [];
                    // 根据查询到的省份查询地市
                    const city = graphic.attr.city = graphic.attr.city.map((res: any) => {
                        let code = res.code;
                        for (var i = 0; i < len; i++)
                            code[i] || (code += "0");
                        return {
                            value: res.code,
                            ...res,
                            code: code,
                        }
                    })
                    this.getAreaPolygon(city, "value").then((res: any) => {
                        for (var i in res) {
                            if (!res[i].polygin) continue;
                            let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                            var e = es[0];
                            if (!e) continue
                            var i1 = i;
                            e = e.split(";").map((e: any) => { return e.split(",") })
                            var polygon = this.createPolygon(e, { ...res[i] });
                            graphic.cityPolygon && graphic.cityPolygon.push({ polygon, attr: { ...res[i] }, cityPolygon: null });
                        }
                        const selectCity = graphic.cityPolygon && graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                        return resolve({ province: graphic, city: selectCity });
                    })
                } else {
                    // 如果存在地市级别数据
                    const selectCity = graphic.cityPolygon.find((e) => { return isPointInPolygon(new BMapGL.Point(location[1], location[0]), e.polygon) });
                    return resolve({ province: graphic, city: selectCity });
                }
            }
        })
    }

    // 获取对应省份区域polygon并直接帮助转换成对象
    getAreaPolygonMap(names: Array<any>, field = 'code') {
        return this.getAreaPolygon(names, field).then((res: any) => {
            for (var i in res) {
                if (!res[i].polygin) continue;
                let es = res[i].polygin.sort((a: any, b: any) => { return b.length - a.length });
                var e = es[0];
                if (!e) continue
                var i1 = i;
                e = e.split(";").map((e: any) => { return e.split(",") })
                res[i].polygon = this.createPolygon(e, { ...res[i] })
            }
            return res;
        })
    }
    fetchMapJson({ it, field, ret, len, names }: any) {
        return new Promise((resolve) => {
            fetch('assets/mapJsonSimple/' + it[field] + '.txt').then((e: any) => {
                return e.json();
            }).then((res: any) => {
                const datas = {
                    ...it,
                    polygin: typeof res !== "string" ? res.map((e: any) => { return e.join ? e.join(";") : e; }) : res
                }
                ret.push(datas)
                mapJsonPolygon[it.code] = datas;
                len++;
                if (len == names.length) {
                    resolve(ret)
                }
            }).catch(() => {
                len++;
                if (len == names.length) {
                    resolve(ret)
                }
            })
        })
    }

    setPolygin(res: any) {
        return typeof res !== "string" ? res.map((e: any) => { return e.join ? e.join(";") : e; }) : res
    }
    // 获取对应省份区域polygon
    getAreaPolygon(names: Array<any>, field = 'code') {
        return new Promise((resolve) => {
            const ret: Array<any> = [];
            var len = 0;
            for (var i = 0; i < names.length; i++) {
                let it = names[i];
                if (mapJsonPolygon[it.code]) {
                    ret.push(mapJsonPolygon[it.code]);
                    len++;
                    if (len == names.length) {
                        resolve(ret)
                    }
                    continue
                }
                // if( it === "length" ) continue;
                // 首先获取省级的区域
                fetch('assets/mapJsonSimple/' + it[field] + '.txt').then((e: any) => {
                    return e.json();
                }).then((res: any) => {
                    const datas = {
                        ...it,
                        polygin: this.setPolygin(res)
                    }
                    ret.push(datas)
                    mapJsonPolygon[it.code] = datas;
                    len++;
                    if (len == names.length) {
                        resolve(ret)
                    }
                }).catch(() => {
                    len++;
                    if (len == names.length) {
                        resolve(ret)
                    }
                })
            }
        })
    }

    static Maps: MapObject[] = [];

    static create (id: string, params?: MapObjectParams){
        if( this.Maps.length > 0 ){
            this.Maps[0].destroyed();
            this.Maps.splice(0,1);
        }
        const mapObject = new this(id, params);
        this.Maps.push(mapObject);
        return mapObject;
    }
}
const mathIntersectCount = function({p, p1, p2, pts, i, N, intersectCount}: any): any {
    let count = intersectCount
    if (p.lat == p2.lat && p.lng <= p2.lng) {//p crossing over p2                    
        var p3 = pts[(i + 1) % N]; //next vertex                    
        if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {//p.lat lies between p1.lat & p3.lat
            ++count;
        } else {
            count += 2;
        }
        return {
            count
        }
    }
}

const forPts = function(polygon: any, point: any) {
    var pts = polygon.getPath();//获取多边形的点集合。
    /**
     基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则在多边形内
    */
    var N = pts.length;
    var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    var intersectCount = 0;//cross points count of x 
    var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
    var p1, p2;//neighbour bound vertices
    var p = point; //测试点
    p1 = pts[0];//left vertex 

    for (var i = 1; i <= N; ++i) {//check all rays            

        if (p.equals(p1)) {
            return boundOrVertex;//p is an vertex
        }

        p2 = pts[i % N];//right vertex            

        if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {//ray is outside of our interests                
            p1 = p2;
            continue;//next ray left point
        }

        if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {//ray is crossing over by the algorithm (common part of)
            if (p.lng <= Math.max(p1.lng, p2.lng)) {//x is before of ray                    
                if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {//overlies on a horizontal ray
                    return boundOrVertex;
                }

                if (p1.lng == p2.lng) {//ray is vertical                        
                    if (p1.lng == p.lng) {//overlies on a vertical ray
                        return boundOrVertex;
                    } else {//before ray
                        ++intersectCount;
                    }
                } else {//cross point on the left side                        
                    var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                    if (Math.abs(p.lng - xinters) < precision) {//overlies on a ray
                        return boundOrVertex;
                    }

                    if (p.lng < xinters) {//before ray
                        ++intersectCount;
                    }
                }
            }
        } else {//special case when ray is crossing through the vertex                
            const { count } = mathIntersectCount({p, p1, p2, pts, i, N, intersectCount})
            intersectCount = count;
        }

        p1 = p2;//next ray left point
    }

    if (intersectCount % 2 == 0) {//偶数在多边形外
        return false;
    } else { //奇数在多边形内
        return true;
    }
}

//判断点是否在多边形内：
const isPointInPolygon = function (point: any, polygon: any): any {

    //如果是百度的点，用百度已有的方法判断该点是否在多边形的外包矩形内
    if ((point instanceof BMapGL.Point) && (polygon instanceof BMapGL.Polygon)) {

        var polygonBounds = polygon.getBounds();
        var sw = polygonBounds.getSouthWest(); //西南脚点
        var ne = polygonBounds.getNorthEast(); //东北脚点

        var inRect = point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat;

        if (!inRect) {

            return false; //如果不在外包矩形内，更不会在多边形内。直接返回false 

        } else {


            var pts = polygon.getPath();//获取多边形的点集合。
            /**
             基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则在多边形内
            */
            var N = pts.length;
            var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
            var intersectCount = 0;//cross points count of x 
            var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
            var p1, p2;//neighbour bound vertices
            var p = point; //测试点
            p1 = pts[0];//left vertex 

            for (var i = 1; i <= N; ++i) {//check all rays            

                if (p.equals(p1)) {
                    return boundOrVertex;//p is an vertex
                }

                p2 = pts[i % N];//right vertex            

                if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {//ray is outside of our interests                
                    p1 = p2;
                    continue;//next ray left point
                }

                if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {//ray is crossing over by the algorithm (common part of)
                    if (p.lng <= Math.max(p1.lng, p2.lng)) {//x is before of ray                    
                        if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {//overlies on a horizontal ray
                            return boundOrVertex;
                        }

                        if (p1.lng == p2.lng) {//ray is vertical                        
                            if (p1.lng == p.lng) {//overlies on a vertical ray
                                return boundOrVertex;
                            } else {//before ray
                                ++intersectCount;
                            }
                        } else {//cross point on the left side                        
                            var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                            if (Math.abs(p.lng - xinters) < precision) {//overlies on a ray
                                return boundOrVertex;
                            }

                            if (p.lng < xinters) {//before ray
                                ++intersectCount;
                            }
                        }
                    }
                } else {//special case when ray is crossing through the vertex                

                    if (p.lat == p2.lat && p.lng <= p2.lng) {//p crossing over p2                    
                        var p3 = pts[(i + 1) % N]; //next vertex                    
                        if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {//p.lat lies between p1.lat & p3.lat
                            ++intersectCount;
                        } else {
                            intersectCount += 2;
                        }
                    }
                }

                p1 = p2;//next ray left point
            }

            if (intersectCount % 2 == 0) {//偶数在多边形外
                return false;
            } else { //奇数在多边形内
                return true;
            }

        }
    }
}