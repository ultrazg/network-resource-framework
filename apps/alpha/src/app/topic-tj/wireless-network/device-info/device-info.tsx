import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { InfoProps } from '@alpha/app/topic-tj/components/info/info'
import { getUsageRateByPortType,  getPortTermByCardModule, getEqpDetailName } from '@alpha/app/topic-tj/api/wireless'
import { ProgressProps, RateInfoProps } from './rate-info';

// 引入插件
import DialogView from '@alpha/app/topic-tj/components/dialog/index';
import InfoView from '@alpha/app/topic-tj/components/info/info';
import RateInfoView from '@alpha/app/topic-tj/wireless-network/device-info/rate-info';
/* eslint-disable-next-line */
export interface DeviceInfoProps {
  id: string,
  name: string,
  modelVisible: boolean;
  handleCancel?: () => void
}

export function DeviceInfo(props: DeviceInfoProps) {
  const [infos, setInfos] = useState<InfoProps['infos']>([
    [
      {
        label: '设备名称',
        props: 'eqpName',
        text: ''
      },
      {
        label: '设备编号',
        props: 'eqpNo',
        text: ''
      }
    ],
    [
      {
        label: '所属安置地点',
        props: 'positId',
        text: ''
      },
      {
        label: '入网时间',
        props: 'useTime',
        text: ''
      }
    ],
    [
      {
        label: '包机人',
        props: 'mntMan',
        text: ''
      },
      {
        label: '设备类型',
        props: 'resTypeName',
        text: ''
      }
    ],
    [
      {
        label: '所属行政地市',
        props: 'pCityDistrictId',
        text: ''
      },
      {
        label: '所属网络',
        props: 'belongNetwork',
        text: ''
      }
    ],
    [
      {
        label: '生产厂家',
        props: 'mfrId',
        text: ''
      },
      {
        label: '地址',
        props: 'address',
        text: ''
      }
    ]
  ]);
  const [rateInfo, setRateInfo] = useState<ProgressProps>({
    title: '',
    progressDatas: []
  })
  const [collapseData, setCollapseData] = useState<RateInfoProps['collapseData']>([]);
  const reduxMapResource = useSelector(
    (state: any) => state.reduxMapResource
  );
  useEffect(() => {
    if(props.id && props.name && props.modelVisible) {
      getRateInfo(props.id || '038021630100000798197646')
      getEqpDetailNameInfo(props.name || '永川联通新大楼CX600X8-ASG-M');
    }
  }, [props.id, props.name, props.modelVisible])
  const getEqpDetailNameInfo = (name: string) => {
    getEqpDetailName(name).then(res => {
      if (res && res.code === '200') {
        const datasInfo = [...infos];
        datasInfo.forEach(infoItems => {
          infoItems.forEach(infoItem => {
            infoItem.text = res.data[infoItem.props as string]
          })
        });
        setInfos(datasInfo)
      }
    })
  }
  const getRateInfo = (id: string) => {
    let params = {
      resId: id,
      province:  reduxMapResource.mapSelect.areaCode
    };
    getPortTermByCardModule(params).then((res) => {
      if (res.code === "200") {
        setCollapseData(res.data);
      }
    });
    getUsageRateByPortType(params).then((res) => {
      if (res.code === "200") {
        const data = res.data;
        setRateInfo({
          title: "端子占用率",
          progressDatas: data
        })
      }
    });
  };
  return (
    <DialogView
    title={'设备信息'}
    modelVisible={props.modelVisible}
    handleCancel={props.handleCancel}
    >
      <InfoView infos={infos} />
      <RateInfoView
        title={rateInfo.title}
        progressDatas={rateInfo.progressDatas}
        collapseData={collapseData}
      />
    </DialogView>
  );
}

export default DeviceInfo;
