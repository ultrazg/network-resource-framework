import * as THREE from "three";

export function clearObj(obj: THREE.Object3D) {
  while (obj && obj.children.length > 0) {
    clearObj(obj.children[0]);
    obj.remove(obj.children[0]);
  }
  if (obj instanceof THREE.Mesh) {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      Object.keys(obj.material).forEach((prop) => {
        if (!obj.material[prop]) return;
        if (
          obj.material[prop] !== null &&
          typeof obj.material[prop].dispose === "function"
        )
          obj.material[prop].dispose();
      });
      try {
        obj.material.dispose();
      } catch (err) {}
    }
  }
}

export function getIntersectsByRaycaster(
  scope: THREE.Object3D,
  camera: THREE.Camera,
  event: MouseEvent,
) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const element = event.currentTarget as HTMLElement | null;
  if (!element) {
    return [];
  }
  const x = event.clientX - element.getBoundingClientRect().x;
  const y = event.clientY - element.getBoundingClientRect().y;
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  mouse.x = (x / w) * 2 - 1;
  mouse.y = -(y / h) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(scope.children, true);
}
