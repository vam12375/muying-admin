'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D黏土风场景组件 - 云端育儿室版本
 * 实现漂浮的马卡龙色球体和交互式守护精灵
 * Source: 云端育儿室设计文档 (d.md, ui.md)
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 * 
 * 特性：
 * - 马卡龙色系的3D漂浮球体
 * - 跟随鼠标的可爱守护精灵
 * - 柔和的灯光和阴影系统
 * - 流畅的动画和性能优化
 */

interface ThreeSceneProps {
  onPasswordFocus?: boolean; // 密码框焦点状态
}

export default function ThreeScene({ onPasswordFocus }: ThreeSceneProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<THREE.Group | null>(null);
  const leftEyeRef = useRef<THREE.Mesh | null>(null);
  const rightEyeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. 初始化场景 ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FDFBF7'); // 暖米色背景
    scene.fog = new THREE.Fog('#FDFBF7', 10, 50); // 雾效增强深度

    // --- 2. 相机设置 ---
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 15;

    // --- 3. 渲染器 ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 性能优化
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // --- 4. 灯光系统 (营造温暖氛围) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeeb1, 1.5); // 暖黄光
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0xffc0cb, 0.8); // 粉色补光
    fillLight.position.set(-10, 0, 10);
    scene.add(fillLight);

    // --- 5. 创建材质 (黏土质感的核心) ---
    const clayMaterialBase = {
      roughness: 0.4,    // 粗糙度：哑光橡胶质感
      metalness: 0.1,
      clearcoat: 0.1,    // 清漆层
      clearcoatRoughness: 0.4,
    };

    // --- 6. 创建漂浮物体 ---
    const objects: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const colors = [0xFF9A9E, 0xA18CD1, 0xFAD0C4, 0x84FAB0]; // 马卡龙色

    // 根据屏幕大小调整球体数量
    const isMobile = window.innerWidth < 768;
    const ballCount = isMobile ? 8 : 15;

    for (let i = 0; i < ballCount; i++) {
      const material = new THREE.MeshPhysicalMaterial({
        ...clayMaterialBase,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // 随机分布
      mesh.position.x = (Math.random() - 0.5) * 30;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 10 - 5;
      
      // 随机大小
      const scale = Math.random() * 1.5 + 0.5;
      mesh.scale.set(scale, scale, scale);
      
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // 保存自定义动画数据
      (mesh as any).userData = {
        speed: Math.random() * 0.02 + 0.005,
        offset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y
      };

      scene.add(mesh);
      objects.push(mesh);
    }

    // --- 7. 创建"守护精灵" (跟随鼠标，可爱的小熊) ---
    const mascotGroup = new THREE.Group();
    mascotRef.current = mascotGroup;
    
    // 头部 - 更大更圆润
    const headGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const headMat = new THREE.MeshPhysicalMaterial({ 
      ...clayMaterialBase, 
      color: 0xFECFEF, // 粉色
      roughness: 0.3
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.castShadow = true;
    head.scale.set(1, 0.95, 1); // 稍微扁一点，更可爱
    mascotGroup.add(head);

    // 眼睛 - 更大更有神
    const eyeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2C2C2C });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.9, 0.6, 2.3);
    leftEyeRef.current = leftEye;
    mascotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.9, 0.6, 2.3);
    rightEyeRef.current = rightEye;
    mascotGroup.add(rightEye);

    // 眼睛高光 - 让眼睛更有生命力
    const highlightGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    const leftHighlight = new THREE.Mesh(highlightGeo, highlightMat);
    leftHighlight.position.set(-0.75, 0.75, 2.5);
    mascotGroup.add(leftHighlight);
    
    const rightHighlight = new THREE.Mesh(highlightGeo, highlightMat);
    rightHighlight.position.set(1.05, 0.75, 2.5);
    mascotGroup.add(rightHighlight);

    // 鼻子 - 小巧可爱
    const noseGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const noseMat = new THREE.MeshPhysicalMaterial({ 
      ...clayMaterialBase,
      color: 0xFF9A9E,
      roughness: 0.2
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.2, 2.6);
    nose.scale.set(1, 0.8, 0.8);
    mascotGroup.add(nose);

    // 腮红
    const blushGeo = new THREE.CircleGeometry(0.5, 16);
    const blushMat = new THREE.MeshBasicMaterial({ 
      color: 0xFFB6C1, 
      transparent: true, 
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-1.5, 0, 2);
    leftBlush.rotation.y = Math.PI / 6;
    mascotGroup.add(leftBlush);
    
    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(1.5, 0, 2);
    rightBlush.rotation.y = -Math.PI / 6;
    mascotGroup.add(rightBlush);

    // 耳朵 - 圆润可爱
    const earGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const leftEar = new THREE.Mesh(earGeo, headMat);
    leftEar.position.set(-2.2, 2.2, 0);
    leftEar.scale.set(1, 1.2, 0.6);
    mascotGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeo, headMat);
    rightEar.position.set(2.2, 2.2, 0);
    rightEar.scale.set(1, 1.2, 0.6);
    mascotGroup.add(rightEar);

    // 耳朵内部 - 粉嫩的内耳
    const innerEarGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const innerEarMat = new THREE.MeshPhysicalMaterial({
      ...clayMaterialBase,
      color: 0xFFB6C1,
      roughness: 0.2
    });
    
    const leftInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    leftInnerEar.position.set(-2.2, 2.2, 0.3);
    leftInnerEar.scale.set(0.8, 1, 0.5);
    mascotGroup.add(leftInnerEar);
    
    const rightInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    rightInnerEar.position.set(2.2, 2.2, 0.3);
    rightInnerEar.scale.set(0.8, 1, 0.5);
    mascotGroup.add(rightInnerEar);

    // 放置精灵在场景右侧
    mascotGroup.position.set(8, -2, 5);
    mascotGroup.rotation.y = -0.5; // 稍微朝左看
    scene.add(mascotGroup);

    // --- 8. 鼠标交互逻辑 ---
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      // 归一化鼠标坐标 (-1 到 1)
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- 9. 动画循环 ---
    const animate = () => {
      requestAnimationFrame(animate);

      const time = performance.now() * 0.001;

      // 漂浮球动画 - 更自然的浮动
      objects.forEach((obj) => {
        const data = (obj as any).userData;
        // 上下浮动 + 左右轻微摆动
        obj.position.y = data.initialY + Math.sin(time * 2 + data.offset) * 1.5;
        obj.position.x += Math.sin(time + data.offset) * 0.01;
        // 缓慢自转
        obj.rotation.x += data.speed;
        obj.rotation.y += data.speed;
      });

      // 精灵跟随鼠标 (插值动画，让动作更平滑)
      const targetRotationX = mouseY * 0.5;
      const targetRotationY = mouseX * 0.5 - 0.5;

      mascotGroup.rotation.x += (targetRotationX - mascotGroup.rotation.x) * 0.1;
      mascotGroup.rotation.y += (targetRotationY - mascotGroup.rotation.y) * 0.1;

      // 精灵呼吸动画 - 让它看起来活着
      const breathScale = 1 + Math.sin(time * 1.5) * 0.03;
      mascotGroup.scale.set(breathScale, breathScale, breathScale);

      // 耳朵轻微摆动
      const earWiggle = Math.sin(time * 3) * 0.1;
      if (mascotGroup.children[4]) { // 左耳
        mascotGroup.children[4].rotation.z = earWiggle;
      }
      if (mascotGroup.children[5]) { // 右耳
        mascotGroup.children[5].rotation.z = -earWiggle;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. 响应窗口大小 ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 清理函数 (防止内存泄漏) ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // 释放Three.js资源
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
