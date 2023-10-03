import { Progress, Collapse } from 'antd';
import { DescListProps } from '@alpha/app/topic-tj/components/desc-list/desc-list';
import styles from './device-info.module.scss';
const { Panel } = Collapse;

import DescListView from '@alpha/app/topic-tj/components/desc-list/desc-list';

import PointListView from '@alpha/app/topic-tj/components/point-list/point-list';


/* eslint-disable-next-line */
export interface ProgressProps {
  title: string;
  progressDatas: any[];
}

export interface RateInfoProps extends ProgressProps{
  collapseData: any[]
}

export function RateInfo(props: RateInfoProps) {
  const formatRate = (value: any) => {
    if (value) {
      value = value.toString();
      value = value.replace("%", "");
      value = Number(value);
    }
    return value;
  }

  const CollapseInfo = ({ collapseData }: any) => {
    const descList: DescListProps['datas'] = [{
      name: '光口',
      icon: 'icon-guangkou',
    }, {
      name: '电口',
      icon: 'icon-diankou'
    }, {
      name: '业务占用',
      color: '#ff5f18'
    }, {
      name: '占用',
      color: 'rgb(44, 190, 94)'
    }, {
      name: '空闲',
      color: '#339bf3'
    }]
    return (
      // <!-- 折叠面板 -->
      <div className={styles['collapse']}>
        <DescListView datas={descList}/>
        <Collapse
          defaultActiveKey={collapseData.map((item: any, index: number) => index)}
          className={styles['collapse-container']}
          style={{ maxHeight: '600px', overflow: 'auto' }}
        >
          {collapseData.map((item: any, index: number) => {
          return (<Panel
            header={item.bmName}
            key={index}
          >
            <PointListView
              datas={item.portTermBaseInfoDtoList}
              wrapClassNameRender={(li: any) => `
                ${li.oprStateId == 1 && 'active'}
                ${li.businessOccupancy == true && 'occupancyPoint'}
              `}
              iconClassNameRender={(li: any) => 
                `
                ${(li.portTypeId == 11 || li.portTypeId == 10) && 'icon-duanzi'}
                ${li.portTypeId == 1 && 'icon-diankou'}
                ${li.portTypeId == 2 && 'icon-guangkou'}`
              }
            />
            {/* <!-- 光端口集合 --> */}
            <PointListView
              datas={item.opticalPortList}
              wrapClassNameRender={(li: any) => `
                ${li.oprStateId == 1 && 'active'}
                ${li.businessOccupancy == true && 'occupancyPoint'}
              `}
              iconClassNameRender={(li: any) => 
                `
                ${(li.portTypeId == 11 || li.portTypeId == 10) && 'icon-duanzi'}
                ${li.portTypeId == 1 && 'icon-diankou'}
                ${li.portTypeId == 2 && 'icon-guangkou'}`
              }
            />
            {/* <!-- 电端口集合 --> */}
            <PointListView
              datas={item.electricalPortList}
              wrapClassNameRender={(li: any) => `
                ${li.oprStateId == 1 && 'active'}
                ${li.businessOccupancy == true && 'occupancyPoint'}
              `}
              iconClassNameRender={(li: any) => 
                `
                ${(li.portTypeId == 11 || li.portTypeId == 10) && 'icon-duanzi'}
                ${li.portTypeId == 1 && 'icon-diankou'}
                ${li.portTypeId == 2 && 'icon-guangkou'}`
              }
            />
            {/* // <!-- 端子集合（备选资源用） --> */}
            <PointListView
              datas={item.portTermBaseInfoDtoList}
              className={'spare'}
              wrapClassNameRender={(li: any) => `
                ${li.oprStateId == 1 && 'active'}
                ${li.businessOccupancy == true && 'occupancyPoint'}
              `}
              iconClassNameRender={(li: any) => 
                `
                ${li.portTypeId == '' || li.portTypeId == undefined && 'icon-duanzi'}
                `
              }
            />
          </Panel>)
          })}
        </Collapse>
      </div>
    )
  }
  


  return (
    <div className={`${styles['rateContainer']} ${styles['wrapper']}`}>
      <div className={styles['module_title']} v-if="title">
        <span className={styles['title']}>{ props.title }</span>
      </div>
      <div className={`${styles['progress-panel']} ${styles['pd']}`}>
        {props.progressDatas.map((item: any) => {
          return (
            <div
              key={item.portTypeName}
              className={styles['progress-wrap']}
            >
            <div className={`${styles['row']} ${styles['space-between']}`}>
              <span className={styles['progress-title']}>{ item.portTypeName }</span>
              <div className={styles['progress-legend']}>
                {/* <!-- v-for="(info, i) in item.tagList" :key="i" --> */}
                <span className={styles['legend-item']} v-if="item.portTypeId != 0">
                  <span>占用端口</span>
                  <span className={styles['num']}>{ item.zyCount }</span>
                </span>
                <span className={styles['legend-item']}>
                  <span>端口总数</span>
                  <span className={styles['num']}>{ item.dkCount }</span>
                </span>
                {((item.portTypeId == 0 && item.lightCount) ||
                    item.lightCount == 0) && <span
                  className={styles['legend-item']}
                >
                  <span>光端口数</span>
                  <span className={styles['num']}>{ item.lightCount }</span>
                </span>}
                {((item.portTypeId == 0 && item.electricCount) ||
                    item.electricCount == 0) && <span
                  className={styles['legend-item']}
                  v-if="
                    
                  "
                >
                  <span>电端口数</span>
                  <span className={styles['num']}>{ item.electricCount }</span>
                </span>}
              </div>
            </div>
            <div className={styles['progress']}>
              {/* portTypeId: 端口/端子类型(自定义：1-电端口、2-光端口、4-适配口、10-电端子、11-光端子) , */}
              <Progress
              className={
                `
                ${item.portTypeId == 0 ? 'pro_type0' : ''}
                ${(item.portTypeId == 1 || item.portTypeId == 10) ? 'pro_type1' : ''}
                ${(item.portTypeId == 2 || item.portTypeId == 11) ? 'pro_type2' : ''}
                `
              }
              percent={formatRate(item.rate
                ? item.rate
                : item.dkCount > 0
                ? ((item.zyCount / item.dkCount) * 100).toFixed(2)
                : 0)}
              />
            </div>
          </div>)
          })}
      </div>
      <CollapseInfo collapseData={props.collapseData}/>
  </div>
  );
}

export default RateInfo;
