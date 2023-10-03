import { useEffect, useState } from 'react';
import NEListCss from './network-element-list.module.scss';
import NEImg from '../images/NEImg.png';

import DeviceDetailDialog from '@alpha/app/topic-tj/core-network/device-detail-dialog/device-detail-dialog';
import { Spin } from 'antd';

interface ListItemProps {
  item: {
    eqpId: string;
    eqpName: string;
    eqpNo: string;
    alias: string;
    roomId: string;
    roomName: string;
    resTypeId: string;
    resTypeName: string;
  },
  index: number;
  listIndex: number;
  showhighLight: (item: any, index: number) => void
}

const ListItem = (props: ListItemProps) => {
  const item = props.item;
  return (
    <div className={NEListCss['item-body'] + ' ' + `${props.listIndex === props.index ? NEListCss['bgcStyle'] : ''}`}
      
      onClick={() => props.showhighLight(item, props.index)}>
      <div className={NEListCss['item-left']}>
        <div className={NEListCss['item-left-img']}><img src={NEImg} alt='' /></div>
        <div className={NEListCss['item-left-label']}> {item.resTypeName} </div>
      </div>
      <div className={NEListCss['item-right']}>
        <div className={NEListCss['item-right-name']}> {item.eqpName} </div>
        <div className={NEListCss['item-right-region']}><span>管理区域：</span> {item.roomName} </div>
      </div>
    </div>
  );
};

/* eslint-disable-next-line */
export interface NetworkElementListProps {
  roomId: string;
  roomNeListData: any;
  roomRackInfoLoading: boolean;
}

export function NetworkElementList(props: NetworkElementListProps) {
  const [listIndex, setListIndex] = useState(-1); // 选中的下表索引
  const [isShow, setIsShow] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<{ [key: string]: any }>({
    eqpName: '',
    eqpId: '',
  }); // 当前选中

  const showhighLight = (item: any, index: number) => {
    console.log(item);
    setListIndex(index);
    setCurrentItem(item);
    setIsShow(true);
  };
  useEffect(() => {
    setListIndex(-1)
  }, [props.roomId])
  return (
    <div className={NEListCss['container']}>
      <Spin spinning={props.roomRackInfoLoading} tip='正在加载'>

        <div className={NEListCss['NE-title']}> 网元列表</div>
        <div className={NEListCss['NE-body']}>
          {
            props.roomNeListData?.map((item: any, index: number) => {
              return (
                <ListItem
                  item={item}
                  showhighLight={(item) => showhighLight(item, index)}
                  index={index}
                  key={item.eqpId}
                  listIndex={listIndex}
                />
              );
            })
          }
        </div>
        <DeviceDetailDialog
          showModal={isShow}
          onClose={() => setIsShow(false)}
          eqpName={currentItem['eqpName']}
          eqpId={currentItem['eqpId']}
        // provinceCode={'230000000000'} // fixme：省份编码
        />

      </Spin>
    </div>
  );
}

export default NetworkElementList;
