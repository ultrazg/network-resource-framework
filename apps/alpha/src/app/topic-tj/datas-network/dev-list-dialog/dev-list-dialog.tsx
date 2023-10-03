import devListCss from './dev-list-dialog.module.scss';
import { Dialog } from '../../components/dialog';
import { useState } from 'react';
import DevEssentials from './dev-essentials/dev-essentials';
import NetworkTopology from './network-topology/network-topology';
import { useViewport } from '@alpha/app/context/viewport-context';
import TrunkCircuit from '@alpha/app/topic-tj/datas-network/widgets/trunk-circuit';
import CustomerCircuit from '@alpha/app/topic-tj/datas-network/widgets/customer-circuit';

/* eslint-disable-next-line */
export interface DevListDialogProps {
  eqpId: string;
  eqpName: string;
  closeDialog?: () => void;
  belongNetworkId: string;
  handleCallBack?: () => void;
  showModel: boolean;
  hideModelContent?: boolean;
}

export function DevListDialog(props: DevListDialogProps) {
  const [selectTabId, SetSelectTabId] = useState(1); // 选中的id

  const tabList = [
    {
      id: 1,
      name: '设备概要',
    },
    {
      id: 2,
      name: '中继电路',
    },
    {
      id: 3,
      name: '客户电路',
    },
    {
      id: 4,
      name: '网络拓扑',
    },
  ];

  const tabChange = (item: any) => {
    SetSelectTabId(item.id);
  };

  const childCompent = () => {
    const [widthWidth] = useViewport();
    const zoomVal = widthWidth / 1920;
    return (
      <>
        <div className={devListCss['top-content']}>
          <div className={devListCss['tab-content']}>
            {tabList.map((item, index) => {
              return (
                <div
                  className={
                    devListCss['tab-item'] +
                    ' ' +
                    `${selectTabId == item.id ? devListCss['active'] : ''}`
                  }
                  key={item.id}
                  onClick={() => {
                    tabChange(item);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`dev-container-body ${devListCss['container-body']}`}>
          {selectTabId === 1 && (
            <DevEssentials eqpId={props.eqpId} eqpName={props.eqpName} />
          )}
          {selectTabId === 2 && (
            <TrunkCircuit eqpId={props.eqpId} eqpName={props.eqpName} />
          )}
          {selectTabId === 3 && (
            <CustomerCircuit eqpId={props.eqpId} eqpName={props.eqpName} />
          )}
          {selectTabId === 4 && (
            <NetworkTopology
              eqpId={props.eqpId}
              belongNetworkId={props.belongNetworkId}
              eqpName={props.eqpName}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className={devListCss['container']}>
      {!props.hideModelContent ? (
        <Dialog
          modelVisible={props?.showModel}
          title="设备列表"
          width="1200px"
          handleCancel={props?.closeDialog}
          footer={null}
        >
          {childCompent()}
        </Dialog>
      ) : (
        childCompent()
      )}
    </div>
  );
}

export default DevListDialog;
