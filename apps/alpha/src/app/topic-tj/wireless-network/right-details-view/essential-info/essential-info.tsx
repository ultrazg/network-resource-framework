import { getStationInfo } from '@alpha/app/topic-tj/api/wireless';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import essentialInfoCss from './essential-info.module.scss';

/* eslint-disable-next-line */
export interface EssentialInfoProps {
  basicList: BasicListProps[],
  roomId: string,
}
interface BasicListProps {
  text?: any,
  key?: any,
}

export function EssentialInfo(props: EssentialInfoProps) {
  let basicInfoObj: {
    [propsName: string]: any
  } = {}
  const [basicInfo, SetBasicInfo] = useState(basicInfoObj)
  const [loading, setLoading] = useState<boolean>(true);

  const getBaseStationInfo = (deviceId: string) => {
    getStationInfo(deviceId).then((res: any) => {
      if (res.code == 200) {
        SetBasicInfo(res.data);
      }
      setLoading(false)
    });
  };

  useEffect(() => {
    setLoading(true)
    getBaseStationInfo(props.roomId)
  }, [props.roomId])
  return (
    <div className={essentialInfoCss['container']}>
      <Spin spinning={loading} tip='正在加载'>

        {
          basicInfo && props.basicList.map((item: any, index: number) => {
            return (
              <div className={essentialInfoCss['simpleList']} key={index}>
                <span className={essentialInfoCss['basicText']}>{item.text}:</span>
                <span className={essentialInfoCss['basicText']} title={basicInfo[item.key]}>
                  {
                    basicInfo[item.key] ? basicInfo[item.key] : "暂无信息"
                  }
                </span>
              </div>
            )
          })
        }
      </Spin>
    </div >
  );
}

export default EssentialInfo;
