import { useState,useEffect } from 'react';
import TopologyView from './core-TopologyCss';
import { useViewport } from "@alpha/app/context/viewport-context";
import styles from '@alpha/app/topic-tj/components/map-view/map-view.module.scss';

function NetworkTopology(props:any) {
  const [widthWidth, heightHeight] = useViewport();
  const [checkType,setCheckType] = useState(1)
  const [currentItem, setCurrentItem] = useState<any>('');
  useEffect(()=>{    
  },[])
  const changeCheckType = (type:any,name:any)=>{
    if(name || name!== ''){
      props.selectedElement(name)
    }
    setCheckType(type)
    if(type == 7){
      setCurrentItem('无线网/终端用户')
    }else{
      setCurrentItem('')
    }
  }
  const selectAll = (type:any)=>{
    props.selectedElement('ALL')
    if(checkType == 2){
        setCheckType(1)
        setCurrentItem('')
    }else{
        setCheckType(type)
        setCurrentItem('长途/信令网/IP承载B网')
    }
  }
  const changeActive = (pro: string,type:any) => {
    setCheckType(1)
    setCurrentItem(pro)
    props.selectedElement(type)
  };
  const goMap = (type:any,map:any,isFive:any) => {
    props.selectedElement(type,map,isFive)
  };
  const changeHeader = (pro:string) =>{
    props.selectedElement('ALL')
    if(checkType == 1){
      setCurrentItem(pro)
      setCheckType(2)
    }else if(currentItem !== '长途/信令网/IP承载B网'){
      setCurrentItem(pro)
      setCheckType(2)
    }else{
      setCurrentItem('')
      setCheckType(1)
    }
  }
  const changeBottom = (type:any,name:any,pro:any) =>{
    props.selectedElement(name)
    setCheckType(type)
    setCurrentItem(pro)
  }
    return (
      <TopologyView>
        <div className='Topology'>
            <p className='IPB' onClick={() => changeHeader('长途/信令网/IP承载B网')}><span className={currentItem == '长途/信令网/IP承载B网' ? 'activeClass' : ''}>长途/信令网/IP承载B网</span></p>
            <div className='header' onClick={() => selectAll(2)}></div>
            <p className='wifi' onClick={() => changeBottom(7,'ALL','无线网/终端用户')}><span className={currentItem == '无线网/终端用户' ? 'activeClass' : ''}>无线网/终端用户</span></p>
            <div className='bottom' onClick={() => changeCheckType(7,'ALL')}></div>
            <div className={checkType == 3 ? 'activeTitle title1' : 'title title1'} onClick={() => changeCheckType(3,'CS')}>CS</div>
            <div className={checkType == 4 ? 'activeTitle title2' : 'title title2'} onClick={() => changeCheckType(4,'PS')}>PS</div>
            <div className={checkType == 5 ? 'activeTitle title3' : 'title title3'} onClick={() => changeCheckType(5,'5GC')}>5GC</div>
            <div className={checkType == 6 ? 'activeTitle title4' : 'title title4'} onClick={() => changeCheckType(6,'IMS')}>IMS</div>
            <div className={checkType == 8 ? 'activeTitle title5' : 'title title5'} onClick={() => changeCheckType(8,'')}>EPC</div>
            <div className={checkType==1?'bg bg1':checkType==2?'bg bg2':checkType==3?'bg bg3':checkType==4?'bg bg4':checkType==5?'bg bg5':checkType==6?'bg bg6':checkType==7?'bg bg7':'bg bg1'}>
              {/* 顶部全亮小球 */}
              {checkType == 2?
              <div className='headerBall'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
              :checkType == 7?
              <div className='bottomBall'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
              :''
              }
            </div>
            <div className='bg buildingBg'></div>
            {/* CS */}
            <p className='MGW' onClick={() => changeActive('MGW','CS')} onDoubleClick={() => goMap('MGW',true,1)}><span className={currentItem == 'MGW' ? 'activeClass' : ''}>MGW</span></p>
            <p className='MSC-server' onClick={() => changeActive('MSC-server','CS')} onDoubleClick={() => goMap('MSC-server',true,1)}><span className={currentItem == 'MSC-server' ? 'activeClass' : ''}>MSC-server</span></p>
            {/* PS */}
            <p className='HLR' onClick={() => changeActive('HLR','PS')} onDoubleClick={() => goMap('HLR',true,1)}><span className={currentItem == 'HLR' ? 'activeClass' : ''}>HLR</span></p>
            <p className='HSS' onClick={() => changeActive('HSS','PS')} onDoubleClick={() => goMap('HSS',true,1)}><span className={currentItem == 'HSS' ? 'activeClass' : ''}>HSS</span></p>
            <p className='CG' onClick={() => changeActive('CG','PS')} onDoubleClick={() => goMap('CG',true,1)}><span className={currentItem == 'CG' ? 'activeClass' : ''}>CG</span></p>
            <p className='SGW_PGW' onClick={() => changeActive('SGW/PGW','PS')} onDoubleClick={() => goMap('SGW/PGW',true,1)}><span className={currentItem == 'SGW/PGW' ? 'activeClass' : ''}>SGW/PGW</span></p>
            <p className='MME' onClick={() => changeActive('MME','PS')} onDoubleClick={() => goMap('MME',true,1)}><span className={currentItem == 'MME' ? 'activeClass' : ''}>MME</span></p>
            <p className='SGSN' onClick={() => changeActive('SGSN','PS')} onDoubleClick={() => goMap('SGSN',true,1)}><span className={currentItem == 'SGSN' ? 'activeClass' : ''}>SGSN</span></p>
            <p className='GGSN' onClick={() => changeActive('GGSN','PS')} onDoubleClick={() => goMap('GGSN',true,1)}><span className={currentItem == 'GGSN' ? 'activeClass' : ''}>GGSN</span></p>
            <p className='PCRF' onClick={() => changeActive('PCRF','PS')} onDoubleClick={() => goMap('PCRF',true,1)}><span className={currentItem == 'PCRF' ? 'activeClass' : ''}>PCRF</span></p>
            {/* IMS */}
            <p className='IMMGW' onClick={() => changeActive('IMMGW','IMS')} onDoubleClick={() => goMap('IMMGW',true,1)}><span className={currentItem == 'IMMGW' ? 'activeClass' : ''}>IMMGW</span></p>
            <p className='MGCF' onClick={() => changeActive('MGCF','IMS')} onDoubleClick={() => goMap('MGCF',true,1)}><span className={currentItem == 'MGCF' ? 'activeClass' : ''}>MGCF</span></p>
            <p className='AS' onClick={() => changeActive('AS','IMS')} onDoubleClick={() => goMap('AS',true,1)}><span className={currentItem == 'AS' ? 'activeClass' : ''}>AS</span></p>
            <p className='S_I_CSCF' onClick={() => changeActive('S/I-CSCF','IMS')} onDoubleClick={() => goMap('S/I-CSCF',true,1)}><span className={currentItem == 'S/I-CSCF' ? 'activeClass' : ''}>S/I-CSCF</span></p>
            <p className='SBC' onClick={() => changeActive('SBC','IMS')} onDoubleClick={() => goMap('SBC',true,1)}><span className={currentItem == 'SBC' ? 'activeClass' : ''}>SBC</span></p>
            {/* 5GC */}
            {/* <div className='five-box'> */}
            <p className='BSF' onClick={() => changeActive('BSF','5GC')} onDoubleClick={() => goMap('BSF',true,2)}><span className={currentItem == 'BSF' ? 'activeClass' : ''}>BSF</span></p>
            <p className='AMF' onClick={() => changeActive('AMF','5GC')} onDoubleClick={() => goMap('AMF',true,2)}><span className={currentItem == 'AMF' ? 'activeClass' : ''}>AMF</span></p>
            <p className='NSSF' onClick={() => changeActive('NSSF','5GC')} onDoubleClick={() => goMap('NSSF',true,2)}><span className={currentItem == 'NSSF' ? 'activeClass' : ''}>NSSF</span></p>
            <p className='UDM' onClick={() => changeActive('UDM','5GC')} onDoubleClick={() => goMap('UDM',true,2)}><span className={currentItem == 'UDM' ? 'activeClass' : ''}>UDM</span></p>
            <p className='PCF' onClick={() => changeActive('PCF','5GC')} onDoubleClick={() => goMap('PCF',true,2)}><span className={currentItem == 'PCF' ? 'activeClass' : ''}>PCF</span></p>
            <p className='UPF_U' onClick={() => changeActive('UPF(U)','5GC')} onDoubleClick={() => goMap('UPF(U)',true,2)}><span className={currentItem == 'UPF(U)' ? 'activeClass' : ''}>UPF(U)</span></p>
            <p className='SMFF_C' onClick={() => changeActive('SMFF(C)','5GC')} onDoubleClick={() => goMap('SMFF(C)',true,2)}><span className={currentItem == 'SMFF(C)' ? 'activeClass' : ''}>SMFF(C)</span></p>
            {/* </div> */}
            {/* CS模块 */}
            {currentItem == 'MGW'?
              <div className='line1'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>:''
            }
            {currentItem == 'MSC-server'?
              <div className='line2'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>:''
            }
            {/* PS模块线 */}
            {currentItem == 'SGSN'?
              <div className='psLine1'>
                {/* 上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'CG'?
              <div className='psLine2'>
                {/* 上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'SGW/PGW'?
              <div className='psLine3_1'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'PCRF'?
              <div className='psLine3_2'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'HSS'?
              <div className='psLine4'>
                {/*上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 中线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'MME'?
              <div className='psLine5'>
                {/* 上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            :''
            }
            {currentItem == 'GGSN'?
              <div className='psLine6'>
                {/* 上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'HLR'?
              <div className='psLine7'>
                {/* 上线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                {/* 下线 */}
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'BSF'?
              <div className={checkType == 5 || checkType == 6?'psLine_5G_BSF psLine_5G_BSF_1':'psLine_5G_BSF psLine_5G_BSF_2'}>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'AMF'?
              <div className='psLine_5G_AMF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'NSSF'?
              <div className='psLine_5G_NSSF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'UDM'?
              <div className='psLine_5G_UDM'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'PCF'?
              <div className='psLine_5G_PCF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>

                <p></p>
                <p></p>
                <p></p>
                <p></p>

                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'UPF(U)'?
              <div className='psLine_5G_UPF_U'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'SMFF(C)'?
              <div className='psLine_5G_SMFF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'SBC'?
              <div className={checkType==6?'psLine_5G_SBC psLine_5G_SBC_1':'psLine_5G_SBC psLine_5G_SBC_2'}>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'S/I-CSCF'?
              <div className='psLine_5G_S_I_CSCF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'MGCF'?
              <div className='psLine_5G_MGCF'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'IMMGW'?
              <div className='psLine_5G_IMMGW'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
            {currentItem == 'AS'?
              <div className='psLine_5G_AS'>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div> 
            :''
            }
        </div>
      </TopologyView>
  );
}
export default NetworkTopology;
