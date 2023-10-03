import styles from './dev-list-dialog.module.scss';
import { Dialog } from '../../components/dialog';
import MapSearch from '../../components/map-view/map-search/map-search';
import Tables from '../../components/tables/tables';
import DescList from '../../components/desc-list/desc-list';
import {Tooltip} from 'antd'
import { store } from '@alpha/store' 
import totalImg from '../../images/dev-port.png'
import { useEffect, useState,useRef } from 'react';

import {
  roomSpecialityEqpList,
  getEqpPortInfo,
  getEqpPortStatis,
  mfrChoose
} from '../../api/roomDetail';
/* eslint-disable-next-line */
export interface DevListDialogProps {
  showModel?:boolean,
  handleCancel?:Function,
  handleReset?:Function,
  roomID?:string
}

export function DevListDialog(props: DevListDialogProps) {
  let searchRef = useRef()
  const state = store.getState();
  const [currentPage,setPage] = useState(1)
  const [tableData,setTableData] = useState([])
  const [pageTotal,setTotal] = useState(0)
  const [searchData,setSearchData] = useState({})
  const [portData,setPortData] = useState([])
  const [mrfData,setMrfData] = useState([])
  const [electricList,setElectData] = useState([])
  const [rowId,setRowId] = useState('')
  const [eqTotal,setEqTotal] = useState(0)
  const areaCode = state.reduxMapResource.mapSelect.areaCode
  const {handleCancel} = props
  const [tableColumn,setColumn] = useState([
    {
      title: '管理区域',
      dataIndex: 'regionName',
      key: 'regionName',
      
    },
    {
      title: '所属专业',
      dataIndex: 'speciality',
      key: 'speciality',
    },
    {
      title: '设备名称',
      dataIndex: 'eqpName',
      key: 'eqpName',
    },
    {
      title: '设备类型',
      dataIndex: 'eqpType',
      key: 'eqpType',
    },
    {
      title: '生产厂家',
      dataIndex: 'mfr',
      key: 'mfr',
    },
    {
      title: '设备型号',
      dataIndex: 'eqpModel',
      key: 'eqpModel',
    },
  ])
  const scaleData = [
    {
      label: "全部",
      value: ""
    },
    {
      label: "接入网",
      value: "90"
    },
    {
      label: "数据网",
      value: "70"
    },
    {
      label: "移动网",
      value: "230"
    },
    {
      label: "传输网",
      value: "50"
    },
    {
      label: "核心网",
      value: "80"
    }
  ]
  const descData = [
    {icon:"icon-qita",name:'端口',color:'#8ec1ff'},
    {color:'#38dd86',name:'空闲'},
    {color:'#19deeb',name:'预占'},
    {color:'#ffc133',name:'占用'},
    {color:'#ff674b',name:'故障'}]
  const searcchOption = [
    {span:8,props:'mfrId',label:'厂家',formType:'select',options:mrfData},
    {span:8,props:'specialityId',label:'专业',formType:'select',options:scaleData},
    {span:8,props:'eqpName',label:'设备名称',formType:'input'}
  ]
  useEffect(()=>{
    getEqListData()
  },[currentPage])
  useEffect(()=>{
    if(props.roomID!==''){
      getEqListData()
      getMfrData()
    }
  },[props.roomID])

  useEffect(()=>{
    getEqListData()
  },[searchData])

  const tableChange = (pageConfig:any)=>{
    setPage(pageConfig.current)
  }

  // 获取设备列表数据
 const getEqListData = ()=>{
  const params = {
    data:{
      ...searchData,
      roomId:props.roomID
    },
    pageNo:currentPage,
    pageSize: 5,
  }
 
  roomSpecialityEqpList(params,areaCode).then((res)=>{
    setTotal(res.data.total)
    setTableData(res.data.data)
    if(res.data.data.length>0){
      const {eqpId, specialityId} = res.data.data[0]
      const params = {eqpId, specialityId}
      setRowId(eqpId)
      getEqTotal(params,areaCode)
      getEqpPortInfoData(eqpId,areaCode)
    }else{
      setRowId('')
      setPortData([])
      setElectData([])
    }
    
  })
 }

//  获取下拉框厂家数据
const getMfrData = ()=>{
  mfrChoose({},areaCode).then((res)=>{
   
    const data = res.data.map((item:any)=>{
      return {label:item.mfr,value:item.mfr_id}
    })
   
    setMrfData(data)
  })
}

  const handleCancelClick = ()=>{
    setPortData([])
    setElectData([])
    setSearchData({})
    const handleFields = (searchRef.current as any) && (searchRef.current as any).handleFields as any
    handleFields&&handleFields()
    if(typeof handleCancel === 'function'){
    handleCancel()
    } 
  }
  const onClick = (row:any)=>{
    const { eqpId, specialityId } = row;
    setRowId(eqpId)
    const params = {eqpId, specialityId}
    getEqpPortInfoData(eqpId,areaCode)
    getEqTotal(params,areaCode)
  }
  // 获取端口详情数据
  const getEqpPortInfoData = (params:any,areaCode:any)=>{
    getEqpPortInfo(params,areaCode).then((res)=>{
      setPortData(res.data.filter((i:any)=>{return i.portTypeId==='2'}))
      setElectData(res.data.filter((i:any)=>{return i.portTypeId==='1'}))
    })
  }
  // 获取端口总数
  const getEqTotal = (params:any,areaCode:any)=>{
    getEqpPortStatis(params,areaCode).then((res)=>{
      setEqTotal(res.data.portNums)
      
    })
  }
  // 根据图例获得对应状态的颜色
  const getPriorName = (item:any)=>{
    const arr = descData.filter((i,index)=>{return i.name == item.oprStateName})
    return arr.length>0?arr[0].color:''
   
  }
  // 搜索操作
  const handleSearch = (form:any)=>{
    const obj = {
      eqpName: null,
      eqpTypeId: null,
      mfrId: null,
      specialityId:null
    }
    
    setSearchData({...obj,...form})
  }

  // 重置操作
  const handleReset = ()=>{
    setPortData([])
    setElectData([])
    setSearchData({ eqpName: '',
    eqpTypeId: '',
    mfrId: '',
    specialityId:''})
    if(typeof props.handleReset === 'function'){
      props.handleReset()
    }
  }

  // 组装端口tip文案
  const getTipText = (obj:any,name:any)=>{
    return `${obj['portName']} 【${obj['oprStateName']}】 ${obj['portRate']}` || ''
  }

  const getPortIcon = (item:any)=>{
    const icons = ['icon-qita','icon-baizhao','icon-qianzhao','icon-wanzhao','icon-a-5g']
    if(item.portRateFlag == '0' || !item.portRateFlag){
      return icons[0]
    }else{
      return icons[item.portRateFlag]
    }
  }
  return (
    <div className={styles['container']}>
      <Dialog 
      modelVisible={props?.showModel}  
      title='机房设备' 
      width='1200px' 
      handleCancel={handleCancelClick}
      footer={null} >
        <div className={styles['searchBox']}>
        <MapSearch 
        ref={searchRef}
        formItems={searcchOption} 
        defaultValue={{ eqpName: '',
          eqpTypeId: '',
          mfrId: '',
          specialityId:''}}  
       
        formOptions={{
                gutter: 20,
                showResetBtn:false,
                showSearchBtn:true
            }} 
        handleSearch={handleSearch}
        handleReset={handleReset}
        ></MapSearch>
        </div>
        <Tables datas={tableData} 
        onClick={onClick} 
        column={tableColumn} 
        size="small"
        onChange={tableChange}
        rowClassName={(item:any)=>{return item.eqpId==rowId && styles['active-row']}}
        rowKey={'eqpId'}
        pagination={
          {
          total:pageTotal,
          defaultCurrent:1,
          pageSize:5,
          size:'small',
          showSizeChanger:false,
          showQuickJumper:false,
          showTitle:false,  
          showTotal:()=>{
            return '共'+pageTotal+'条'
          }
          }}/>
        <div className={styles['eqDetailsWrap']} style={{display:portData.length>0?'block':'none'}}>
        <DescList datas={descData}/>
            <div className={styles['eqList']}>
            <div className={styles['totalBox']}>
              <img src={totalImg} alt="" />
              <p style={{fontSize:'12px',marginBottom:'4px'}}>设备端口数</p>
              <p style={{fontSize:'20px',fontWeight:'700',marginTop:'4px'}}>{eqTotal}</p>
            </div>
            <div className={styles['allList']}>
              <div className={styles['listBox']}>
                {
                  portData.length>0?portData.map((item,index)=>{
                    const color = getPriorName(item)
                    return <div className={styles['icons']} style={{color:color}} key={index}>
                      <Tooltip title={getTipText(item,'portName')} color="#fff" overlayClassName={styles['tipText']}><em className='iconFont tj-iconfont icon-qita'></em></Tooltip>
                      
                      </div>
                  }):''
                }
              </div>
              <div className={styles['listBox']}>
                {
                  electricList.length>0?electricList.map((item,index)=>{
                    const color = getPriorName(item)
                    // getPortIcon
                    return <div className={styles['icons']} style={{color:color}} key={index}> 
                      <Tooltip title={getTipText(item,'portName')} color="#fff" overlayClassName={styles['tipText']}>
                        <em className={`iconFont tj-iconfont icon-qita ${getPortIcon(item)}`}></em>
                        </Tooltip>
                      </div>
                  }):''
                }
              </div>
            </div>
            </div>
        </div>
      </Dialog>
    </div>
  );
}

export default DevListDialog;
