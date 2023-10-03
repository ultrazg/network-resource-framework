// 按钮组组件
import { useEffect, useState } from 'react';
import styled from 'styled-components';
export interface SelectProps {
  value?: string;
  setValue: Function;
  children: JSX.Element[];
  style?: any;
}
export interface OptionProps {
  value: string;
  children?: any;
  setCurrent?: Function;
  checked?: boolean;
}
const OptionItemBlock = styled.div`
  height: 32px;
  padding: 0 12px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 32px;
  cursor: pointer;
  &:hover {
    color: #32c5ff;
  }
  &.checked {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;
export function Option(props: OptionProps) {
  return (
    <OptionItemBlock
      onClick={(_) => {
        props.setCurrent && props.setCurrent(props.value);
      }}
      className={props.checked ? 'checked' : ''}
    >
      {props.children}
    </OptionItemBlock>
  );
}

const SelectBlock = styled.div`
  height: 32px;
  padding: 0 12px;
  border: 1px solid #1765ad;
  box-shadow: 0 0 22px 0 rgba(60, 154, 232, 0.2);
  border-radius: 2px;
  background: #0c1d5f;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;

  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255);
  line-height: 32px;
  cursor: pointer;

  &:hover {
    color: #32c5ff;
  }
`;
const OptionPicker = styled.div<{
  width: string;
}>`
  position: absolute;
  width: ${(props) => props.width || '160px'};
  background: #0c1d5f;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.32);
  border-radius: 2px;
  z-index: 999;
  transition: all 200ms ease;
  transform-origin: top center;
`;
export function Select(props: SelectProps) {
  const [currentSelect, setCurrentSelect] = useState(props.value);
  const [optionPickerVisible, setOptionPickerVisible] = useState(false);
  useEffect(() => {
    props.setValue(currentSelect);
    setOptionPickerVisible(false);
  }, [currentSelect]);

  useEffect(() => {
    setCurrentSelect(props.value);
  }, [props.value]);

  return (
    <div
      onClick={() => {
        setOptionPickerVisible(true);
      }}
      onMouseLeave={() => {
        setOptionPickerVisible(false);
      }}
      style={props?.style}
    >
      <SelectBlock>
        <span style={{ width: '100%' }}>
          {
            props.children.find((item) => {
              return item.props.value === props.value;
            })?.props.children
          }
        </span>
        <div
          style={{
            transform: `rotate(${
              optionPickerVisible ? 45 : 225
            }deg) translate(${optionPickerVisible ? '4px,4px' : '0,0'})`,
            borderTop: '1px solid white',
            borderLeft: '1px solid white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            width: '8px',
            height: '8px',
            marginTop: '8px',
          }}
        ></div>
      </SelectBlock>
      <OptionPicker
        id="selection-picker"
        width={props.style?.width}
        style={
          optionPickerVisible
            ? { transform: 'scale(1,1)', opacity: '1' }
            : { transform: 'scale(1,0)', opacity: '0' }
        }
      >
        {props.children.map((item) => (
          <Option
            key={item.props.value}
            value={item.props.value}
            setCurrent={setCurrentSelect}
            checked={props.value === item.props.value}
          >
            {item.props.children}
          </Option>
        ))}
      </OptionPicker>
    </div>
  );
}
export default Select;
