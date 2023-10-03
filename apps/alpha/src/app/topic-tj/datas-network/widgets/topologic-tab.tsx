import styled from 'styled-components';
import { useState,useEffect } from 'react';
import { replaceProvince } from '@alpha/app/topic-tj/utils/commFunc';
import { simplifyProvinceName } from 'apps/alpha/src/utils/commFunc';
import bgImg from '../../wireless-network/images/crumbs.svg';
import arrow1 from '../../datas-network/images/arrow1.png';
import arrow2 from '../../datas-network/images/arrow2.png';

const Wrapper = styled.div`
  position: relative;
  pointer-events: auto;
  margin:-10px 0 20px 318px;
  width: 266.23px;
  height: 52px;
  background: url(${bgImg}) center no-repeat;
  font-size: 16px;
  z-index:1001;
  .country {
    position: absolute;
    top: 19px;
    left: 20px;
    color: #0091ff;

    &:hover {
      cursor: pointer;
    }
  }
  .arrow {
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 1px solid #0091ff;
    border-width: 1px 0 0 1px;
    position: relative;
    top: 2px;
    &.arrow-right {
      transform: rotate(135deg);
    }
    &.arrow-up {
      transform: rotate(45deg);
    }
    &.arrow-down {
      transform: rotate(225deg);
      top: -2px;
      border-color: #3DFBFF;
    }
  }
  .province {
    position: absolute;
    top: 19px;
    left: 80px;
    color: #00fcff;
    display: flex;
    align-items: center;
    height: 20px;
    span{
      margin: 0 13px 0 0;
    }
    &:hover {
      cursor: pointer;
    }
    &.hadCity{
      color: #0091ff;
    }
  }
  .cities {
    position: absolute;
    top: 19px;
    left: 144px;
    color: #00fcff;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    .tj-iconfont{
      color: #0091FF;
      font-size: 16px;
    }
    .openOptions{
      font-size: 14px;
      &.icon-xiajiantou{
        color: #3DFBFF;
      }
    }
    .citiesName{
      margin: 0 10px;
      white-space:nowrap;
    }
  }
  .select-box{
    position: absolute;
    width: 340px;
    background: rgba(5,31,66,0.90);
    box-shadow: inset 0 0 16px 0 rgba(0,218,255,0.18);
    top: 60px;
    left: 0;
    overflow: hidden;
    padding: 24px 0 0 24px;
    box-sizing: border-box;
    .select-name{
      cursor: pointer;
      float: left;
      width: 52px;
      font-size: 14px;
      color: #A2C8EF;
      font-family: FZZD;
      line-height: 18px;
      margin: 0 0 20px 0;
      &.on{
        color: #00EBEA;
      }
    }
  }
`;


const Tab = styled.div`
    position:relative;
    z-index:1000;
    .title-cont{
        margin-top:15px;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        margin:0 0 20px 318px;
        display: inline-block;
        background-image: linear-gradient(270deg, rgba(28,142,255,0.00) 0%, rgba(28,142,255,0.21) 100%);
        span{
            font-size: 14px;
            font-family: FZZDHJW--GB1-0, sans-serif;
            color: #fff;
            text-align: center;
            line-height: 18px;
            font-weight: 400;
            position: relative;
            padding: 0 20px;
            margin-right: 20px;
            cursor: pointer;  
            &::before,&::after{
              position: absolute;
              top:4px;
              content: '';
              width: 11px;
              height: 10px;
              background: url(${arrow1}) no-repeat center center;
              background-size: 100% 100%;
            }
            &::after{
              right: 0;
            }
            &::before{
              left: 0;
              transform: rotate(180deg);
            }
          }
          .activeClass{
            position: relative;
            padding: 0 20px;
            color: #3DFBFF !important;
            &::before,&::after{
              position: absolute;
              top:4px;
              content: '';
              width: 11px;
              height: 10px;
              background: url(${arrow2}) no-repeat center center;
              background-size: 100% 100%;
            }
            &::after{
              right: 0;
            }
            &::before{
              left: 0;
              transform: rotate(180deg);
            }
        }
    }
`;
const OptionPickerContainer = styled.div`
  position: absolute;
  top: 60px;
  box-sizing: border-box;
  min-width: max-content;
  background: rgba(5,31,66,0.90);
  box-shadow: inset 0 0 16px 0 rgba(0,218,255,0.18);
  border-radius: 2px;
  z-index: 999;
  transition: all 200ms ease;
  transform-origin: top center;
  display: flex;
  flex-wrap: wrap;
  padding: 24px 0 0 24px;
`;

const OptionItemBlock = styled.div`
  height: 18px;
  text-align: left;
  font-weight: 0;
  font-size: 14px;
  color: #A2C8EF;
  letter-spacing: 1.75px;
  line-height: 18px;
  cursor: pointer;
  white-space: nowrap;
  font-family: FZZDHJW, sans-serif;
  min-width: 16.66%;
  margin: 0 0 20px 0;
  &:hover {
    color: #00EBEA;
  }

  &.checked {
    color: #00EBEA;
  }
`;
function NetworkTab(props:any){
    const [currentItem, setCurrentItem] = useState<any>('城域网');
    const [optionPickerVisible, setOptionPickerVisible] = useState(false);
    const [selectProvinceIndex, setSelectProvinceIndex] = useState<number>(0);
    const [showProvinceSelect, setShowProvinceSelect] = useState<boolean>(false);
    const changeProvince = (item:any,index:number) => {
      setSelectProvinceIndex(index);
      props.setProvinceName(item.properties.name);
      props.setProvinceId(item.properties.id + '0000000000');
      setShowProvinceSelect(false);
    };
    const provinceFn = () => {
      if(props.showFlag && props.showFlag == 1){
        setShowProvinceSelect(!showProvinceSelect);
      }
      else{
        props.toggleCompHandle(1);
      }
    }
    const ChangeList = (pro: string, eqpTypeId:string) => {
        setCurrentItem(pro)
        props.setEqpTypeIdHandle(eqpTypeId);
        let value = eqpTypeId=='24000008'?1:eqpTypeId=='87770272'?3:2
        props.changeTab(value);
    };
    useEffect(() => {
      if(props.province && props.province.length>0 && props.provinceName){
        props.province.forEach((item:any,index:number) => {
          if(item.properties.name == props.provinceName){
            setSelectProvinceIndex(index);
          }
        });
      }
    }, [props.province]);
    return (
    <>
    <Wrapper>
        <div
          className="country"
          onClick={() => {
            props.toggleCompHandle(0);
          }}
        >
          全国
        </div>
        <div
          className={`province ${!!props.citiesName && 'hadCity'}`}
          onClick={() => {
            provinceFn()
          }}
        >
          <span>{props.provinceName}</span>
          {props.showFlag && props.showFlag==1 && <i className={`${showProvinceSelect ? 'arrow arrow-down' : 'arrow arrow-up'}`}></i>}
        </div>
        {props.citiesName &&
        <div
          className="cities"
          onClick={() => {
            setOptionPickerVisible(!optionPickerVisible)
          }}
        >
          <em className={`tj-iconfont icon-youjiantou`}/>
          <span className="citiesName">{props.citiesName}</span>
          <em
            className={`openOptions tj-iconfont ${optionPickerVisible ? 'icon-xiajiantou' : 'icon-shangjiantou'}`}
          />
        </div>}
        <OptionPickerContainer
          id="selection-picker"
          style={
            optionPickerVisible
              ? { transform: 'scale(1,1)', opacity: '1' }
              : { transform: 'scale(1,0)', opacity: '0' }
          }
        >
            {props.citiesItems && props.citiesItems.map((item: any, index: number) => (
              <OptionItemBlock
                onClick={(_) => {
                  props.handleSelectCities(item)
                  setOptionPickerVisible(false)
                }}
                className={
                  item.name === replaceProvince(props.citiesName) ? 'checked' : ''
                }
                key={item.id}
              >
                {item.name}
              </OptionItemBlock>
            ))}
        </OptionPickerContainer>
        {/* 省选择框 */}
        {showProvinceSelect && <div className="select-box">
          {props.province.length>0 && props.province.map((item: any, index: number) => {
              return (
              <div key={index} className={`${selectProvinceIndex == index ? 'on select-name' : 'select-name'}`} onClick={() => changeProvince(item,index)}>{simplifyProvinceName(item.properties.name)}</div>
              );
            })
            }
        </div>
        }
    </Wrapper>
    <Tab>
        <div className='title-cont'>
            <span className={currentItem == '城域网' ? 'activeClass' : ''} onClick={() => ChangeList('城域网','24000008')}>
            城域网
            </span>
            <span className={currentItem == 'IPRAN' ? 'activeClass' : ''} onClick={() => ChangeList('IPRAN','87770251')}>
            IPRAN
            </span>
            <span className={currentItem == '智能城域网' ? 'activeClass' : ''} onClick={() => ChangeList('智能城域网','87770272')}>
            智能城域网
            </span>
        </div>
    </Tab>
    </>
    )
}

export default NetworkTab;