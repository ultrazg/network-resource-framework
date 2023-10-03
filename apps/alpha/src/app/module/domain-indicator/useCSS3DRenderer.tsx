import { useCallback, useEffect, useState } from 'react';
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import * as THREE from 'three';

export default function useCSS3DRenderer(
  perspectiveDis: number = 2000,
  sphereR: number = 1000
) {
  const [renderer, setRenderer] = useState(function () {
    return new CSS3DRenderer();
  });
  const [camera, setCamera] = useState(() => {
    return new THREE.PerspectiveCamera(30, 1, 0.1, perspectiveDis);
  });
  const [scene, setScene] = useState(function () {
    return new THREE.Scene();
  });
  const [container, setContainer] = useState<HTMLElement>();
  const [elements, setElements] = useState<HTMLElement[]>();
  const [loaded, setLoaded] = useState(false);

  const render = useCallback(() => {
    renderer.render(scene, camera);
  }, [renderer]);

  useEffect(function () {
    function onResize() {
      if (!container) {
        return;
      }
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      render();
    }
    window.addEventListener('resize', onResize);
  }, []);

  useEffect(
    function () {
      if (!container) {
        return;
      }
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.position.set(0, 0, 1200);

      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.append(renderer.domElement);
      render();
    },
    [container]
  );

  useEffect(
    function () {
      if (!elements) {
        return;
      }
      const vector = new THREE.Vector3();
      const len = elements.length;
      const focusIndex = Math.floor(len / 2);
      const rows = 3;
      if (!len) {
        return;
      }
      elements.forEach((element, index) => {
        const objectCSS = new CSS3DObject(
          element.cloneNode(true) as HTMLElement
        );
        objectCSS.element.setAttribute('uuid', objectCSS.uuid);
        // if(index === focusIndex) {
        //   setFocusUuid(objectCSS.uuid);
        // }
        const z = parseInt(String(index / rows));
        const phi = (-Math.PI * (z + 3)) / 8;

        const y = parseInt(String(index % rows));
        const theta = -Math.PI * 2 + Math.PI / 2 + ((y + 2) / 6) * Math.PI;

        objectCSS.position.setFromSphericalCoords(sphereR, phi, theta);
        vector.copy(objectCSS.position).multiplyScalar(2);
        objectCSS.lookAt(vector);
        scene.add(objectCSS);
      });
      setLoaded(true);
      render();
      return () => {
        scene.clear();
        render();
      };
    },
    [elements]
  );
  return {
    renderer,
    camera,
    scene,
    render,
    setContainer,
    setElements,
    loaded,
    setLoaded,
  };
}
