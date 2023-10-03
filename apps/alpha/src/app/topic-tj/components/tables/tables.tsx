import styles from './tables.module.scss';
import { Table } from 'antd';
import { ConfigProvider } from 'antd';
/* eslint-disable-next-line */
export interface TablesProps {
  column?: Array<any>;
  datas: Array<any>;
  pagination: object;
  onChange?: Function;
  onClick?: Function;
  onDoubleClick?: Function;
  rowClassName?: any;
  size?: any;
  rowKey?: string;
  scroll?: object;
}

export const CustomSIze = () => (
  // 这里面就是我们自己定义的空状态
  <div
    style={{
      width: '100%',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#909399',
    }}
  >
    {' '}
    暂无数据{' '}
  </div>
);
export function Tables(props: TablesProps) {
  const { onClick, onDoubleClick, onChange } = props;
  return (
    <div className={styles['container']}>
      <ConfigProvider renderEmpty={CustomSIze}>
        <Table
          columns={props?.column}
          dataSource={props?.datas}
          pagination={props?.pagination}
          rowClassName={props?.rowClassName}
          size={props?.size}
          rowKey={props?.rowKey || 'id'}
          onChange={(page) => {
            onChange && onChange(page);
          }}
          scroll={props?.scroll}
          onRow={(record) => {
            return {
              onClick: (event) => {
                onClick && onClick(record);
              }, // 点击行
              onDoubleClick: (event) => {
                onDoubleClick && onDoubleClick(record);
              },
            };
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Tables;
