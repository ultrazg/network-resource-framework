import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function useWebGLRenderer(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) {
  const [glRenderer] = useState(
    () => new THREE.WebGLRenderer({ antialias: false, alpha: true })
  );
  const [container, setContainer] = useState<HTMLElement>();
  const [cameraController, setCameraController] = useState<OrbitControls>();
  const render = useCallback(() => {
    glRenderer.render(scene, camera);
  }, [scene, camera]);

  useEffect(() => {
    let animateIndex = 0;
    function resizeHandler() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      glRenderer.setSize(container!.offsetWidth, container!.offsetHeight);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      camera.aspect = container!.offsetWidth / container!.offsetHeight;
      camera.updateProjectionMatrix();
    }
    function animate() {
      animateIndex = window.requestAnimationFrame(animate);
      cameraController && cameraController.update();
      render();
    }
    if (!container) {
      return;
    }
    resizeHandler();
    container.append(glRenderer.domElement);
    container.addEventListener('resize', resizeHandler);
    animate();
    return () => {
      container.removeEventListener('resize', resizeHandler);
      window.cancelAnimationFrame(animateIndex);
    };
  }, [container, render, cameraController]);

  useEffect(() => {
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setClearColor(0x000000, 0);
  }, []);

  return {
    glRenderer,
    setContainer,
    setCameraController,
  };
}
