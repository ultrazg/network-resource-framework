// 按钮组组件
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import style from './city-picker.module.scss';
export interface CityPickerProps {
  data: OptionObj[];
  userPicker: OptionObj[]; // 默认值
  setUserPicker: Function; // 用户选择值
  style?: any;
}

export interface OptionObj {
  name: string;
  id: string;
  children?: OptionObj[];
}

const OptionItemBlock = styled.div`
  height: 32px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 32px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #32c5ff;
  }

  &.checked {
    background-color: rgba(44, 58, 105, 1);
  }
`;

const SelectBlock = styled.div`
  height: 100%;
  border-radius: 2px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;

  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255);
  cursor: pointer;
`;
const OptionPickerContainer = styled.div<{
  width: string;
}>`
  position: absolute;
  box-sizing: border-box;
  width: ${(props) => props.width || '160px'};
  background: linear-gradient(180deg,rgba(3,44,94,0.94), rgba(3,26,61,0.94)) !important;
  border: 1px solid #0a61bb !important;
  box-shadow: 0px 8px 8px 0px rgb(2 23 42 / 27%), 0px 0px 6px 1px rgb(16 126 233 / 75%) inset !important;
  border-radius: 2px;
  z-index: 999;
  transition: all 200ms ease;
  transform-origin: top center;
  display: flex;
`;
const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
    color: #134ea0;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(19, 78, 160, 1);
    background: rgba(0, 0, 0, 0.2);
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
`;

export function CityPicker(props: CityPickerProps) {
  const [optionPickerVisible, setOptionPickerVisible] = useState(false);
  const [indexProvinceSelected, setIndexProvinceSelected] = useState(0);
  const [indexCitySelected, setIndexCitySelected] = useState(0);
  const [userPicker, setUserPicker] = useState<OptionObj[]>(props.userPicker);
  useEffect(() => {
    setUserPicker(props.userPicker)
  }, [props.userPicker])
  useEffect(() => {
    const provinceIndex = props.data.findIndex(
      (province) => province.name === userPicker[0].name
    );
    if (provinceIndex !== -1) {
      setIndexProvinceSelected(provinceIndex);
    }
    const cityIndex = citiesList.findIndex(
      (city) => city.name === userPicker[1].name
    );
    if (cityIndex !== -1) {
      setIndexCitySelected(cityIndex);
    }
  }, [userPicker]);

  const citiesList = useMemo(
    () =>
      (props.data &&
        props.data.length > indexProvinceSelected &&
        props.data[indexProvinceSelected].children) || [
        {
          name: '',
          id: '1-1',
          children: [{ name: '', id: '1-1-1' }],
        },
      ],
    [indexProvinceSelected, props.data]
  );

  const districtList = useMemo(
    () =>
      (citiesList &&
        citiesList.length > indexCitySelected &&
        citiesList[indexCitySelected].children) || [
        { name: '全市', id: '1-1-1' },
      ],
    [indexCitySelected, citiesList, props.data]
  );

  useEffect(() => {
    if (!optionPickerVisible) {
      props.setUserPicker(userPicker)
    }
  }, [optionPickerVisible])

  return (
    <div
      onClick={() => {
        setOptionPickerVisible(true);
      }}
      onMouseLeave={() => {
        setOptionPickerVisible(false);
      }}
      className={style['container']}
      style={{ width: '100%'}}
    >
      <SelectBlock>
        <span
          style={{ width: '100%', whiteSpace: 'nowrap', textAlign: 'left', overflow: 'hidden', padding: '0 20px' }}
        >
          {props.userPicker.map((item) => item && item.name).join(' ')}
        </span>
        <div
          style={{
            transform: `rotate(${
              optionPickerVisible ? 180 : 0
            }deg) translate(${optionPickerVisible ? '4px,4px' : '0,0'})`,
            right: '10px',
            top: '45%',
            position: 'absolute',
            width: '0',
            height: '0',
            borderTop: '4px solid #0EDCF4',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
          }}
        ></div>
      </SelectBlock>
      {props.data && (
        <OptionPickerContainer
          id="selection-picker"
          width={(props.style?.width).toString()}
          style={
            optionPickerVisible
              ? { transform: 'scale(1,1)', opacity: '1' }
              : { transform: 'scale(1,0)', opacity: '0' }
          }
        >
          <ColumnContainer>
            {props.data.map((item, index) => (
              <OptionItemBlock
                onClick={(_) => {
                  setIndexProvinceSelected(index);
                  setUserPicker([item, {name: '', id: ''}, {name: '', id: ''}]);
                  setIndexCitySelected(0);
                }}
                className={
                  item.name === userPicker[0].name ? 'checked' : ''
                }
                key={item.id}
              >
                {item.name}
              </OptionItemBlock>
            ))}
          </ColumnContainer>
          <ColumnContainer>
            {citiesList.map((item, index) => (
              <OptionItemBlock
                onClick={(_) => {
                  setIndexCitySelected(index);
                  setUserPicker([
                    props.data[indexProvinceSelected],
                    item,
                    item.children && (item.children as any)[0], //此处选择城市后，要求默认选择全市，故添加此段代码，原值为空字符串''
                  ]);
                }}
                className={
                  item.name === userPicker[1].name ? 'checked' : ''
                }
                key={item.id}
              >
                {item.name}
              </OptionItemBlock>
            ))}
          </ColumnContainer>
          {<ColumnContainer>
            {districtList && districtList.map((item, index) => (
              <OptionItemBlock
                onClick={(_) => {
                  setUserPicker([
                    props.data[indexProvinceSelected],
                    citiesList[indexCitySelected],
                    item,
                  ]);

                  // 选中后关闭下拉，由于这个地方也是一个点击事件，被父级的点击事件覆盖，state置为false后又被置成true，故在此添加延时器
                  let timer = setTimeout(() => {
                    setOptionPickerVisible(false);
                    clearTimeout(timer)
                  }, 300);
                }}
                className={
                  item.name === userPicker[2].name ? 'checked' : ''
                }
                key={item.id}
              >
                {item.name}
              </OptionItemBlock>
            ))}
          </ColumnContainer>}
        </OptionPickerContainer>
      )}
    </div>
  );
}

export default CityPicker;
