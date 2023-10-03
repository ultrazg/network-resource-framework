import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

type Action = {
  type: 'col' | 'row';
  index: number;
  forward: boolean;
  distance: number;
};

export default function useSwitchAction(
  scene: THREE.Scene,
  renderer: CSS3DRenderer,
  render: () => void,
  onTransitionStart: (focusEle: HTMLElement) => void,
  onTransitionEnd: (focusEle: HTMLElement, index: number) => void,
  focusEleEventHandlers?: {
    [evnetType: string]: (e: Event, index: number) => void;
  }
) {
  // const [curUuid, setCurUuid] = useState<string>();
  const [transiting, setTransiting] = useState(false);
  const [transitOver, setTransitOver] = useState(true);
  const [autoTransit, setAutoTransit] = useState(false);
  const [matrix, setMatrix] = useState<string[][]>();
  const [actionStack, setActionStack] = useState<Action[]>([]); // 转换动作列表
  const [curStep, setCurStep] = useState<number>(); // 当前运行的动作步骤
  const [focusUuid, setFocusUuid] = useState<string>();
  const [tweenGrp] = useState(() => new TWEEN.Group());
  // 获取focus索引
  const focusIndex = useMemo(() => {
    if (!matrix || !matrix[0]?.length) {
      return;
    }
    const rowNum = matrix.length;
    const colNum = matrix[0].length;
    return [Math.floor(rowNum / 2), Math.floor(colNum / 2)] as [number, number];
  }, [matrix]);
  // 获取原始列表索引
  const getElementIndexByUuid = useCallback((uuid?: string) => {
    const objList = scene.children;
    return objList.findIndex((obj) => obj.uuid === uuid);
  }, []);
  // 转换前回调
  const beforeTransit = useCallback(() => {
    if (!matrix || !matrix.length) {
      return;
    }
    if (!focusIndex) {
      return;
    }
    const focusObj = scene.getObjectByProperty(
      'uuid',
      matrix[focusIndex[0]]?.[focusIndex[1]]
    ) as CSS3DObject;
    if (focusObj) {
      focusObj.scale.setScalar(1);
      render();
      onTransitionStart(focusObj.element);
    }
  }, [focusIndex, matrix]);

  // 转换后回调
  const afterTransit = useCallback(() => {
    if (!matrix || !matrix.length) {
      return;
    }
    if (!focusIndex) {
      return;
    }
    if (!transitOver) {
      return;
    }
    const focusObj = scene.getObjectByProperty(
      'uuid',
      matrix[focusIndex[0]]?.[focusIndex[1]]
    ) as CSS3DObject;
    if (focusObj) {
      focusObj.scale.setScalar(1.3);
      render();
      const curIndex = getElementIndexByUuid(focusUuid);
      curIndex > -1 && onTransitionEnd(focusObj.element, curIndex);
    }
  }, [focusIndex, focusUuid, matrix, transitOver]);

  // 获取某个对象的位置索引
  const getPositionByUuid = useCallback(
    (uuid: string): [number, number] | undefined => {
      if (!matrix || !matrix.length) {
        return;
      }
      let row = -1,
        col = -1;
      for (let i = 0, len = matrix?.length || 0; i < len; i++) {
        if (col !== -1) {
          row = i - 1;
          break;
        }
        const rowList = matrix?.[i] ?? [];
        for (let j = 0, len = rowList.length; j < len; j++) {
          if (uuid === rowList[j]) {
            col = j;
            break;
          }
        }
      }
      return [row, col];
    },
    [matrix]
  );

  const getObj3DByPosition = useCallback(
    (position: [number, number]) => {
      if (!matrix || !matrix.length) {
        return;
      }
      const uuid = matrix[position[0]][position[1]];
      return scene.getObjectByProperty('uuid', uuid) as CSS3DObject;
    },
    [matrix]
  );

  const start = useCallback(function () {
    const len = scene.children.length;
    const colNum = Math.ceil(Math.sqrt(len));
    const rowNum = Math.ceil(len / colNum);
    const matrix: string[][] = Array.from({ length: rowNum }).map((_) =>
      Array.from({ length: colNum })
    );
    scene.children.forEach((item, index) => {
      const y = Math.floor(index / colNum);
      const x = index % colNum;
      matrix[y][x] = item.uuid;
    });
    setMatrix(matrix);
  }, []);

  const getAnimateObjList = useCallback(
    (action: Action): THREE.Object3D[] => {
      if (!matrix || !matrix.length) {
        return [];
      }
      let uuidList: string[];
      if (action.type === 'col') {
        uuidList = matrix.map((row) => row[action.index]);
      } else {
        uuidList = [...matrix[action.index]];
      }
      return uuidList
        .map((uuid) => scene.getObjectByProperty('uuid', uuid))
        .filter((_) => !!_) as THREE.Object3D[];
    },
    [matrix]
  );

  const getNewMatrix = useCallback(
    (action: Action): string[][] => {
      if (!matrix || !matrix.length) {
        return [];
      }
      if (action.type === 'col') {
        return matrix.map((row, i) => {
          return row.map((cell, j) => {
            if (j === action.index) {
              let initialIndex = action.forward
                ? i - action.distance
                : i + action.distance;
              initialIndex =
                ((initialIndex % matrix.length) + matrix.length) %
                matrix.length;
              return matrix[initialIndex][j];
            }
            return cell;
          });
        });
      } else {
        return matrix.map((row, i) => {
          if (i === action.index) {
            return row.map((cell, j) => {
              let initialIndex = action.forward
                ? j - action.distance
                : j + action.distance;
              initialIndex =
                ((initialIndex % row.length) + row.length) % row.length;
              return row[initialIndex];
            });
          } else {
            return [...row];
          }
        });
      }
    },
    [matrix]
  );

  useEffect(() => {
    if (!matrix || !matrix.length) {
      return;
    }
    if (!focusIndex) {
      return;
    }
    setFocusUuid(matrix[focusIndex[0]][focusIndex[1]]);
  }, [focusIndex, matrix]);

  useEffect(() => {
    if (transiting || !autoTransit) {
      return;
    }
    const timer = window.setTimeout(() => {
      const objList = scene.children;
      const curIndex = getElementIndexByUuid(focusUuid);
      if (curIndex !== -1) {
        const nextIndex = (curIndex + 1) % objList.length;
        setTransitOver(false);
        setFocusUuid(objList[nextIndex].uuid);
      }
    }, 12000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [transiting, autoTransit, focusUuid]);

  useEffect(
    function () {
      function getHandleObjUuid(event: MouseEvent) {
        let target = event.target as HTMLElement | null;
        while (
          target &&
          target !== renderer.domElement &&
          !target.getAttribute('uuid')
        ) {
          target = target.parentElement;
        }
        if (!target || target === renderer.domElement) {
          return;
        }
        return target.getAttribute('uuid');
      }

      function clickHandler(this: HTMLElement, event: MouseEvent) {
        const uuid = getHandleObjUuid(event);
        if (!uuid) {
          return;
        }
        setTransitOver(false);
        setFocusUuid(uuid);
      }
      // 点击事件
      if (focusIndex && !transiting) {
        renderer.domElement.addEventListener('click', clickHandler);
      }
      return () => {
        renderer.domElement.removeEventListener('click', clickHandler);
      };
    },
    [focusIndex, transiting, getPositionByUuid]
  );

  useEffect(() => {
    if (!focusIndex || !focusUuid) {
      return;
    }
    const originIndex = getPositionByUuid(focusUuid);
    if (!originIndex) {
      return;
    }
    // TODO 暂不支持连续点击两个
    const stack: Action[] = [];
    if (originIndex[0] !== focusIndex[0]) {
      // 纵向旋转
      stack.push({
        type: 'col',
        index: originIndex[1],
        forward: focusIndex[0] > originIndex[0],
        distance: Math.abs(focusIndex[0] - originIndex[0]),
      });
    }
    if (originIndex[1] !== focusIndex[1]) {
      // 横向旋转
      stack.push({
        type: 'row',
        index: focusIndex[0],
        forward: focusIndex[1] > originIndex[1],
        distance: Math.abs(focusIndex[1] - originIndex[1]),
      });
    }
    setActionStack(stack);
  }, [focusUuid]);

  // 注册focusDOM事件
  useEffect(() => {
    const eventHandlers = new Map<string, (e: Event) => void>();
    if (!focusEleEventHandlers || !Object.keys(focusEleEventHandlers).length) {
      return;
    }
    if (!focusUuid || !focusIndex || !matrix) {
      return;
    }

    const nextFocusEle = (
      scene.getObjectByProperty('uuid', focusUuid) as CSS3DObject
    )?.element;
    const nextFocusEleIndex = getElementIndexByUuid(focusUuid);
    if (nextFocusEle) {
      Object.keys(focusEleEventHandlers).forEach((eventType: string) => {
        const handler = focusEleEventHandlers[eventType];
        eventHandlers.set(eventType, (e: Event) => {
          handler.call(e.target, e, nextFocusEleIndex);
        });
      });
      for (const [eventType, handler] of eventHandlers.entries()) {
        nextFocusEle.addEventListener(eventType, handler);
      }
    }
    return () => {
      const lastFocusEle = getObj3DByPosition(focusIndex)?.element;
      if (lastFocusEle) {
        for (const [eventType, handler] of eventHandlers.entries()) {
          nextFocusEle.removeEventListener(eventType, handler);
        }
      }
    };
  }, [focusUuid, focusIndex, matrix, focusEleEventHandlers]);

  useEffect(() => {
    if (transiting || !actionStack.length) {
      return;
    }
    beforeTransit();
    // 启动转换动作
    setTransiting(true);
    setCurStep(0);
  }, [transiting, actionStack, beforeTransit]);

  useEffect(() => {
    if (curStep === undefined) {
      return;
    }
    if (curStep > actionStack.length - 1) {
      setTransiting(false);
      setActionStack([]);
      setCurStep(undefined);
      setTransitOver(true);
      return;
    }
    const action = actionStack[curStep];
    if (!action) {
      return;
    }
    const DURATION = 500;
    const animateObjList = getAnimateObjList(action);
    const len = animateObjList.length;
    animateObjList.forEach((obj, index) => {
      let nextIndex = action.forward
        ? index + action.distance
        : index - action.distance;
      const next = animateObjList[((nextIndex % len) + len) % len];
      new TWEEN.Tween(obj, tweenGrp)
        .to(
          {
            position: {
              x: next.position.x,
              y: next.position.y,
              z: next.position.z,
            },
            rotation: {
              x: next.rotation.x,
              y: next.rotation.y,
              z: next.rotation.z,
            },
          },
          DURATION
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    });
    new TWEEN.Tween({}, tweenGrp)
      .to({}, DURATION + 100)
      .onUpdate(render)
      .onComplete(() => {
        // 更新matrix和curStep
        setMatrix(getNewMatrix(action));
        setCurStep((curStep) => (curStep || 0) + 1);
      })
      .start();

    return () => {
      tweenGrp.removeAll();
    }
  }, [curStep]);

  useEffect(() => {
    if (!transiting && transitOver) {
      afterTransit();
    }
  }, [transiting, afterTransit, transitOver]);

  useEffect(() => {
    let animateIndex = 0;
    function animate() {
      animateIndex = requestAnimationFrame(animate);
      tweenGrp.update();
    }
    animate();
    return () => {
      cancelAnimationFrame(animateIndex);
    };
  }, []);
  return {
    // setCurUuid, // 初始化当前对象id
    start,
    setAutoTransit,
  };
}
