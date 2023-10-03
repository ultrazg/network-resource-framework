import {
  Button,
  ButtonContainer,
  Row,
} from '@alpha/app/topic/broadband-2/widgets/gis/gis-component';
import {
  buildingLegendList,
  buttonList,
  deviceLegendList,
  resourceLegendList,
} from '@alpha/app/topic/broadband-2/widgets/gis/constants';
import React, { useEffect, useState } from 'react';

export interface LegendProps {
  setDeviceStatus: React.Dispatch<React.SetStateAction<LegendStatusMapObj>>;
  deviceStatus: LegendStatusMapObj;
}

function LegendContainer(props: LegendProps) {
  // 选择展示的类型
  function handleLegendClick(legendItem: LegendObj) {
    props.setDeviceStatus((prevState) => {
      const temp = JSON.parse(JSON.stringify(prevState));
      // 支持单选
      for (let key in temp) {
        if (key !== legendItem.key) {
          temp[key] = false;
        }
      }
      temp[legendItem.key] = !temp[legendItem.key];
      return temp;
    });
  }

  return (
    <>
      <ButtonContainer
        style={{
          width: '148px',
          bottom: '180px',
        }}
      >
        {deviceLegendList.map((item) => (
          <Button
            onClick={() => {
              handleLegendClick(item);
            }}
            className={props.deviceStatus[item.key] ? 'clicked' : ''}
            key={item.name}
          >
            <img
              className="button-icon"
              src={item.icon}
              alt=""
              width={15}
              height={15}
            />
            <span className="button-text">{item.name}</span>
          </Button>
        ))}
      </ButtonContainer>

      <ButtonContainer
        style={{ width: '148px', bottom: '20px', cursor: 'default' }}
      >
        <span style={{ marginBottom: '8px' }}>资源利用图例</span>
        {resourceLegendList.map((item) => (
          <Row key={item.name}>
            <div
              className="square"
              style={{
                backgroundColor: item.color + '1F',
                borderColor: item.color,
              }}
            ></div>
            <span>{item.name}</span>
          </Row>
        ))}
        <div className="legend-bar">
          {resourceLegendList.map((item, index) => (
            <div
              style={{
                width:
                  index > 0
                    ? item.limit - resourceLegendList[index - 1].limit
                    : item.limit,
                backgroundColor: item.color,
              }}
              key={item.name}
            ></div>
          ))}
        </div>
        <div className="legend-text">
          0
          {resourceLegendList.map((item, index) => (
            <div
              style={{
                marginLeft:
                  index > 0
                    ? item.limit -
                      resourceLegendList[index - 1].limit -
                      15 +
                      'px'
                    : item.limit - 15,
              }}
              key={index}
            >
              {item.limit}%
            </div>
          ))}
        </div>
      </ButtonContainer>
      <ButtonContainer
        style={{
          left: '250px',
          width: '148px',
          bottom: '20px',
        }}
      >
        {buildingLegendList.map((item) => (
          <Button
            onClick={() => {
              handleLegendClick(item);
            }}
            className={props.deviceStatus[item.key] ? 'clicked' : ''}
            key={item.name}
          >
            <img
              className="button-icon"
              src={item.icon}
              alt=""
              width={15}
              height={15}
            />
            <span className="button-text">{item.name}</span>
          </Button>
        ))}
      </ButtonContainer>
    </>
  );
}

export default LegendContainer;
