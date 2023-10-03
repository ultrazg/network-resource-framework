import styled from 'styled-components';
import InfoBG from '@alpha/app/topic/broadband-2/images/bg/info-bg.svg';
import LabelBg from '../../images/label-bg.svg';

const SearchContainer = styled.div`
  position: absolute;
  left: 50px;
  top: 140px;
  width: 390px;
  height: 130px;
  background: url('${InfoBG}') center center no-repeat;
  background-size: 100% 100%;
  background-position: top;
  z-index: 999;
  padding: 16px 15px 32px;
  display: flex;
  align-items: center;
  //cursor: move;

  .search-form {
    width: 100%;
  }

  .button-container {
    width: 100%;
    justify-content: space-evenly;
    display: flex;
    margin-top: 16px;
  }

  button {
    cursor: pointer;
    width: 73px;
    height: 31px;
    border-radius: 2px;
    color: white;
  }

  .main-button {
    background: #1966ff;
    border: none;
  }

  .plain-button {
    border: 1px solid rgba(151, 151, 151, 0.34);
    border-radius: 2px;
    color: #e0e0e0;
    background: transparent;
  }

  .text-button {
    border: 0px solid rgba(151, 151, 151, 0.34);
    border-radius: 2px;
    color: #e0e0e0;
    background: transparent;
  }

  .form-item {
    height: 32px;
    margin-top: 18px;
    display: flex;
    align-items: center;

    .close-icon {
      width: 16px;
      height: 16px;
      margin-left: -24px;
      cursor: pointer;
    }

    .label {
      width: 80px;
      height: 20px;
      font-size: 14px;
      margin-left: 12px;
    }

    :before {
      content: '*';
      color: red;
      width: 0px;
    }
  }

  input {
    width: 269px;
    height: 100%;
    margin-left: 8px;
    padding-right: 24px;
    border: 1px solid #97979745;
    border-radius: 2px;
    overflow: hidden;
    vertical-align: middle;
    -webkit-appearance: none; //把原来的样式整个抹掉
    outline: 0;
    background: 0 0;
    padding-left: 12px;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;

    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  /* 99999s 基本上就是一个无限长的时间 通过延长增加自动填充背景色的方式,
    使用户感受不到样式的变化  */

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
  }

  .primary_button {
    background: #1966ff;
  }
`;

const SearchResultContainer = styled.div`
  position: absolute;
  left: 50px;
  top: 340px;
  width: 375px;
  height: 248px;
  background: #151f42;
  border-radius: 4px;
  z-index: 998;
  padding: 12px 22px;
  overflow-y: auto;
  letter-spacing: 0;

  .location-icon {
    margin-right: 8px;
    font-size: 16px;
  }

  .key-text {
    color: #02baff;
  }

  .text {
    font-size: 14px;
    margin-right: 8px;
  }

  .sm-text {
    font-size: 12px;
    color: #a3a3a3;
  }

  .search-result-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    padding: 8px 0;
    align-items: baseline;
  }
`;
const EmptyContainer = styled.div`
  position: absolute;
  z-index: 998;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;
const ButtonContainer = styled.div`
  background: #000e3480;
  box-shadow: 0 0 20px inset #1d92fb50;
  border-radius: 4px;
  padding: 8px 10px;
  position: absolute;
  left: 50px;
  bottom: 28px;
  cursor: pointer;
  z-index: 998;
  display: flex;
  flex-direction: column;
  border: 1px solid #1d92fb;

  font-size: 12px;
  color: #00f2ff;

  .square {
    width: 8px;
    height: 8px;
    border: 0.5px solid;
    border-radius: 1px;
    margin-right: 12px;
  }

  .legend-bar {
    margin-top: 12px;
    width: 130px;
    height: 5px;
    display: flex;
    justify-content: space-between;

    .legend {
      height: 5px;
    }
  }

  .legend-text {
    width: 130px;
    display: flex;

    font-size: 10px;
    color: #ffffff;
  }
`;

const Button = styled.div`
  width: 127px;
  height: 32px;

  display: flex;
  align-items: center;
  color: #32c5ff;

  font-weight: 400;
  font-size: 12px;
  background-size: 100% 100%;
  white-space: nowrap;

  .button-icon {
    margin-left: 12px;
  }

  .button-text {
    margin-left: 8px;
  }

  &.clicked {
    color: #00fcff;
  }
`;

const InfoContainer = styled.div`
  background: url('${InfoBG}') center center no-repeat;
  background-size: 100% 100%;
  width: 392px;
  min-height: 170px;
  padding: 20px 28px;

  .close {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #000e3480;
    box-shadow: 0 0 20px inset #1d92fb50;
    border: 1px solid #1d92fb;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    cursor: pointer;

    .iconfont {
      margin-right: 0px;
    }
  }

  .iconfont {
    margin-right: 8px;
  }

  .main-text {
    font-family: PMZD, sans-serif;
    font-size: 28px;
    color: #00fcff;
    text-shadow: 0 0 10px rgba(0, 254, 255, 0.57);
    text-align: center;
  }

  .detail-container {
    margin-top: 8px;
    background: rgb(26, 41, 78);
    padding: 10px 10px;
  }

  .more-info {
    justify-content: space-between;

    .icon {
      margin-right: 5px;
      width: 20px;
      height: 14px;
    }

    .name {
      margin-right: 8px;
    }

    .more-info-item {
      margin-right: 20px;
    }
  }

  .text {
    margin: 0 8px;
    color: #65748f;
  }

  span {
    &.val {
      font-family: PMZD, sans-serif;
      color: #00fcff;
      font-size: 16px;
      text-align: center;
    }

    &.name {
      font-size: 12px;
    }

    &.blue {
      color: #00c5f5;
    }
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;

  &.space {
    justify-content: space-between;
  }
`;
const Tooltip = styled.div<{
  index: number;
  sum: number;
  duration: number;
}>`
  .label {
    background: url(${LabelBg}) left center no-repeat;
    width: 200px;
    height: 26px;
    white-space: nowrap;
    opacity: 0.4;
    line-height: 27px;
    padding-left: 16px;
    font-family: FZZDHJW, sans-serif;
    font-weight: 0;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 2px;
  }

  &:hover .label {
    opacity: 1;
  }

  &:hover .content {
    opacity: 1;
  }

  @keyframes show {
    0% {
      opacity: 0;
    }
    ${(props) => ((1 / props.sum) * 100).toFixed(0) + '%'} {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .content {
    opacity: 0;
    animation: show ${(props) => props.duration * props.sum}s infinite
      step-start;
    animation-delay: ${(props) => props.index * props.duration}s;
    cursor: pointer;
    pointer-events: none;
    min-width: 210px;
    min-height: 100px;
    padding: 10px;
    background: rgba(0, 12, 50, 0.8);
    border: 1px solid #1757cb;
    box-shadow: inset 0 0 20px 4px rgba(0, 147, 255, 0.41);
    margin-top: 0px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    white-space: nowrap;
    > div:not(.bar, .header, .cylinder) {
      display: flex;
      margin: 0 0 10px;

      &:not(.box, .device) {
        background: url('/assets/tooltips-item.svg') left center no-repeat;
      }

      padding-left: 25px;

      &.fixed {
        span {
          &.key {
            width: 105px;
          }

          &.value {
            margin-left: 0;
            text-align: left;
          }
        }
      }

      span {
        font-size: 12px;

        &.key {
          padding-right: 10px;
        }

        &.iconfont,
        &.precentage {
          padding-left: 0;
        }

        &.name {
          color: #32c5ff;
          margin-right: 20px;
        }

        &.value {
          font-family: 'PMZD', sans-serif;
          color: #01fafb;
          margin-left: auto;
          min-width: 60px;
          text-align: right;
          margin-top: 1px;
        }
      }
    }
  }
`;

export {
  SearchContainer,
  InfoContainer,
  Row,
  Button,
  ButtonContainer,
  SearchResultContainer,
  EmptyContainer,
  Tooltip,
};
