import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function useCSS2Renderer(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  const [css3Renderer] = useState(() => new CSS3DRenderer());
  const [container, setContainer] = useState<HTMLElement>();
  const [cameraController, setCameraController] = useState<OrbitControls>();

  const render = useCallback(() => {
    css3Renderer.render(scene, camera);
  }, [scene, camera]);

  useEffect(() => {
    let animateIndex = 0;
    function resizeHandler() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      css3Renderer.setSize(container!.offsetWidth, container!.offsetHeight);
      css3Renderer.domElement.style.position = "absolute";
      // css3Renderer.domElement.style.zIndex = "-1";
      css3Renderer.domElement.style.top = "0px";
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
    container.append(css3Renderer.domElement);
    container.addEventListener("resize", resizeHandler);
    animate();
    return () => {
      container.removeEventListener("resize", resizeHandler);
      window.cancelAnimationFrame(animateIndex);
    };
  }, [container, render, cameraController]);

  return {
    css3Renderer,
    setContainer,
    setCameraController,
  };
}
