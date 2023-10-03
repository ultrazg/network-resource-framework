import * as THREE from 'three';
import { Object3D } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as TWEEN from '@tweenjs/tween.js';

import { useRef, useEffect, useState } from 'react';

import { utils } from './utils';
import css from './three.module.scss';

import { MercatorChinaMap } from './layers/mercator-map';

/* eslint-disable-next-line */
export interface ThreeProps {}

const STAT_BOO = true;

export function Three(props: ThreeProps) {
  const threeRef = useRef(null);

  const [stats] = useState(Stats());
  const [dimension, setDimension] = useState({ width: 200, height: 200 });

  const [layer, setLayer] = useState<Object3D>();

  const [scene] = useState(function () {
    return new THREE.Scene();
  });
  const [camera] = useState(function () {
    return new THREE.PerspectiveCamera(
      60,
      dimension.width / dimension.height,
      1,
      1000
    );
  });
  const [renderer] = useState(function () {
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    r.setPixelRatio(window.devicePixelRatio);
    r.setClearColor(0x111111, 0);

    return r;
  });
  const [labelRenderer] = useState(function () {
    return new CSS2DRenderer();
  });
  const [controls, setControls] = useState<OrbitControls>();

  function setLight() {
    let ambientLight = new THREE.AmbientLight(0x4c4c4c);
    scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 0.6);
    pointLight.position.set(0, 1000, 50);
    scene.add(pointLight);
  }

  function render() {
    if (renderer && labelRenderer && camera) {
      renderer.render(scene, camera);

      labelRenderer.render(scene, camera);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (STAT_BOO) {
      stats.update();
    }

    // 一种非常不优雅的方式，需要修改
    if (scene) {
      scene.children.forEach((item) => {
        if (item.type == 'Group') {
          item.children.forEach((child) => {
            if (child.type == 'Group' && child.name.indexOf('animate') > -1) {
              child.children.forEach((element) => {
                if (element.type == 'Mesh') {
                  (
                    (element as THREE.Mesh)['material'] as THREE.ShaderMaterial
                  ).uniforms['time'].value += 0.01;
                }
              });
            }
          });
        }
      });
    }

    TWEEN.update();

    if (controls) {
      controls.update();
    }

    render();
  }

  function destoryLayer(layer: any) {
    if (layer) {
      utils.clearObject(layer);
    }
  }

  useEffect(() => {
    const current = threeRef.current;

    if (current) {
      const parent = current['parentNode'];

      setDimension({
        width: parent['offsetWidth'],
        height: parent['offsetHeight'],
      });
    }

    if (scene) {
      utils.clearObject(scene);
    }

    MercatorChinaMap().then((res: any) => {
      setLayer(res);
      res.scale.set(0.1, 0.1, 0.1);
      scene.add(res);

      const tween = new TWEEN.Tween(res)
        .to(
          {
            scale: {
              x: 1,
              y: 1,
              z: 1,
            },
          },
          1000
        )
        .easing(TWEEN.Easing.Cubic.Out);
      tween.start();
    });

    animate();
  }, []);

  useEffect(() => {
    // renderer
    renderer.setSize(dimension.width, dimension.height);

    // label renderer
    labelRenderer.setSize(dimension.width, dimension.height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';

    if (threeRef.current) {
      (threeRef.current as HTMLElement).appendChild(renderer.domElement);

      if (STAT_BOO) {
        (threeRef.current as HTMLElement).appendChild(stats.dom);
      }
    }

    camera.aspect = dimension.width / dimension.height;
    camera.updateProjectionMatrix();
    camera.position.set(1.8, 58, 58);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    setControls(controls);

    setLight();
  }, [dimension]);

  return (
    <div className={css['three']}>
      <div className="three" ref={threeRef}></div>
      <button
        onClick={() => {
          destoryLayer(layer);
        }}
      >
        测试
      </button>
    </div>
  );
}

export default Three;
