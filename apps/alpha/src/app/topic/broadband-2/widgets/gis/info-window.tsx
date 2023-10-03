import { useState } from 'react';
import styled from 'styled-components';
import InfoLg from '@alpha/app/topic/broadband-2/images/bg/info-window-lg.svg';
import InfoSm from '@alpha/app/topic/broadband-2/images/bg/info-window-sm.svg';
import Target from '@alpha/app/topic/broadband-2/images/target.svg';

import Marker from '@alpha/app/topic/broadband-2/images/icon/marker.svg';
import SingleConnect from '@alpha/app/topic/broadband-2/images/icon/single-connect.svg';
import DoubleConnect from '@alpha/app/topic/broadband-2/images/icon/double-connect.svg';
import Kilomega from '@alpha/app/topic/broadband-2/images/icon/kilomega.svg';
import Underutilization from '@alpha/app/topic/broadband-2/images/icon/underutilization.svg';
import Normal from '@alpha/app/topic/broadband-2/images/icon/normal.svg';
import Prewarning from '@alpha/app/topic/broadband-2/images/icon/prewarning.svg';

export const CommunityInfoWrapper = styled.div`
  width: 320px;
  height: 205px;
  padding: 20px 2px 20px 12px;
  box-sizing: border-box;
  background: url('${InfoLg}') center center no-repeat;
  background-size: 100% 100%;
  .header {
    padding: 0 0 0 40px;
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 1.5;
    color: #fff;
    float: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 300px;
    box-sizing: border-box;
    display: flex;
    &.type-0000 {
      background: url('${Marker}') left center no-repeat;
      &.isGiga {
        background: url('${Kilomega}') left center no-repeat;
      }
    }
    .txt {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      flex: 1;
    }
    .close {
      color: #fff;
      margin-left: auto;
      width: 24px;
      height: 24px;
    }
    &[data-tooltip]::after {
      max-width: 50vw;
    }
  }

  .item {
    background: url('${Target}') 0 10px no-repeat;
    padding: 3px 0 3px 25px;
    width: 145px;
    box-sizing: border-box;
    float: left;
    display: flex;

    &.full {
      width: 280px;
    }

    .label {
      font-size: 10px;
      color: #00c5f5;
      white-space: nowrap;
    }

    .value {
      font-family: 'PMZD', sans-serif;
      font-size: 12px;
      color: #00fcff;
    }
  }

  .clearfix {
    clear: both;
  }
`;

export const InfoWrapper = styled.div`
  width: 320px;
  height: 120px;
  padding: 20px 2px 20px 12px;
  box-sizing: border-box;
  background: url('${InfoSm}') center center no-repeat;
  background-size: 100% 100%;
  .header {
    padding: 0 0 0 40px;
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 1.5;
    color: #fff;
    float: left;
    width: 300px;
    box-sizing: border-box;
    display: flex;
    &.type-2510 {
      background: url('${SingleConnect}') 0 center no-repeat;
      &.active {
        background: url('${DoubleConnect}') 0 center no-repeat;
      }
    }
    &.type-2530 {
      &.normal {
        background: url('${Normal}') 0 center no-repeat;
      }
      &.underutilization {
        background: url('${Underutilization}') 0 center no-repeat;
      }
      &.prewarning {
        background: url('${Prewarning}') 0 center no-repeat;
      }
    }
    .txt {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      flex: 1;
    }
    .close {
      color: #fff;
      margin-left: auto;
      width: 24px;
      height: 24px;
    }
    &[data-tooltip]::after {
      max-width: 50vw;
    }
  }
  .item {
    background: url('${Target}') 1px 12px no-repeat;
    padding: 6px 0 8px 24px;
    width: 165px;
    box-sizing: border-box;
    float: left;
    display: flex;

    &.short {
      width: 120px;
    }

    .label {
      font-size: 10px;
      color: #00c5f5;
      white-space: nowrap;
    }

    .value {
      font-family: 'PMZD', sans-serif;
      font-size: 12px;
      color: #00fcff;
    }
  }

  .clearfix {
    clear: both;
  }
`;
