import { useCallback, useEffect, useMemo, useState } from 'react';
import * as THREE from "three";
import {
    CSS3DRenderer,
    CSS3DObject,
    CSS3DSprite,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { degToRad } from 'three/src/math/MathUtils';
import * as TWEEN from '@tweenjs/tween.js';

function getRad(x: number, y: number) {
    if (y === 0) {
        return x >= 0 ? 0 : Math.PI
    }
    const a2 = Math.atan2(y, x)
    if (a2 > 0) {
        return a2
    } else {
        return Math.PI * 2 + a2;
    }
}

function getRadToTarget(fromVector: THREE.Vector2, toVector: THREE.Vector2): [number, boolean] {
    const fromRad = getRad(fromVector.x, fromVector.y);
    const toRad = getRad(toVector.x, toVector.y);
    let isReverse = false;
    let rad = Math.abs(fromRad - toRad);
    if (toRad > fromRad) {
        isReverse = rad > Math.PI;
    } else if (fromRad > toRad) {
        isReverse = !(rad > Math.PI);
    }
    if (rad > Math.PI) {
        rad = Math.PI * 2 - rad;
    }
    rad = rad < THREE.MathUtils.degToRad(1) ? 0 : rad
    return [rad, isReverse];
};

export default function usePartialWheel(wheelRadius: number, showNum: number, cameraPostion: THREE.Vector3, cameraLookat: THREE.Vector3) {
    const [css3DRenderer, setCss3DRenderer] = useState(function () {
        return new CSS3DRenderer();
    });
    const [camera, setCamera] = useState(function () {
        return new THREE.PerspectiveCamera(40, 1, 0.1, 3000);
    });
    const [scene, setScene] = useState(function () {
        return new THREE.Scene();
    });
    const [group, setGroup] = useState(() => new THREE.Group());
    const [container, setContainer] = useState<HTMLElement>();
    const [elements, setElements] = useState<HTMLElement[]>();
    const [startIndex, setStartIndex] = useState<number>(0); // 所有项目中的索引
    const [steadyOffset, setSteadyOffset] = useState<number>(0);
    const [tweenGrp] = useState(() => new TWEEN.Group());
    const [targetStartIndex, setTargetStartIndex] = useState<number>(); // 根据选定的对象uuid，计算出展示项目中的索引，然后计算出目标startIndex
    // const [focusUuid, setFocusUuid] = useState<string>(); // 为展示指定项目，计算出目标showStartIndex
    const [isRotating, setIsRotating] = useState(false); // 
    const [rotateReverse, setRotateReverse] = useState(false);
    const PIE_RADIAN = useMemo(() => degToRad(90), []);
    const MIN_RADIAN_INTERVAL = degToRad(30);
    const FOCUS_RADIAN = useMemo(() => degToRad(90), []);
    const actualShowNum = useMemo(() => {
        const showElements = (elements ?? []).slice(0, showNum);
        return showElements.length;
    }, [elements, showNum]);
    const needSupply = useMemo(() => actualShowNum > 2, [actualShowNum]);
    const intervalRadian = useMemo(() => Math.min(actualShowNum === 1 ? Math.PI : PIE_RADIAN / (actualShowNum - 1), MIN_RADIAN_INTERVAL), [actualShowNum]);
    const render = useCallback(() => {
        css3DRenderer.render(scene, camera);
    }, [css3DRenderer, camera, scene])

    useEffect(() => {
        if (!container) {
            return;
        }
        function getHandleObjUuid(event: MouseEvent, canvas: HTMLElement) {
            let target = event.target as HTMLElement | null;
            while (target && target !== canvas && !target.getAttribute('uuid')) {
                target = target.parentElement;
            }
            if (!target || target === canvas) {
                return;
            }
            return target.getAttribute('uuid');
        }

        function clickHandler(this: HTMLElement, event: MouseEvent) {
            const uuid = getHandleObjUuid(event, this);
            if (!uuid) {
                return;
            }
        }
        function addEvents(canvas: HTMLElement) {
            canvas.addEventListener('click', clickHandler);
        }
        function removeEvents(canvas: HTMLElement) {
            canvas.removeEventListener('click', clickHandler);
        }
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.position.copy(cameraPostion);
        camera.lookAt(cameraLookat);
        camera.updateProjectionMatrix();
        css3DRenderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(css3DRenderer.domElement);
        scene.add(group);
        addEvents(css3DRenderer.domElement);
        return () => {
            removeEvents(css3DRenderer.domElement);
        }
    }, [container]);

    useEffect(() => {
        if (!elements?.length) {
            return;
        }
        const showElements = elements.slice(0, actualShowNum);
        const showObjList = showElements.map((ele) => {
            const object = new CSS3DSprite(ele.cloneNode(true) as HTMLElement);
            object.element.setAttribute('uuid', object.uuid);
            return object;
        });
        const startRadian = FOCUS_RADIAN + (actualShowNum - 1) / 2 * intervalRadian;
        showObjList.forEach((obj, index) => {
            obj.element.style.setProperty('opacity', '0');
            const radian = startRadian - intervalRadian * index;
            obj.position.set(wheelRadius * Math.cos(radian), 0, wheelRadius * Math.sin(radian));
        });
        group.add(...showObjList);
        
        const tween = new TWEEN.Tween({ p: 0}, tweenGrp).to({ p: 1 }, 2000).easing(TWEEN.Easing.Linear.None).onUpdate(({p}) => {
            showObjList.forEach((obj, index) => {
                obj.element.style.setProperty('opacity', p + '');
            });
        }).onComplete(() => {
            setIsRotating(true);
        }).start();

        return () => {
            group.clear();
            setStartIndex(0);
            setSteadyOffset(0);
            setIsRotating(false);
            tweenGrp.remove(tween);
        }
    }, [elements, actualShowNum]);

    useEffect(() => {
        if (!actualShowNum || !elements?.length || elements.length < 3 || startIndex === undefined || steadyOffset === undefined) {
            return;
        }
        const actualPieRadian = (actualShowNum - 1) * intervalRadian;
        let tween: TWEEN.Tween<any>;
        const totalNum = elements.length;
        if (isRotating) {
            if (steadyOffset === 0) {
                if (needSupply) { // 准备好下一个对象
                    const newObjIndex = (((startIndex + (rotateReverse ? -1 : actualShowNum)) % totalNum) + totalNum) % totalNum;
                    const newObj = new CSS3DSprite(elements[newObjIndex].cloneNode(true) as HTMLElement);
                    newObj.element.setAttribute('uuid', newObj.uuid);
                    newObj.element.style.setProperty('opacity', '0');
                    const radian = FOCUS_RADIAN + (rotateReverse ? (actualPieRadian / 2 + intervalRadian) : -(actualPieRadian / 2 + intervalRadian));
                    newObj.position.set(wheelRadius * Math.cos(radian), 0, wheelRadius * Math.sin(radian));
                    if(rotateReverse) {
                        const initialObjs = [...group.children];
                        group.clear();
                        group.add(...[newObj, ...initialObjs]);
                    } else {
                        group.add(newObj);
                    } 
                }
                setSteadyOffset(intervalRadian);
                const nextIndex = (((startIndex + (rotateReverse ? -1 : 1)) % totalNum) + totalNum) % totalNum;
                setStartIndex(nextIndex);
            } else {
                const unshownNum = totalNum - actualShowNum;
                // const DURATION = unshownNum ? 10000 / (totalNum - 1) : 4000;
                const DURATION = intervalRadian / (PIE_RADIAN / 12) * 1000; // 以4个展示的12s为标准速度
                let increment = 0;
                tween = new TWEEN.Tween({ rotate: 0 }, tweenGrp)
                    .to({ rotate: steadyOffset }, DURATION)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(({ rotate }) => {
                        group.children.forEach((obj, index) => {
                            obj.position.applyAxisAngle(new THREE.Vector3(0, rotateReverse ? 1 : -1, 0), rotate - increment);
                            if (index === 0 && !rotateReverse || index === group.children.length - 1 && rotateReverse) {
                                (group.children[index] as CSS3DSprite).element.style.setProperty('opacity', (1 - rotate / steadyOffset) + '');
                            }
                            if (index === group.children.length - 1 && !rotateReverse || index === 0 && rotateReverse) {
                                (group.children[index] as CSS3DSprite).element.style.setProperty('opacity', (rotate / steadyOffset) + '');
                            }
                        });
                        increment = rotate;
                    })
                    .onComplete(() => {
                        if(rotateReverse) {
                            group.remove(group.children[group.children.length - 1]);
                        } else {
                            group.remove(group.children[0]);
                        }
                        setSteadyOffset(0);
                    })
                    .start();
            }
        }

        return () => {
            // tween && TWEEN.remove(tween);
            tween && tweenGrp.remove(tween);
        }
    }, [isRotating, startIndex, steadyOffset, rotateReverse, actualShowNum]);

    useEffect(() => {
        let animateIndex = 0;
        function animate() {
            animateIndex = requestAnimationFrame(animate);
            render();
            tweenGrp.update();
        }
        animate();
        return () => {
            cancelAnimationFrame(animateIndex);
        };
    }, []);
    return { setContainer, setElements };
}