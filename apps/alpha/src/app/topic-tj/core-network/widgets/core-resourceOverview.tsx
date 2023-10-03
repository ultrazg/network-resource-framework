import styled from 'styled-components';
import { useEffect, useState } from 'react';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import bg1 from '../images/Group_bg1.png';
import bg2 from '../images/Group_bg2.png';
import bg3 from '../images/Group_bg3.png';
import icon1 from '../images/icon1.png';
import icon2 from '../images/icon2.png';
import icon3 from '../images/icon3.png';
import activeIcon1 from '../images/activeIcon1.png';
import activeIcon2 from '../images/activeIcon2.png';
import activeIcon3 from '../images/activeIcon3.png';
import boxIcon from '../images/boxIcon.png';
import { getCoreDatas } from '../../api/coreNetwork';

const ResourceOverClass = styled.div`
  .ResourceOverBox {
    width: 600.2px;
    height: 420.3px;
    .ResourceContentOne {
      width: 600.2px;
      height: 332.3px;
      display: flex;
      justify-content: center;
      background: url(${bg1}) no-repeat -6px center;
      background-size: 100% 100%;
    }
    .ResourceContentTwo {
      width: 600.2px;
      height: 332.3px;
      display: flex;
      justify-content: center;
      background: url(${bg2}) no-repeat center center;
      background-size: 100% 100%;
    }
    .ResourceContentThree {
      width: 600.2px;
      height: 332.3px;
      display: flex;
      justify-content: center;
      background: url(${bg3}) no-repeat center center;
      background-size: 100% 100%;
    }
    .bgBox {
      width: 398.47px;
      height: 298px;
      display: flex;
      .bgBoxTwo {
        width: 398.47px;
        height: 238.79px;
        align-self: flex-end;
        position: relative;
        > div {
          position: absolute;
          cursor: pointer;
        }
        > p {
          width: 78.2px;
          height: 31.45px;
          line-height: 31.45px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-family: 'Microsoft YaHei';
          text-align: center;
          background: url(${boxIcon}) no-repeat center center;
          background-size: 100% 100%;
          position: absolute;
        }
        > p:nth-of-type(1) {
          top: -4px;
          left: -86px;
          color:'#19B5F3';
        }
        > p:nth-of-type(2) {
          top: 189px;
          left: 50px;
        }
        > p:nth-of-type(3) {
          top: 48px;
          right: -103px;
        }
        .icon1 {
          width: 57.86px;
          height: 63.34px;
          left: 10px;
          top: 5px;
          background: url(${icon1}) no-repeat center center;
          background-size: 100% 100%;
        }
        .activeIcon1 {
          width: 70.89px;
          height: 86.3px;
          left: 10px;
          top: -17.96px;
          background: url(${activeIcon1}) no-repeat center center;
          background-size: 100% 100%;
        }
        .icon2 {
          width: 57.86px;
          height: 63.34px;
          top: 210px;
          left: 180px;
          background: url(${icon2}) no-repeat center center;
          background-size: 100% 100%;
        }
        .activeIcon2 {
          width: 70.89px;
          height: 86.3px;
          top: 187.04px;
          left: 172px;
          background: url(${activeIcon2}) no-repeat center center;
          background-size: 100% 100%;
        }
        .icon3 {
          width: 59.76px;
          height: 69.9px;
          right: -22px;
          top: 77px;
          background: url(${icon3}) no-repeat center center;
          background-size: 100% 100%;
        }
        .activeIcon3 {
          width: 72.76px;
          height: 92.9px;
          right: -22px;
          top: 54px;
          background: url(${activeIcon3}) no-repeat center center;
          background-size: 100% 100%;
        }
        .title {
          width: 116.99px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          top:62px;
          left:151px;
          span:nth-of-type(1) {
            font-family: "Microsoft YaHei";
            font-size: 18px;
            color:#19B5F3;
            line-height: 29px;
          }
          span:nth-of-type(2) {
            font-family: "PangMenZhengDao";
            font-size: 18px;
            color:#FFFFFF;
          }
        }
      }
    }
  }
`;

function ResourceOverview(props: any) {
  const [resourcesType, setResourcesType] = useState<any>('5GC核心网');
  const [resourcesTitle, setResourcesTitle] = useState<any>('5GC核心网');
  const [business5GC, setBusiness5GC] = useState<any>('');  //5GC左下角数据
  const [childBusiness5GC, setChildBusiness5GC] = useState<any>('');  //5GC地图数据
  const [businessVIMS, setBusinessVIMS] = useState<any>('');  //VIMS左下角数据
  const [childBusinessVIMS, setChildBusinessVIMS] = useState<any>('');  //VIMS地图数据
  const [businessEPC, setBusinessEPC] = useState<any>('');  //移动左下角数据
  const [childBusinessEPC, setChildBusinessEPC] = useState<any>('');  //移动地图数据
  const [sum5GC, setSum5GC] = useState<any>('');  //5GC数量
  const [sumVIMS, setSumVIMS] = useState<any>('');  //VIMS数量
  const [sumECP, setSumECP] = useState<any>('');  //移动数量


  // 切换运营商
  function changeResources(resourcesType: any,resourcesTitle:any,business: any,childBusiness:any) {
    setResourcesType(resourcesType);
    setResourcesTitle(resourcesTitle);
    props.selectedDatas(resourcesType,business,childBusiness)
  }

  function formatSum(num:any) {
    if(num){
      const str = num.toString();
      const reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
      return str.replace(reg,"$1,");
    }else{
      return num;
    }
  }
  
  useEffect(() => {
    getCoreDatas({}).then((res) => {
      if(res.code == '200'){
        console.log(res.data);
        
        let { business5GC,business5GC:{childBusiness5GC},businessVIMS,businessVIMS:{childBusinessVIMS},businessEPC,businessEPC:{childBusinessEPC},sum5G,sumVIMS,sumECP } = res.data
        //5GC数据
        setBusiness5GC(business5GC)
        setChildBusiness5GC(childBusiness5GC)
        props.selectedDatas(resourcesType,business5GC,childBusiness5GC)
        //VIMS数据
        setBusinessVIMS(businessVIMS)
        setChildBusinessVIMS(childBusinessVIMS)
        //移动数据
        setBusinessEPC(businessEPC)
        setChildBusinessEPC(childBusinessEPC)
        //数量
        setSum5GC(sum5G)
        setSumVIMS(sumVIMS)
        setSumECP(sumECP)
      }
    })
  }, []);
  return (
    <>
      <ResourceOverClass>
        <div className="ResourceOverBox">
          <SectionTitle
            title="核心资源总览"
            style={{ width: '440px', marginBottom:resourcesType=='移动核心网'?'28px':'48px', marginLeft: '62px' }}
          />
          <div
            className={
              resourcesType == '5GC核心网'
                ? 'ResourceContentOne'
                : resourcesType == 'vims'
                ? 'ResourceContentTwo':
                resourcesType == '移动核心网'?
                'ResourceContentThree':''
            }
          >
            <div className="bgBox">
              <div className="bgBoxTwo">
                <div
                  className={resourcesType == '5GC核心网' ? 'activeIcon1' : 'icon1'}
                  onClick={() => changeResources('5GC核心网','5GC核心网',business5GC,childBusiness5GC)}
                />
                <div
                  className={resourcesType == 'vims' ? 'activeIcon2' : 'icon2'}
                  onClick={() => changeResources('vims','VIMS',businessVIMS,childBusinessVIMS)}
                />
                <div
                  className={resourcesType == '移动核心网' ? 'activeIcon3' : 'icon3'}
                  onClick={() => changeResources('移动核心网','移动核心网',businessEPC,childBusinessEPC)}
                />
                <div className="title">
                  <span>{resourcesTitle}</span>
                  {resourcesTitle=='5GC核心网'?<span>{formatSum(sum5GC)}</span>:resourcesTitle=='VIMS'?<span>{formatSum(sumVIMS)}</span>:<span>{formatSum(sumECP)}</span>}
                </div>
                <p>5GC核心网</p>
                <p>VIMS</p>
                <p>移动核心网</p>
              </div>
            </div>
          </div>
        </div>
      </ResourceOverClass>
    </>
  );
}

export default ResourceOverview;
