/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import styles from './app.module.scss';

import Header from '../header/header';

import { Block } from '@network-resource-vis/block';

import DomainIndicator from '@alpha/app/module/domain-indicator/domain-indicator';
import ResQualityV2 from '@alpha/app/module/resource-quality-v2/resource-quality-v2';
import IframeModal from '@alpha/app/iframe-modal/iframe-modal';
import ModalView from '@alpha/app/modal-view/modal-view';
import ParallelNav from '@alpha/app/module/parallel-nav/parallel-nav';

import { useDispatch, useSelector } from 'react-redux';
import { selectResType } from '../redux/pro-target.slice';
import { setIframeShow } from '../redux/iframe.slice';
import Page from '@alpha/app/page';
import { useNavigate } from 'react-router-dom';

export function App() {
  const [sectionVisible, setSectionVisible] = useState(true);
  const resType = useSelector(selectResType);

  const dispatch = useDispatch();
  const [scrollTop, setScrollTop] = useState(0);

  function updateFrame(src: string, name: string) {
    dispatch(
      setIframeShow({
        url: src,
        title: name,
        iframeStyle: {
          width: '1920px',
          height: '1080px',
          zIndex: 900,
        },
      })
    );
    setScrollTop(window.pageYOffset);
  }

  const navigate = useNavigate();

  function updateModalView(url: string) {
    navigate('/topic/' + url);
  }

  return (
    <Page id="nr">
      <div className="inner">
        {/* <button onClick={handleSectionVisibleChange}>set</button> */}
        <div className={styles['first-header']}>
          <Header />
        </div>
        <section className={styles['resource']}>
          <Block
            blockStyle={{
              bottom: '0',
              right: 'calc(50% - 1128px / 2)',
              width: '1128px',
              height: '102px',
            }}
            blockBackground={false}
            blockCorner={false}
          >
            <ParallelNav
              jump={updateFrame}
              show={updateModalView}
            ></ParallelNav>
          </Block>

          <div
            className={[
              styles['left-section'],
              sectionVisible ? styles['fly-in'] : styles['fly-out'],
            ].join(' ')}
          >
            <Block
              id="domain-indicator"
              blockStyle={{
                top: '350px',
                left: '60px',
                width: '443px',
                height: '400px',
              }}
              blockBackground={false}
              blockCorner={false}
            >
              <DomainIndicator jump={updateFrame} show={updateModalView} />
            </Block>

            <Block
              id="res-quality"
              blockStyle={{
                top: '730px',
                left: '120px',
                width: '600px',
                height: '250px',
              }}
              blockBackground={false}
              blockCorner={false}
            >
              <ResQualityV2 resType={resType} jump={updateFrame} />
            </Block>
          </div>

          <div
            className={[
              styles['right-section'],
              sectionVisible ? styles['fly-in'] : styles['fly-out'],
            ].join(' ')}
          ></div>
        </section>
      </div>
      <IframeModal
        fn={() => {
          setTimeout(() => {
            document.body.scrollTop = document.documentElement.scrollTop =
              scrollTop;
          }, 400);
        }}
      />
    </Page>
  );
}

export default App;
