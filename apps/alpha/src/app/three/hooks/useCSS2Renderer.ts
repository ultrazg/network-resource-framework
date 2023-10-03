import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function useCSS2Renderer(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  const [css2Renderer] = useState(() => new CSS2DRenderer());
  const [container, setContainer] = useState<HTMLElement>();
  const [cameraController, setCameraController] = useState<OrbitControls>();

  const render = useCallback(() => {
    css2Renderer.render(scene, camera);
  }, [scene, camera]);

  useEffect(() => {
    let animateIndex = 0;
    function resizeHandler() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      css2Renderer.setSize(container!.offsetWidth, container!.offsetHeight);
      css2Renderer.domElement.style.position = "absolute";
      css2Renderer.domElement.style.top = "0px";
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
    container.append(css2Renderer.domElement);
    container.addEventListener("resize", resizeHandler);
    animate();
    return () => {
      container.removeEventListener("resize", resizeHandler);
      window.cancelAnimationFrame(animateIndex);
    };
  }, [container, render]);

  return {
    css2Renderer,
    setContainer,
    setCameraController,
  };
}
