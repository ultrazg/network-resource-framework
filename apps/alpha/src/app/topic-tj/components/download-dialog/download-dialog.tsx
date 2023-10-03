import styles from './download-dialog.module.scss';
import Dialog from '@alpha/app/topic-tj/components/dialog';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';
import { interval } from 'd3';
import { number } from 'echarts';
import {
  getDownLoadFilePage,
  getDownLoad,
} from '@alpha/app/topic-tj/api/wirelessNetwork';

/* eslint-disable-next-line */
export interface DownloadDialogProps {
  showModel: boolean;
  handleCancel?: Function;
  width?: string;
  bodyStyle?: object;
  style?: object;
}

interface paramsProps {
  pageNo: string; // 当前页数
  pageSize: string; // 每页个数
  data: {
    serviceCode: string; // 查询业务编码
    fileName: string; // 查询文件名
    createUser: string; // 查询文件所属用户
  };
}

const downLoadMock = [
  {
    fileName:
      '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
  {
    fileName: '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
  {
    fileName: '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
  {
    fileName: '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
  {
    fileName: '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
  {
    fileName: '汕尾市国土资源挂牌交易保证金划转操作流程（汕尾工行）',
    createTime: '2022-02-19 17:22:31',
  },
];

export function DownloadDialog(props: DownloadDialogProps) {
  const [currentIndex, setCurrentIndex] = useState<any>(null);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [fileLists, setFileLists] = useState([]);

  const setPercent = () => {
    setCurrentPercent(100);
    // let i: number = 0;
    // const num: number = 10;
    // for (i = num; i < 100; i + 10) {
    //   setCurrentPercent(i);
    // }
  };

  /** 获取下载文件列表 */
  const getDownLoadFilePageData = () => {
    getDownLoadFilePage({
      pageNo: '1', // 当前页数
      pageSize: '5', // 每页个数
      data: {
        serviceCode: '', // 查询业务编码(传空即可)
        fileName: '', // 查询文件名(传空即可)
        createUser: '', // 查询文件所属用户(传空即可)
      },
    }).then((res) => {
      if (res.data.data.length > 0) {
        setFileLists(res.data.data);
      }
    });
  };

  useEffect(() => {
    getDownLoadFilePageData();
  }, [props.showModel]);

  const handleProgress = () => {
    const params = {};
    const config = {
      responseType: 'blob',
      onDownloadProgress: (progressEvent: any) => {
        let percentComplete = progressEvent.loaded / progressEvent.total;
        console.log('percentComplete', progressEvent); //得到已完成比例
      },
    };
    getDownLoad(params, config).then((res) => {
      console.log('res', res);
      if (res) {
        const fileName = `下载.xlsx`;
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=utf-8',
        });
        const nav = window.navigator as any;
        if (nav.msSaveBlob) {
          nav.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');

          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }
    });
  };
  return (
    <div className={styles['container']}>
      <Dialog
        modelVisible={props?.showModel}
        handleCancel={() => props?.handleCancel && props.handleCancel()}
        width={props?.width || '1200px'}
        bodyStyle={props?.bodyStyle || { height: '740px' }}
        style={props?.style}
        title="下载专区"
      >
        <ul>
          {fileLists.map((item: any, index: number) => {
            return (
              <li
                key={index}
                // style={{
                //   margin: (index + 1) % 3 == 0 ? '0px' : '0 24px 24px 0',
                // }}
              >
                <div className={styles['listItem']}>
                  <div
                    className={styles['contentBox']}
                    title={item.fileName || ''}
                  >
                    <span className=" tj-iconfont icon-wenjian"></span>
                    <p>{item.fileName}</p>
                  </div>
                  <div className={styles['timeBox']}>
                    <span className=" tj-iconfont icon-shijian"></span>
                    <p className={styles['timeText']}>{item.createTime}</p>
                  </div>
                </div>
                <span
                  className={`tj-iconfont icon-xiazai21 ${styles['downLoadIcon']}`}
                  style={{ display: currentIndex == index ? 'none' : 'inline' }}
                  onClick={() => {
                    setCurrentIndex(index);
                    setPercent();
                    handleProgress();
                  }}
                ></span>
                <span
                  style={{ display: currentIndex == index ? 'inline' : 'none' }}
                >
                  <Progress
                    type="circle"
                    strokeColor="#55FAFF"
                    trailColor="#fff"
                    showInfo={false}
                    percent={currentPercent}
                    strokeWidth={10}
                    width={20}
                    format={(number) => `下载中，已完成${number}%`}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </Dialog>
    </div>
  );
}

export default DownloadDialog;
