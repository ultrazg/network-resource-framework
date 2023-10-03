import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import './domain-indicator.module.scss';
import itemIcon1 from '@alpha/assets/icons/icon1.svg';
import itemIcon2 from '@alpha/assets/icons/icon2.svg';
import itemIcon3 from '@alpha/assets/icons/icon3.svg';
import itemIcon4 from '@alpha/assets/icons/icon4.svg';
import arrowIcon from '@alpha/assets/icons/arrow-left.svg';
import useCSS3DRenderer from './useCSS3DRenderer';
import SectionTitle from '@alpha/app/components/section-title/section-title';
import cardTitleBg from '@alpha/assets/images/cardtitle.png';
import coreImg from '@alpha/assets/images/core.svg';
import useSwitchAction from './useSwitchAction';
import { fetchReduxChinaMap } from '@alpha/app/redux/china-map.slice';
import { shallowEqual, useDispatch } from 'react-redux';
import {
  fetchResIndicator,
  ResIndicatorResp,
  ResType,
} from '@alpha/api/resIndicator';
import {
  reduxProTargetActions,
  selectAutoSwitch,
} from '@alpha/app/redux/pro-target.slice';
import { useSelector } from 'react-redux';
import { convertMeasure } from '@alpha/utils/commFunc';

import IDCResourceView from '@alpha/app/topic/idc-resource-analysis/idc-resource-analysis';
import Transmission from '@alpha/app/topic/transmission/transmission';
import { OUT_URL } from '@alpha/utils/constants';
import International from '@alpha/app/topic/international/international';
import { getTopicUrl } from '@alpha/app/routes';

/* eslint-disable-next-line */
export interface DomainIndicatorProps {
  jump?: (src: string, name: string) => void;
  show: Function;
}

function Icon(props: { src: string; className?: string }) {
  return (
    <img
      className={props.className}
      src={props.src}
      alt="icon"
      width="14px"
      height="14px"
    />
  );
}
export const HeadMainWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  & > * {
    flex: 1 1 100%;
    &:nth-child(1) {
      flex: 0;
    }
  }
`;

const selectSpaceIndicator = (data: ResIndicatorResp['data']) => {
  const spaceData = data.spcRes ?? {};
  return {
    key: 'spcRes',
    name: '空间资源',
    num: spaceData.total,
    children: [
      {
        key: 'room',
        name: OUT_URL.room.title,
        num: spaceData.roomCount,
        url: OUT_URL.room.url,
      },
      {
        key: 'station',
        name: '局站',
        num: spaceData.stationCount,
      },
      {
        key: 'building',
        name: OUT_URL.building.title,
        num: spaceData.buildingCount,
        url: OUT_URL.building.url,
      },
      {
        key: 'address',
        name: '标准地址',
        num: spaceData.addrSegmCount,
      },
    ],
  };
};

const selectOptNetIndicator = (data: ResIndicatorResp['data']) => {
  const optNetData = data.optNet ?? {};
  return {
    key: 'optNet',
    title: '光缆网',
    name: OUT_URL.opticalNet.title,
    num: optNetData.total,
    url: OUT_URL.opticalNet.url,
    children: [
      {
        key: 'trunk1',
        name: '一干光缆',
        num: optNetData.firstClassTrunkOptLength,
        unit: '公里',
      },
      {
        key: 'trunk2',
        name: '二干光缆',
        num: optNetData.secondClassTrunkOptLength,
        unit: '公里',
      },
      {
        key: 'local',
        name: '本地网中继',
        num: optNetData.localOptLength,
        unit: '公里',
      },
      {
        key: 'inputopt',
        name: '接入段光缆',
        num: optNetData.inputOptLength,
        unit: '公里',
      },
    ],
  };
};

const selectDataNetIndicator = function (data: ResIndicatorResp['data']) {
  const dataNetData = data.dataNet ?? {};
  return {
    key: 'dataNet',
    name: OUT_URL.dataNet.title,
    num: dataNetData.total,
    component: getTopicUrl('数据网'),
    url: '1',
    children: [
      {
        key: 'manrouter',
        name: '城域网<br/>设备',
        num: dataNetData.areaNetNum,
      },
      {
        key: '169router',
        name: '169骨干网<br/>设备',
        num: dataNetData.trunkNetNum,
      },
      {
        key: 'otnArouter',
        name: 'IP承载A网<br/>设备',
        num: dataNetData.ipBearANum,
      },
      {
        key: 'otnBrouter',
        name: 'IP承载B网<br/>设备',
        num: dataNetData.ipBearBNum,
      },
    ],
  };
};

const selectTrsNetIndicator = (data: ResIndicatorResp['data']) => {
  const trsNetData = data.trsNet ?? {};
  return {
    key: 'trsNet',
    title: '传输网',
    name: OUT_URL.translationNet.title,
    component: getTopicUrl('传输网'),
    num: trsNetData.total,
    url: OUT_URL.translationNet.url,
    children: [
      {
        key: 'rmePort',
        name: '端口',
        num: trsNetData.rmePortCount,
      },
      {
        key: 'trsTrsNe',
        name: '传输网元',
        num: trsNetData.trsTrsNeCount,
      },
      {
        key: 'trsSys',
        name: '传输系统',
        num: trsNetData.trsSysCount,
      },
      {
        key: 'trsCircuit',
        name: '传输电路',
        num: trsNetData.trsCircuitCount,
      },
    ],
  };
};

const selectWirelessIndicator = (data: ResIndicatorResp['data']) => {
  const wirelessData = data.wireNet;
  return {
    key: 'wireNet',
    name: OUT_URL.wirelessNet.title,
    num: wirelessData.total,
    component: getTopicUrl('无线网'),
    url: '1',
    children: [
      {
        key: 'bts',
        name: '2G基站',
        num: wirelessData.btsCount,
      },
      {
        key: 'nodeb',
        name: '3G基站',
        num: wirelessData.nodebCount,
      },
      {
        key: 'enodeb',
        name: '4G基站',
        num: wirelessData.enodebCount,
      },
      {
        key: 'gnodeb',
        name: '5G基站',
        num: wirelessData.gnodebCount,
      },
    ],
  };
};

const selectCoreNetIndicator = (data: ResIndicatorResp['data']) => {
  const coreNetData = data.coreNet ?? {};
  return {
    key: 'coreNet',
    name: OUT_URL.coreNet.title,
    num: coreNetData.coreNet.total,
    // url: OUT_URL.coreNet.url,
    component: getTopicUrl('核心网'),
    title: '核心网',
    url: '1',
    children: [
      {
        key: '5gc',
        name: '5GC',
        num: coreNetData.fifthGenerationCoreTotal,
      },
      {
        key: 'vims',
        name: 'vIMS',
        num: coreNetData.vimsTotal,
      },
      {
        key: 'csps',
        name: 'CS+PS',
        num: coreNetData.csAndPsTotal,
      },
      {
        key: 'epc',
        name: 'EPC',
        num: coreNetData.epcAndNbTotal,
      },
    ],
  };
};

const selectAccessNetIndicator = (data: ResIndicatorResp['data']) => {
  const accessNetData = data.accessNet ?? {};
  return {
    key: 'accessNet',
    name: '宽带资源',
    num: accessNetData.total,
    component: getTopicUrl('宽带资源'),
    url: '1',
    children: [
      {
        key: 'ponport',
        name: 'PON端口',
        num: accessNetData.ponPortNum,
      },
      {
        key: 'onu',
        name: 'ONU设备',
        num: accessNetData.onuEqpNum,
      },
      {
        key: 'olt',
        name: 'OLT设备',
        num: accessNetData.oltEqpNum,
      },
      {
        key: 'obd',
        name: 'OBD',
        num: accessNetData.obdNum,
      },
    ],
  };
};

const selectIntlIndicator = (data: ResIndicatorResp['data']) => {
  const intlData = data.internationalRes ?? {};
  return {
    key: 'internationalRes',
    name: '国际资源',
    num: intlData.total,
    component: getTopicUrl('国际资源'),
    title: '国际资源专题',
    url: '1',
    children: [
      {
        key: 'submarine',
        name: '海缆',
        num: intlData.seaCableCount,
      },
      {
        key: 'land',
        name: '陆缆',
        num: intlData.landCableCount,
      },
      {
        key: 'trsNe',
        name: '传输网元',
        num: intlData.trsNeCount,
      },
      {
        key: 'transmission',
        name: '电路',
        num: intlData.transmissionCount,
      },
    ],
  };
};

const selectIdcIndicator = (data: ResIndicatorResp['data']) => {
  const idcData = data.idcRes ?? {};
  return {
    key: 'idcRes',
    name: 'IDC资源',
    num: idcData.total,
    component: getTopicUrl('IDC资源'),
    title: 'IDC资源运营视图',
    url: '1',
    children: [
      {
        key: 'station',
        name: '局站',
        num: idcData.station,
      },
      {
        key: 'room',
        name: '机房',
        num: idcData.room,
      },
      {
        key: 'rack',
        name: '机架',
        num: idcData.rack,
      },
      {
        key: 'rackusage',
        name: '机架利用率',
        num:
          idcData.usedRack == null || idcData.rack == null
            ? NaN
            : Number(((idcData.usedRack * 100) / idcData.rack).toFixed(2)),
        unit: '%',
      },
    ],
  };
};

const ResKey2TypeMap: { [key: string]: ResType } = {
  spcRes: 'SPC_RES',
  optNet: 'OPT_NET',
  dataNet: 'DATA_NET',
  trsNet: 'TRS_NET',
  wireNet: 'WIRE_NET',
  coreNet: 'CORE_NET',
  accessNet: 'ACCESS_NET',
  internationalRes: 'INTERNATIONAL_RES',
  idcRes: 'IDC_RES',
};

export function DomainIndicator(props: DomainIndicatorProps) {
  const { jump } = props;
  const [data, setData] = useState<
    {
      key: string;
      name: string;
      num: number;
      children: any[];
      component?: JSX.Element | string;
      title?: string;
    }[]
  >([]);
  const indicatorListRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const autoSwitch = useSelector(selectAutoSwitch);
  const {
    camera,
    scene,
    renderer,
    render,
    setContainer,
    setElements,
    loaded,
    setLoaded,
  } = useCSS3DRenderer(1000, 400);
  const { start, setAutoTransit } = useSwitchAction(
    scene,
    renderer,
    render,
    (focusEle: HTMLElement) => {
      // 卡片简化
      focusEle?.classList.remove('focus');
    },
    (focusEle: HTMLElement, index: number) => {
      focusEle?.classList.add('focus');

      if (index >= 0) {
        dispatch(
          reduxProTargetActions.changeResType(ResKey2TypeMap[data[index].key])
        );
        dispatch(fetchReduxChinaMap({ profess: data[index].key }));
      }
    },
    /** 当前卡片的事件回调 */
    {
      click: (e: Event, index: number) => {
        if (!jump) {
          return;
        }
        const target = e.target as HTMLElement;
        if (
          target.classList.contains('title') &&
          target.classList.contains('linkable')
        ) {
          console.log('击中了1:', data[index]);
          if (data[index].component) {
            props.show(data[index].component);
            return;
          }
          target.dataset['url'] &&
            jump(target.dataset['url'], data[index].title || data[index].name);
          return;
        }
        let ele: HTMLElement | null = target;
        while (ele !== e.currentTarget && !ele?.classList.contains('subitem')) {
          ele = ele?.parentElement ?? null;
        }
        if (
          ele &&
          ele !== e.currentTarget &&
          ele.classList.contains('linkable')
        ) {
          console.log('击中了2:', ele.dataset['url']);
          ele.dataset['url'] &&
            jump(ele.dataset['url'], `${ele.dataset['title']}`);
          return;
        }
      },
    }
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setContainer(container);
    }
    // 请求数据
    (async () => {
      try {
        const res = await fetchResIndicator();
        const { code, data } = res;
        if (code !== 200) {
          return;
        }
        const arr = [
          selectSpaceIndicator,
          selectOptNetIndicator,
          selectDataNetIndicator,
          selectTrsNetIndicator,
          selectWirelessIndicator,
          selectCoreNetIndicator,
          selectAccessNetIndicator,
          selectIntlIndicator,
          selectIdcIndicator,
        ].map((_) => _(data));
        setData(arr);
      } catch (e) {
        return;
      }
    })();
  }, []);

  useEffect(
    function () {
      if (indicatorListRef.current) {
        setLoaded(false);
        setElements(
          Array.from(
            indicatorListRef.current.children as HTMLCollectionOf<HTMLElement>
          )
        );
      }
    },
    [data]
  );

  useEffect(() => {
    if (loaded) {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    setAutoTransit(autoSwitch);
  }, [autoSwitch]);

  return (
    <HeadMainWrapper>
      <SectionTitle mainTitle="资源专业指标" subTitle="" right />
      {loaded ? null : <LoadingTxt text="加载中..." />}
      <div ref={containerRef}></div>
      <div
        style={{ position: 'absolute', display: 'none' }}
        ref={indicatorListRef}
      >
        {data.map((item, index) => (
          <IndicatorCard {...item} index={index} subItems={item.children} />
        ))}
      </div>
    </HeadMainWrapper>
  );
}

type IndicatorCardProps = {
  index: number;
  key: string;
  name: string;
  num?: number;
  unit?: string;
  url?: string;
  subItems?: {
    key: string;
    name: string;
    num?: number;
    unit?: string;
    icon?: JSX.Element;
    url?: string;
    component?: JSX.Element;
    title?: string;
  }[];
};

const StyledHeadMainWrapper = styled(HeadMainWrapper)<{
  index: number;
}>`
  // width: ${(props) => (props?.index === 4 ? '300px' : '200px')};
  width: 175px;
  height: auto;
  color: #fff;
  background: rgba(12, 55, 92, 0.7);
  border: 2px solid rgba(0, 173, 255, 0.7);
  box-shadow: inset 0 0 20px rgba(0, 173, 255, 1);
  border-radius: 4px;
  // cursor: pointer;

  &&&.focus {
    transform: scale(1.2, 1.2);

    .list {
      max-height: 210px;
    }
  }

  && .header {
    display: flex;
    justify-content: center;

    .title {
      display: block;
      width: 60%;
      color: #00feff;
      font-size: 14px;
      text-align: center;
      height: 36px;
      line-height: 32px;
      letter-spacing: 2px;
      background: url(${cardTitleBg}) center/100% 100% no-repeat;
      padding: 0;
      margin-top: -9px;

      &.linkable {
        cursor: pointer;
        &:hover {
          text-decoration: underline 2px;
        }
      }
    }
  }

  && .content {
    padding: 0 5px;

    .total {
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-family: 'PMZD', sans-serif;
      padding: 0 0 5px;
      color: #fff;
    }

    .list {
      max-height: 0;
      overflow: hidden;
      transition: max-height 1s ease-out;
    }
    .bg {
      background: url(${coreImg}) center / 50px 50px no-repeat;
    }
    .subitem-list {
      display: grid;
      box-sizing: border-box;
      grid-template-columns: 1fr 1fr;
      grid-auto-flow: row;
      grid-row-gap: 5px;
      grid-column-gap: 5px;
      list-style: none;
      padding: 0;
      margin: 0 0 5px;
      mask: radial-gradient(circle, transparent 22px, #fff 0);
      animation: fade 2s forwards ease-out;

      .subitem {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: space-between;
        font-size: 12px;
        line-height: 1.5;
        border: solid 1px #004fab;
        background: rgba(5, 28, 93, 0.5);
        padding: 2px 5px;
        position: relative;
        overflow: hidden;

        &.linkable {
          cursor: pointer;
          &:hover,
          &:active {
            background: #1479a3;
          }
        }

        &.empty {
          visibility: hidden;
        }
        &:nth-child(even) {
          align-items: flex-end;
        }

        &:nth-child(3n),
        &:nth-child(4n) {
          flex-direction: column-reverse;
        }

        .value {
          color: #9dff00;
          font-family: 'CAI300', 'CAI290';
          white-space: nowrap;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .name {
          color: #00fcff;
          font-family: 'IBMPlexMono-Regular';
          transform: scale(0.9);
          line-height: 1.2;
        }

        &:nth-child(2n) {
          text-align: right;
        }
        .linkage {
          position: absolute;
          transform: rotate(180deg);
          width: 50px;
          height: 50px;
        }

        &::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          background-color: transparent;
          border-radius: 50%;
          border: solid 1px #004fab;
        }
        &:nth-child(4n + 1) {
          .name {
            transform-origin: left bottom;
          }
          &::after {
            right: -22px;
            bottom: -23px;
          }
          .linkage {
            right: -10px;
            top: -10px;
          }
        }
        &:nth-child(4n + 2) {
          .name {
            transform-origin: right bottom;
          }
          &::after {
            left: -22px;
            bottom: -23px;
          }
          .linkage {
            left: -10px;
            top: -10px;
          }
        }
        &:nth-child(4n + 3) {
          .name {
            transform-origin: left top;
          }
          &::after {
            right: -22px;
            top: -23px;
          }
          .linkage {
            right: -10px;
            bottom: -10px;
          }
        }
        &:nth-child(4n + 4) {
          .name {
            transform-origin: right top;
          }
          &::after {
            left: -22px;
            top: -23px;
          }
          .linkage {
            left: -10px;
            bottom: -10px;
          }
        }
      }
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
function getCharLength(str: string) {
  let n = 0;
  const arr = [...str],
    len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i].charCodeAt(0) > 0xff) {
      n += 2;
    } else {
      n++;
    }
  }
  return n;
}

function IndicatorCard(props: IndicatorCardProps) {
  const { index, name, num, unit = '', subItems = [], url } = props;
  const [tNum, tUnit] = convertMeasure(num);
  const numTxt = Number.isFinite(tNum)
    ? tNum.toLocaleString() + tUnit + unit
    : '--';
  let items = subItems;
  if (subItems.length < 4) {
    const fillItems = Array.from({ length: 4 - subItems.length }).map(
      (_, index) => ({
        key: index + '',
        name: '',
        num: 0,
      })
    );
    items = [...subItems, ...fillItems];
  }
  const tItems = items.map((item) => {
    const [tNum, tUnit] = convertMeasure(item.num);
    const numTxt = Number.isFinite(tNum)
      ? tNum.toLocaleString() + tUnit + (item.unit ?? '')
      : '--';
    return {
      ...item,
      tUnit,
      numTxt,
    };
  });
  if (tItems.some((item) => getCharLength(item.numTxt) > 10)) {
    tItems.forEach((item) => {
      if (getCharLength(item.numTxt) > 1) {
        const unitLen = item.unit?.length || item.tUnit.length;
        item.numTxt = [
          item.numTxt.slice(0, -unitLen),
          item.unit || item.tUnit || '',
        ].join('<br/>');
      } else {
        item.numTxt = [item.numTxt, ''].join('<br/>');
      }
    });
  }
  return (
    <StyledHeadMainWrapper index={index}>
      <div className="header">
        <span
          className={`title${url ? ' linkable' : ''}`}
          data-url={url}
          data-tile={name}
        >
          {name}
        </span>
      </div>
      <div className="content">
        <span className="total">{numTxt}</span>
        <div className="list">
          <div className="bg">
            {!!tItems.length && (
              <ul className="subitem-list">
                {tItems.map((item, index) => (
                  <li
                    className={`subitem${
                      item.url || item.component ? ' linkable' : ''
                    }${item.name ? '' : ' empty'}`}
                    key={item.key}
                    data-url={item.url}
                    data-title={item.title || item.name}
                  >
                    <span
                      className="value"
                      dangerouslySetInnerHTML={{ __html: item.numTxt }}
                    ></span>
                    <span
                      className="name"
                      dangerouslySetInnerHTML={{ __html: item.name || 'test' }}
                    ></span>
                    {item.url || item.component ? (
                      <Icon src={arrowIcon} className="linkage" />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </StyledHeadMainWrapper>
  );
}
export default DomainIndicator;

const LoadingTxtWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'PMZD', sans-serif;
`;

const fadeInout = keyframes`
  from {
    filter: blur(0px);
  }
  to {
    filter: blur(4px);
  }
`;

const AnimateTxt = styled.span<{ index: number }>`
  filter: blur(0px);
  animation: ${(props) =>
    `blur-text 1s ${props.index * 0.2}s infinite linear alternate`};

  @keyframes blur-text {
    0% {
      filter: blur(0px);
    }
    100% {
      filter: blur(4px);
    }
  }
`;

export function LoadingTxt(props: { text: string }) {
  const { text } = props;
  const charList = text.split('');
  return (
    <LoadingTxtWrap>
      {charList.map((char, index) => (
        <AnimateTxt key={`di-${index}`} index={index}>
          {char}
        </AnimateTxt>
      ))}
    </LoadingTxtWrap>
  );
}
