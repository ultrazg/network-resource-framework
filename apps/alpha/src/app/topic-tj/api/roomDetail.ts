import { getAction,postAction } from '@alpha/utils/http';

// 资源质量
function roomSpecialityEqpList(params?: any,areaCode?:any): Promise<any> {
  return postAction('/oss/roomPosition/roomSpecialityEqpList', params,{headers:{areaCode}});
}

function roomSpecialityEqpListByCoreNet(params?: any,areaCode?:any): Promise<any> {
  return postAction('/oss/roomPosition/roomSpecialityEqpListByCoreNet', params,{headers:{areaCode}});
}

function getEqpPortInfo(id?: any,areaCode?:any): Promise<any> {
  return postAction(`/oss/roomPosition/getEqpPortInfo?eqpId=${id}`,{},{headers:{areaCode}});
}

function getEqpPortStatis(params?: any,areaCode?:any): Promise<any> {
  return postAction('/oss/eqpDimensional/getEqpPortStatis', params,{headers:{areaCode}});
}

function mfrChoose(params?: any,areaCode?:any): Promise<any> {
  return getAction('/oss/roomPosition/mfrChoose', params,{headers:{areaCode}});
}


export {
  roomSpecialityEqpList,
  roomSpecialityEqpListByCoreNet,
  getEqpPortInfo,
  getEqpPortStatis,
  mfrChoose
};
