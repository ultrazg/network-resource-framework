import { useEffect, useState } from 'react';
import rackListCss from './rack-list.module.scss';
import CoreDetailDialog from '../../core-detail-dialog/core-detail-dialog';
import { getRackInsideInfo } from '@alpha/app/topic-tj/api/coreNetwork';
import { Message } from '@alpha/app/topic-tj/components/message/message';
import { Spin } from 'antd';
interface ListItemProps {
  item: {
    rackNo: string; //机架编号
    rackName: string; //机架名称
    oprStateId: string;
    rowNum: string; //机架行号
    colNum: string; //机架列号
  };
  index: number;
  listIndex: number;
  showhighLight: (item: any, index: number) => void;
}

const ListItem = (props: ListItemProps) => {
  const item = props.item;
  return (
    <div
      className={
        rackListCss['item-body'] +
        ' ' +
        `${item.oprStateId === '170002' ||
          item.oprStateId === '170003' ||
          item.oprStateId === '170005' ||
          item.oprStateId === '170030'||
          item.oprStateId === '170187'
          ? rackListCss['item-body-occupy']
          : rackListCss['item-body-free']
        } 
        ${props.listIndex === props.index ? rackListCss['bgcStyle'] : ''}`
      }
      key={item.rackNo}
      onClick={() => props.showhighLight(item, props.index)}
      title={`${item.rowNum}-${item.colNum}`}
    >
      {item.rowNum}-{item.colNum}
    </div>
  );
};

/* eslint-disable-next-line */
export interface RackListProps {
  roomId: string;
  roomRackInfoData: any;
  roomNeListLoading: boolean;
}

export function RackList(props: RackListProps) {
  const [listIndex, setListIndex] = useState(-1); // 选中的下表索引
  const [showModel, setShowModel] = useState(false);
  const [activeItem, setActiveItem] = useState<{ [key: string]: any }>({});
  const [machineDtoList, setMachineDtoList] = useState([]);
  const showhighLight = (item: any, index: number) => {
    // console.log('点击机架列表事件触发', item);
    setListIndex(index);
    setActiveItem(item);
    getInfoData(item.rackNo);
  };

  const getInfoData = (rackNo: any) => {
    getRackInsideInfo({
      rackNo: rackNo,
      // rackNo: '6F1-1B-8',
    }).then((res: any) => {
      if (res.code == 200) {
        if (
          res.data?.physicalMachineDtoList &&
          res.data.physicalMachineDtoList.length > 0
        ) {
          setMachineDtoList(res.data.physicalMachineDtoList);
          setShowModel(true);
        } else {
          Message({
            content: '该机架无服务',
            top: 60,
          });
        }
      }
    });
  };

  useEffect(() => {
    setListIndex(-1)
  }, [props.roomId])

  return (
    <div className={rackListCss['container']}>

      <Spin spinning={props.roomNeListLoading} tip='正在加载'>
        <div className={rackListCss['rack-top']}>
          <div className={rackListCss['rack-top-item']}>
            <div className={rackListCss['rack-top-value']}>
              {' '}
              {props.roomRackInfoData?.rackNum}{' '}
            </div>
            <div className={rackListCss['rack-top-label']}> 总机架 </div>
          </div>
          <div className={rackListCss['rack-top-item']}>
            <div className={rackListCss['rack-top-value']}>
              {' '}
              {props.roomRackInfoData?.rackUseNum}{' '}
            </div>
            <div className={rackListCss['rack-top-label']}> 占用机架 </div>
          </div>
          <div className={rackListCss['rack-top-item']}>
            <div className={rackListCss['rack-top-value']}>
              {' '}
              {props.roomRackInfoData?.rackUnUseNum}{' '}
            </div>
            <div className={rackListCss['rack-top-label']}> 空闲机架 </div>
          </div>
        </div>
        <div className={rackListCss['rack-body']}>
          <div className={rackListCss['rack-item-body']}>
            {props.roomRackInfoData?.rackInfoList?.map(
              (item: any, index: number) => {
                return (
                  <ListItem
                    key={item.rackId}
                    item={item}
                    showhighLight={(item) => showhighLight(item, index)}
                    index={index}
                    listIndex={listIndex}
                  />
                );
              }
            )}
          </div>
        </div>
        {showModel && <CoreDetailDialog
          showDetailModel={showModel}
          handleHiddenModel={() => {
            setShowModel(false);
          }}
          list={machineDtoList}
          listItem={activeItem}
        />}
      </Spin>
    </div>
  );
}

export default RackList;
