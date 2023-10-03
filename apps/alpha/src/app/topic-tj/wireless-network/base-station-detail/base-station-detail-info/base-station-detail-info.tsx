import { useEffect, useState } from 'react';
import baseInfoCss from './base-station-detail-info.module.scss';
import { getStationInfo } from '@alpha/app/topic-tj/api/wireless';

/* eslint-disable-next-line */
export interface BaseStationDetailInfoProps {
  basicList: BasicListProps[],
  roomId: string,
  activeIndex: string,
}
interface BasicListProps {
  text?: any,
  key?: any,
}

export function BaseStationDetailInfo(props: BaseStationDetailInfoProps) {
  let basicInfoObj: {
    [propsName: string]: any
  } = {}
  const [basicInfo, SetBasicInfo] = useState(basicInfoObj)

  const getBaseStationInfo = (deviceId: string) => {
    getStationInfo(deviceId).then((res: any) => {
        if (res.code == 200) {
          SetBasicInfo(res.data);
        }
    });
  };
  
  useEffect(() => {
    getBaseStationInfo(props.roomId)
  }, [props.roomId])

  return (
    <div className={baseInfoCss['infoList']}>
      {
        basicInfo && props.basicList.map((item: any, index: number)=>{
          return(
            <div className={baseInfoCss['simpleList']} key={index}>
              <span className={baseInfoCss['basicText']}>{ item.text }:</span>
              <span className={baseInfoCss['basicText']} title={basicInfo[item.key]}>
                {
                  basicInfo[item.key] ? basicInfo[item.key] : "暂无信息"
                }
              </span>
            </div>
          )
        })
      }
    </div >
  );

}

export default BaseStationDetailInfo;
