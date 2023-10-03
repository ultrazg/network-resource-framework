import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import './resource-quality-v2.module.scss';
import plateL1Bg from '@alpha/assets/images/plateL1.svg';
import plateL2Bg from '@alpha/assets/images/plateL2.svg';
import marble from '@alpha/assets/icons/marble.svg';
import quanlityTitleBg from '@alpha/assets/quanlity-title.svg';
import { useEffect, useRef, useState } from 'react';
import usePartialWheel from './usePartialWheel';
import * as THREE from 'three';
import { fetchResQt, ResType } from '@alpha/api/resIndicator';
import { LoadingTxt } from '../domain-indicator/domain-indicator';
import { OUT_URL } from '@alpha/utils/constants';
import SectionTitle from '@alpha/app/components/section-title/section-title';

// 通建三方页面
import QualityBoardView from '@alpha/app/topic-tj/quality-board/quality-board';

/* eslint-disable-next-line */
export interface ResourceQualityV2Props {
  resType?: ResType;
  jump?: (src: string, name: string) => void;
  show?: Function;
}

const Wrapper = styled.div`
  height: 100%;
  color: #fff;

  .center {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .overview {
    width: 480px;
    height: 180px;
    margin-top: 1px;
    z-index: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    .name {
      position: absolute;
      left: 70px;
      top: 60px;
      width: 80px;
      font-size: 18px;
      color: #2eb5ff;
      font-family: 'FZZD', sans-serif;
      text-align: right;
    }

    .value {
      color: #36e6e9;
      line-height: 60px;
      font-size: 48px;
      font-family: 'CAI300', 'CAI290';
    }

    .label {
      color: #a4c6f9;
      font-size: 24px;
      font-family: 'FZZD', sans-serif;
    }

    .linkable {
      cursor: pointer;
      &:hover {
        text-decoration: underline 2px;
      }
    }
  }

  .container {
    height: 100%;
    background: url(${plateL2Bg}) center 30% / 80% 60% no-repeat,
      url(${plateL1Bg}) center bottom / 100% 150px no-repeat;

    > div {
      overflow: visible !important;
    }
  }
`;
export const CanvasSrcWrapper = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  display: none;
  overflow: hidden;
`;

export function ResourceQualityV2(props: ResourceQualityV2Props) {
  const { resType, jump, show } = props;
  const defalutData = {
    key: '',
    label: '资源质量',
    value: '...',
    subitems: [],
  };
  const [data, setData] = useState<{
    label: string;
    value: string;
    key: string;
    subitems: {
      key: string;
      label: string;
      value: string;
    }[];
  }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const qualitySubItemsRef = useRef<HTMLDivElement>(null);
  const { setContainer, setElements } = usePartialWheel(
    420,
    5,
    new THREE.Vector3(0, 130, 680),
    new THREE.Vector3(0, -100, 0)
  );
  const navigate = useNavigate();
  const resObj: { [key: string]: string } = {
    SPC_RES: '空间资源',
    OPT_NET: '光缆网',
    DATA_NET: '数据网',
    TRS_NET: '传输网',
    WIRE_NET: '无线网',
    CORE_NET: '核心网',
    ACCESS_NET: '接入网',
    INTERNATIONAL_RES: '国际资源',
    IDC_RES: 'IDC资源',
  };

  const getName = (key: string): string => {
    return resObj[key];
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, []);

  useEffect(() => {
    // fetch api
    setData(undefined);
    if (!resType) {
      return;
    }
    (async function () {
      try {
        const res = await fetchResQt(resType);
        const { code, data } = res;
        if (code !== 200) {
          setData(undefined);
          return;
        }
        const qt = {
          label: '资源质量',
          value: Number.isFinite(data.rate) ? `${data.rate}%` : '--',
          key: resType,
          subitems: data.indicatorData.map((qtItem) => ({
            key: qtItem.id + '',
            label: qtItem.indicatorName,
            value: Number.isFinite(qtItem.rate) ? `${qtItem.rate}%` : '- -',
          })),
        };
        setData(qt);
      } catch (e) {
        setData(undefined);
      }
    })();
  }, [resType]);

  useEffect(() => {
    if (qualitySubItemsRef.current) {
      setElements(
        Array.from(
          qualitySubItemsRef.current.children as HTMLCollectionOf<HTMLElement>
        )
      );
    }
  }, [data]);

  return (
    <Wrapper>
      <SectionTitle
        mainTitle="数据治理"
        subTitle=""
        right
        style={{ width: '500px', marginBottom: '10px' }}
      ></SectionTitle>
      <div className="overview center">
        {data ? (
          <>
            <span className="name">{getName(data.key)}</span>
            <span className="value">{data.value}</span>
            <span
              className={'label' + (jump ? ' linkable' : '')}
              onClick={() => {
                navigate('/topic/qualityBoard');
              }}
            >
              {data.label}
            </span>
          </>
        ) : (
          <LoadingTxt text="..." />
        )}
      </div>
      <div className="container" ref={containerRef}></div>
      <CanvasSrcWrapper>
        <div ref={qualitySubItemsRef}>
          {(data?.subitems ?? []).map((item, index) => (
            <QtIndicator {...item} key={item?.key + item.label} />
          ))}
        </div>
      </CanvasSrcWrapper>
    </Wrapper>
  );
}

type QtIndicatorProps = {
  label: string;
  value: string;
};

const StyledSubItem = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  .value {
    font-family: 'PMZD', sans-serif;
    font-size: 18px;
    width: 80px;
    height: 80px;
    background: url(${marble}) center/100% 100% no-repeat;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .label {
    color: #00fcff;
    font-size: 14px;
  }
`;

function QtIndicator(props: QtIndicatorProps) {
  return (
    <StyledSubItem>
      <span className="value">{props.value}</span>
      <span className="label">{props.label}</span>
    </StyledSubItem>
  );
}

export default ResourceQualityV2;
