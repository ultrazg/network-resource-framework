import { useCallback, useEffect, useState } from 'react';
import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function useOrbitControls(
  camera: Camera,
  domElement: HTMLElement,
  render: () => void
) {
  const [controls, setControls] = useState<OrbitControls>();
  const [animateIndex, setAnimateIndex] = useState<number>();

  const animate = useCallback(() => {
    setAnimateIndex(requestAnimationFrame(animate));
    controls && controls.update();
  }, [controls]);

  useEffect(
    function () {
      setControls(new OrbitControls(camera, domElement));
    },
    [camera, domElement]
  );

  useEffect(() => {
    if (!controls) {
      return;
    }
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.rotateSpeed = 0.2;
    controls.dampingFactor = 0.5;
    controls.addEventListener('change', render);
    animate();
    return () => {
      animateIndex && cancelAnimationFrame(animateIndex);
      controls && controls.dispose();
    };
  }, [controls, render]);
}
