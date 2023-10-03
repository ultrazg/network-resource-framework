// 网络健壮性组件
import styled from 'styled-components';
import Icon4G from '../images/4G_icon.png';
import Icon5G from '../images/5G_icon.png';
import { useEffect, useState } from 'react';
import { getByKey } from '../../api/wirelessNetwork';
import SectionTitle from '@alpha/app/modal-view/components/section-title';
import * as d3 from 'd3';
import Donut3D from '../layer/Donut3D'
/* eslint-disable-next-line */

interface RatioObj {
  count: string,
  per: string,
  label: string,
  img: string
}

interface PieObj {
  label: string,
  value: number,
  numWan: string,
  selected?: boolean,
  sliced?: boolean
}

interface pieResult {
  rate: string,
  numWan: string,
  num: string,
  type: number | string
}

const NetworkStrongerBox = styled.div`
    height: calc(42.91% - 30px);
    .ratio-group {
      display: flex;
      width: 500px;
      margin-top: 40px;
      .ratio-item {
        flex: 1;
        display: flex;
        font-size: 12px;
        color: #52a9ea;
        text-align: center;
        .icon-wrap {
          position: relative;
          flex-shrink: 0;
          display: flex;
          img {
            width: 90px;
            height: 74px;
          }
          .text {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            margin-bottom: 0;
            font-size: 14px;
            color: #fff;
          }
        }
        .ratio-cont {
          text-align: left;
          p {
            line-height: 21px;
          }
          .value {
            padding-left: 10px;
            font-size: 20px;
            font-weight: 500;
            font-family: 'PangMenZhengDao', sans-serif;
            color: #7affff;
          }
        }
      }
    }
    .pie-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 540px;
      height: 260px;
      padding-left: 20px;

      .select-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        width: 180px;
        .select-item {
          width: 104px;
          background: linear-gradient(180deg,rgba(41,154,224,0),rgba(18,97,190,.56) 54%,rgba(18,97,190,0));
          text-align: center;
          padding: 14px 0;
          box-sizing: border-box;
          margin-bottom: 14px;
          cursor: pointer;
          font-family: PangMenZhengDao,PangMenZhengDao-Regular, sans-serif;
          text-align: center;

          &.active {
            position: relative;
            background: linear-gradient(180deg,rgba(19,207,221,.06),rgba(19,207,221,.6) 53%,rgba(19,207,221,.06));
            &::before,
            &::after {
              content: "";
              position: absolute;
              top: 22px;
              display: block;
              width: 17px;
              height: 16px;
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAAAAXNSR0IArs4c6QAAARZJREFUWEfV2NENgjAQBuDeNO7AJLy7hgZMHEPfncQdWMYabEyt9Hr/XWtS+0gofPkvcAfkGq1x8dNtRyfr5ci68XvfuDy8czRbMY0hK8+G+QHEhqHhcJ3u5725tu8ShdJ8Ll0yNBwv3nmaazFbiC6ZAFlXJSYPwTERUonhIRgmhVRgyhAZs4UYMTKkjMlDDBgMwmN4iBKDQ/KYMkSB0UG2GBkCYvSQFINBAIwNEjE4RMDYIQHzhxChBdgTCc0RSwToQzZI7NAyBECsVdZD0jHhD15oYBL8YMRNw/mBqeOmp0wCT6Q8OnY4GBmTkBPBhuiOhudePie4h0x7PH2hYeVIvoK0N+TOjxA94tV/20JsiMaQut8ST8peJ44UIC2BAAAAAElFTkSuQmCC) no-repeat;
              background-size: 100% auto;
            }
            &::before {
              right: -22px;
              transform: rotate(180deg);
            }
            &::after {
              left: -22px;
            }
          }

          .text {
            font-size: 16px;
            line-height: 18.5px;
            color: #c6e6ff;
          }
          .num {
            font-size: 18px;
            line-height: 20.5px;
            color: #fbffff;
          }
        }
      }
      .pie-chart {
        width: 340px;
        height: 240px;
        .pie3D {
          position: relative;
        }
      }
      .pie-legend {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 26px;
        font-size: 12px;
        font-family: PingFangSC,PingFangSC-Regular, sans-serif;
        font-weight: 400;
        color: #fff;
        .legend {
          margin-left: 16px;
          .icon {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 4px;
            background: #face5a;
            &.icon1 {
              background:#47a5c2;
            }
            &.icon2 {
              background: #60d2e5;
            }
            &.icon3 {
              background: #496ce5;
            }
          }
        }
      }
    }
    path.slice {
      stroke-width: 2px;
    }

    polyline {
        opacity: .3;
        stroke: black;
        stroke-width: 2px;
        fill: none;
    }

    svg text.percent {
        fill: white;
        text-anchor: middle;
        font-size: 12px;
    }

    .tooltip{
      position: absolute;
      padding: 6px 10px;
      font-size: 14px;
      text-align: center;
      border-style: solid;
      border-width: 1px;
      border-color: #20D3FF;
      background: #000;
      color:white;
      border-radius: 3px;

      p {
        margin: 0;
        line-height: 18px;
      }
    }
`;
export function NetworkStronger() {
  const [active, setActive] = useState<number>(0)
  const [ratioData, setRatioData] = useState<RatioObj[]>([
    {
      count: '0',
      per: '0%',
      label: '4G基站',
      img: Icon4G
    },
    {
      count: '0',
      per: '0%',
      label: '5G基站',
      img: Icon5G
    },
  ])
  const [countData, setCountData] = useState<string[]>([])
  const [pieData, setPieData] = useState<any>([])
  useEffect(() => {
    getByKey(
      {
        key: 'wireless_right_top_new'
      }
    )
      .then((result: any): void => {
        const { data } = result
        if (result.code === '200') {
          setRatioData([
            {
              count: data['4G成环数'] || '0',
              per: data['4G成环率'] || '0%',
              label: '4G基站',
              img: Icon4G
            },
            {
              count: data['5G成环数'] || '0',
              per: data['5G成环率'] || '0%',
              label: '5G基站',
              img: Icon5G
            },
          ])

          setCountData(
            [data.successnum || '0', data.failnum || '0']
          )
          const pieArr = ([data.success, data.fali] as pieResult[])
            .map((v: any) => {
              return v.map((ele: any) => {
                const names: string[] = ['', '0-2', '2-5', '5-10', '>10']
                const rate = ele.rate?.substring(0, ele.rate.length - 1)
                const colors = [
                  '',
                  'rgb(255,206,91)',
                  'rgb(8, 208, 228)',
                  'rgb(10, 164, 193)',
                  'rgb(73,108,229)'
                ]
                return {
                  label: names[ele.type],
                  value: Number(rate),
                  numWan: ele.numWan,
                  color: colors[ele.type]
                }
              })
            })
          setPieData(pieArr)
        } else {
          // console.log(result?.message || '接口异常！')
        }
      })
  }, [])

  useEffect(() => {
    if (pieData.length) {
      initSvg()
    }
  }, [pieData])

  useEffect(() => {
    if (pieData.length) {
      Donut3D.transition("quotesDonut", pieData[active], 110, 85, 20, 0);
    }
  }, [active])


  const initSvg = () => {
    let svg = d3
      .select("div.pie3D")
      .append("svg")
      .attr("width", 340)
      .attr("height", 240);
    svg
      .append("g")
      .attr("id", "quotesDonut");
    Donut3D.draw("quotesDonut", pieData[active], 150, 100, 110, 85, 20, 0);
  }

  const handlePieCheck = (i: number) => {
    active !== i && setActive(i)
  }

  return (
    <>
      <SectionTitle
        title="网络健壮性"
        style={{ width: '474px' }}
      >
      </SectionTitle>
      <NetworkStrongerBox>
        <div className="ratio-group">
          {
            ratioData.map((item, i) => {
              return (
                <div className="ratio-item" key={i}>
                  <div className="icon-wrap">
                    <img src={item.img} alt="" />
                    <p className="text">{item.label}</p>
                  </div>
                  <div className="ratio-cont">
                    <p>
                      <span>成环数</span>
                      <span className="value">{item.count}</span>
                    </p>
                    <p>
                      <span>成环率</span>
                      <span className="value">{item.per}</span>
                    </p>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="pie-wrap">
          <div className="select-wrap">
            <div
              className={['select-item', active === 0 ? 'active' : ''].join(' ')}
              onClick={() => handlePieCheck(0)}
            >
              <div className="text">成环数</div>
              <div className="num">{countData[0]}</div>
            </div>
            <div
              className={['select-item', active === 1 ? 'active' : ''].join(' ')}
              onClick={() => handlePieCheck(1)}
            >
              <div className="text">不成环数</div>
              <div className="num">{countData[1]}</div>
            </div>
          </div>
          <div className="pie-chart">
            <div
              className="pie3D"
              style={{ height: '100%' }}
            >
            </div>
          </div>
          <div className="pie-legend">
            <div>同机房内BBU数</div>
            {
              pieData[active]?.map((item: any, i: number) => {
                return (
                  <div className="legend" key={'legend' + i}>
                    <i className={['icon', 'icon' + i].join(' ')}></i>
                    <span className="text">{item.label}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </NetworkStrongerBox>
    </>
  );
}

export default NetworkStronger;
