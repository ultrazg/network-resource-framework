import { ReactNode, useState } from 'react';
import { Modal } from 'antd';
import  styles from './dialog.module.scss'
export interface DialogProps {
    children?:any;
    title?:any;
    width?:string;
    container?:boolean;
    footer?:any;
    closable?:boolean;
    closeIcon?:ReactNode;
    modelVisible?:boolean;
    handleCancel?:Function;
    bodyStyle?:any;
    style?:any;
    maskClosable?:boolean;
    mask?:boolean;
    destroyOnClose?: boolean
}
const bodyStyle = {
  height:'100%',
  minHeight:'600px',
  maxHeight:'800px'
}
export function Dialog(prop:DialogProps){
    const {handleCancel} = prop
    const hiddenDialog = ()=>{
      if(typeof handleCancel === 'function'){
        handleCancel()
      }
    }
    // const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
      // handleOk
    };
  
    return (
      <div className={`dialogContainer ${styles['container']}`}>
          <Modal 
          title={prop?.title}  
          width={prop?.width || '1200px'}
          closable={prop?.closable}
          closeIcon={prop?.closeIcon}
          className={styles['dialog']} 
          open={prop?.modelVisible} 
          bodyStyle = {prop?.bodyStyle||bodyStyle}
          style={prop?.style}
          maskClosable={prop?.maskClosable||false}
          mask={prop?.mask}
          getContainer={false}
          footer={prop?.footer || null}
          onOk={handleOk} 
          onCancel={hiddenDialog}
          destroyOnClose={prop.destroyOnClose || false}
          >
            {prop?.children}
          </Modal>
      </div>
    );
}

export default Dialog;
