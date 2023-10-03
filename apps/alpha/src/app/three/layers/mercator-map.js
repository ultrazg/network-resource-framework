import * as THREE from 'three';
import * as d3 from 'd3';

import * as TWEEN from '@tweenjs/tween.js';
import * as turf from '@turf/turf';

import { HeartbeatPulse } from '../widgets/pulse';

import { utils } from '../utils';
import { getAction } from '@alpha/utils/http';

import { generateRadomNum } from '../../../utils/commFunc.ts';

const PROJ_SCALE = 80,
  BOX_OFFSET = 0.2,
  BOX_HEIGHT = 2;

const CHINA_CENTER = [104.0, 37.5];

const projection = d3
  .geoMercator()
  .center(CHINA_CENTER)
  .scale(PROJ_SCALE)
  .translate([0, 0]);

const TOP_MAP_COLOR = 0x0056b0,
  MIDDLE_MAP_COLOR = 0x30ffff,
  BOTTOM_MAP_COLOR = 0x1082ff;

export function MercatorChinaMap() {
  const map = new THREE.Group();

  return getAction(`./assets/data/provinces.json`)
    .then((res) => {
      const bottomMap = createChinaMap(
        'bottom',
        res['features'],
        TOP_MAP_COLOR,
        1
      );
      bottomMap.translateZ(-1);
      map.add(bottomMap);

      const middleMap = createChinaMap(
        'middle',
        res['features'],
        MIDDLE_MAP_COLOR,
        1
      );
      middleMap.translateZ(0);
      map.add(middleMap);

      const topMap = createChinaMap(
        'top',
        res['features'],
        BOTTOM_MAP_COLOR,
        0.01,
        true,
        false
      );
      topMap.translateZ(1.04);
      map.add(topMap);

      // add heartbeat pulse
      map.add(createHeartbeatPulse(res['features']));
    })
    .then(() => {
      return utils.loadTexture('./assets/china.png').then((texture) => {
        const geometry = new THREE.PlaneBufferGeometry(95, 95, 32);
        texture.repeat.set(1, 1);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 1,
          depthTest: true,
          depthWrite: true,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.translateZ(1);

        map.add(plane);

        map.rotateX(-Math.PI / 2);

        return map;
      });
    });
}

export const createHeartbeatPulse = (province) => {
  const group = new THREE.Group();
  group.name = 'animate-heartbeat-pulse';

  province.forEach((elem) => {
    const coordinate = elem.properties.centroid
      ? elem.properties.centroid
      : elem.properties.center;

    if (coordinate) {
      let [x, y] = projection(coordinate);

      let pulse = HeartbeatPulse(1, 4, 0xfae231);
      pulse.position.set(x, -y, 1.2);

      group.add(pulse);
    }
  });

  return group;
};

export const createTargets = (province, targets, name, colorIndex, isBox) => {
  const group = new THREE.Group();
  group.name = name;

  /**
   * 重新组合数据
   */
  let targetObject = arrangeTargets(targets, province);

  province.forEach((elem) => {
    const coordinate = elem.properties.centroid
      ? elem.properties.centroid
      : elem.properties.center;

    if (coordinate) {
      let [x, y] = projection(coordinate);

      const boxGroup = new THREE.Group();

      const { heightArray, totalHeight } = caculateTargetHeight(
        elem,
        targetObject,
        targets
      );

      for (let i = 0; i < heightArray.length; i++) {
        let computeHeight = 0;
        if (i > 0) {
          let sliceArray = heightArray.slice(0, i);
          computeHeight = sliceArray.reduce((total, currentValue) => {
            return total + currentValue;
          });
        }

        createTargetBox({
          height: heightArray[i],
          i,
          colorIndex,
          isBox,
          boxGroup,
          totalHeight,
          computeHeight,
        });

        /**
         * for cylinder
         */
        box.rotateX(Math.PI / 2);
        box.translateY(-totalHeight / 2 + computeHeight + heightArray[i] / 2);
        /**
         * for box
         */
        boxGroup.add(box);
      }

      boxGroup.scale.z = 0.01;
      boxGroup.position.set(x, -y, 1.02);
      group.add(boxGroup);

      new TWEEN.Tween(boxGroup.scale)
        .to(
          {
            x: 1,
            y: 1,
            z: 1,
          },
          2000
        )
        .delay(300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      new TWEEN.Tween(boxGroup.position)
        .to(
          {
            x: x,
            y: -y,
            z: 1.02 + totalHeight / 2,
          },
          2000
        )
        .delay(300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    }
  });
  group.rotateX(-Math.PI / 2);

  return group;
};

function arrangeTargets(targets, province) {
  /**
   * 重新组合数据
   */
  let targetObject = {};

  for (const target of targets) {
    const copy = JSON.parse(JSON.stringify(target.value));

    const sorted = copy.sort((a, b) => b.value - a.value);

    for (const targetValue of target.value) {
      for (const provinceChild of province) {
        compactTarget({
          targetObject,
          targetValue,
          provinceChild,
          sorted,
          target,
        });
      }
    }
  }

  return targetObject;
}

function compactTarget(params) {
  const { targetObject, targetValue, provinceChild, sorted, target } = params;
  if (
    targetValue.name !== '' &&
    provinceChild.properties.name.indexOf(targetValue.name) > -1
  ) {
    if (!targetObject[provinceChild.properties.name]) {
      targetObject[provinceChild.properties.name] = {};
    }

    targetObject[provinceChild.properties.name][target.key] = isNumber(
      targetValue.value
    )
      ? targetValue.value
      : 0;

    if (!targetObject[provinceChild.properties.name].max) {
      targetObject[provinceChild.properties.name].max = {};
    }
    targetObject[provinceChild.properties.name]['max'][`${target.key}`] =
      sorted.length ? sorted[0].value : 0;
  }
}

function caculateTargetHeight(elem, targetObject, targets) {
  const heightArray = [];
  let totalHeight = 0;
  if (targetObject[elem.properties.name]) {
    Object.keys(targetObject[elem.properties.name]).forEach((item) => {
      if (item !== 'max') {
        if (targetObject[elem.properties.name][item] !== 0) {
          const height =
            BOX_OFFSET +
            ((targetObject[elem.properties.name][item] /
              targetObject[elem.properties.name]['max'][item]) *
              BOX_HEIGHT) /
              targets.length;

          heightArray.push(height);

          totalHeight += height;
        } else {
          heightArray.push(0);
        }
      }
    });
  }

  return { heightArray, totalHeight };
}

function createTargetBox(params) {
  const { height, i, colorIndex, isBox, boxGroup, totalHeight, computeHeight } =
    params;

  if (height != 0) {
    let box = createCylinder(
      0.5,
      height,
      colorIndex == 100 ? i : colorIndex,
      isBox
    );

    /**
     * for cylinder
     */
    box.rotateX(Math.PI / 2);
    box.translateY(-totalHeight / 2 + computeHeight + height / 2);

    boxGroup.add(box);
  }
}

export const createChinaMap = (
  name,
  provinces,
  color,
  opacity,
  withName,
  withLine
) => {
  const group = new THREE.Group();

  provinces.forEach((elem) => {
    const province = new THREE.Object3D();

    const coordinates = elem.geometry.coordinates;

    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        const shape = new THREE.Shape();
        const lineGeometry = new THREE.BufferGeometry();
        const arr = [];

        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i]);
          if (i === 0) {
            shape.moveTo(x, -y);
          }
          shape.lineTo(x, -y);
          arr.push(x, -y, 0.1);
        }
        const vertices = new Float32Array(arr);
        lineGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(vertices, 3)
        );

        const extrudeSettings = {
          depth: 0.02,
          bevelEnabled: false,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: opacity,
        });
        const material1 = new THREE.MeshBasicMaterial({
          color: 0x0df3ff,
          transparent: true,
          opacity: 1,
        });
        const mesh = new THREE.Mesh(geometry, [material, material1]);
        mesh.color = color;
        mesh.name = `china-map-${name}-${elem.properties.name}`;
        mesh.adcode = elem.properties.adcode;
        province.add(mesh);

        if (withLine) {
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x30ffff,
            linewidth: 1,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round', //ignored by WebGLRenderer
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          province.add(line);
        }
      });
    });

    province.properties = elem.properties;
    const coordinate = elem.properties.centroid
      ? elem.properties.centroid
      : elem.properties.center;
    if (coordinate) {
      let [x, y] = projection(coordinate);

      province.properties._centroid = [x, -y];

      group.add(province);
    }
  });

  return group;
};

export const createMap = (feature, children, scale) => {
  const group = new THREE.Group();

  const centroid = turf.centroid(feature);
  if (centroid) {
    children.forEach((elem) => {
      const child = new THREE.Group();
      const coordinates = elem.geometry.coordinates;

      const coordinate = elem.properties.centroid
        ? elem.properties.centroid
        : elem.properties.center;

      if (coordinate) {
        let [x, y] = projection(coordinate);

        const name = SpriteText({
          padding: 8,
          backgroundColor: 'rgba(255,255,255,0.2)',
          height: 1,
          fontSize: 128,
          fontColor: 'rgba(255,255,255,1.0)',
          text: elem.properties.name,
        });
        name.position.set(x, -y, 2.1);

        group.add(name);
      }

      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: baseEdgeColor,
          });
          const lineGeometry = new THREE.BufferGeometry();
          const arr = [];

          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            arr.push(x, -y, 1.02);
          }
          const vertices = new Float32Array(arr);
          lineGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
          );

          const extrudeSettings = {
            depth: 1.0,
            bevelEnabled: false,
          };

          const color = colors[parseInt((generateRadomNum() * 10) % 9)];
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
          });
          const material1 = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5,
          });
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          mesh.color = color;
          mesh.name = elem.properties.name;
          mesh.adcode = elem.properties.adcode;
          child.add(mesh);

          const line = new THREE.Line(lineGeometry, lineMaterial);
          child.add(line);
        });
      });

      child.properties = elem.properties;
      group.add(child);
    });

    return group;
  }
};

export const createRandomTraget = (province) => {
  const group = new THREE.Group();
  province.forEach((elem) => {
    const coordinate = elem.properties.centroid
      ? elem.properties.centroid
      : elem.properties.center;

    if (coordinate) {
      let [x, y] = projection(coordinate);

      const height = generateRadomNum() * 8;
      if (height) {
        let mesh = createCylinder(0.5, height, 0x009900);
        mesh.scale.y = 0.01;
        mesh.position.set(x, -y + 1, 1.02);
        group.add(mesh);

        new TWEEN.Tween(mesh)
          .to(
            {
              scale: {
                x: 1,
                y: 1,
                z: 1,
              },
              position: {
                x: x,
                y: -y + 1,
                z: 1.02 + height / 2,
              },
            },
            2000
          )
          .delay(1000)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
      }
    }
  });

  return group;
};

function calculateBoxHeight(data, name, nameKey, value) {
  const d = JSON.parse(JSON.stringify(data));
  const sorted = d.sort((a, b) => a[value] > b[value]);

  const filtered = data.filter((item) => {
    return name.indexOf(item[nameKey]) > -1;
  });

  if (filtered && filtered.length > 0 && sorted.length > 0) {
    if (!sorted[0][value]) {
      return 0;
    }
    return filtered[0].value ? (filtered[0][value] / sorted[0][value]) * 2 : 0;
  }

  return 0;
}

function calculateValue(data, name, nameKey, value) {
  const filtered = data.filter((item) => {
    return item[nameKey] === name;
  });

  if (filtered && filtered.length > 0) {
    return filtered[0][value];
  }

  return 0;
}

function createCylinder(radius, height, index, isBox) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    isBox ? 4 : 64
  );
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(MAP_COLOR[index]),
      },
      color2: {
        value: new THREE.Color(MAP_COLOR[index]),
      },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;

      varying vec2 vUv;

      void main() {
        float alpha = smoothstep(0.0, 1.0, vUv.y);

        gl_FragColor = vec4(mix(color1, color2, vUv.y), alpha);
      }
    `,
    wireframe: false,
    transparent: true,
    opacity: 0.7,
  });
  const topMaterial = new THREE.MeshPhongMaterial({
    color: MAP_COLOR[index],
    transparent: false,
    opacity: 0.6,
  });
  const mesh = new THREE.Mesh(geometry, [material, topMaterial, topMaterial]);
  mesh.rotateZ(Math.PI / 2);

  return mesh;
}
