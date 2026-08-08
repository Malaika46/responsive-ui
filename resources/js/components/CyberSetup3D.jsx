import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CyberSetup3D = ({ rgbColor = '#D946EF' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050508');
    scene.fog = new THREE.FogExp2('#050508', 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Interactive Drag Orbit Variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = 0; // horizontal angle
    let phi = 0.5; // vertical angle
    let targetTheta = 0;
    let targetPhi = 0.5;
    let radius = 9.5; // distance from center
    let autoRotate = true;
    let autoRotateSpeed = 0.005;

    // Lights
    const ambientLight = new THREE.AmbientLight('#0a0a14', 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Setup Theme Colors
    const primaryColor = new THREE.Color(rgbColor);

    // Dynamic LED Point Light under screen/desk
    const ledLight = new THREE.PointLight(primaryColor, 3, 8);
    ledLight.position.set(0, 0.8, -0.5);
    scene.add(ledLight);

    // --- PROCEDURAL SETUP MODELS ---
    const setupGroup = new THREE.Group();
    scene.add(setupGroup);

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x111118,
      roughness: 0.2,
      metalness: 0.8
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.4,
      metalness: 0.2
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.2
    });

    const ledMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      toneMapped: false
    });

    // 1. Desk Top (Glass / Carbon fiber hybrid)
    const deskTopGeom = new THREE.BoxGeometry(6, 0.15, 2.5);
    const deskTop = new THREE.Mesh(deskTopGeom, carbonMaterial);
    deskTop.position.y = 0.5;
    deskTop.receiveShadow = true;
    setupGroup.add(deskTop);

    // LED strip on back of desk
    const ledStripGeom = new THREE.BoxGeometry(5.8, 0.04, 0.04);
    const ledStrip = new THREE.Mesh(ledStripGeom, ledMaterial);
    ledStrip.position.set(0, 0.45, -1.22);
    setupGroup.add(ledStrip);

    // 2. Desk Legs (Cyber metallic pillars)
    const legGeom = new THREE.BoxGeometry(0.2, 1.2, 0.2);
    const legPositions = [
      [-2.8, -0.1, -1.1],
      [2.8, -0.1, -1.1],
      [-2.8, -0.1, 1.1],
      [2.8, -0.1, 1.1]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeom, metalMaterial);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      setupGroup.add(leg);
    });

    // Desk Base Glow
    const floorGlowGeom = new THREE.PlaneGeometry(6, 2.5);
    const floorGlowMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const floorGlow = new THREE.Mesh(floorGlowGeom, floorGlowMat);
    floorGlow.rotation.x = Math.PI / 2;
    floorGlow.position.y = -0.69;
    setupGroup.add(floorGlow);

    // 3. Monitor Stand
    const standBaseGeom = new THREE.BoxGeometry(0.6, 0.05, 0.4);
    const standBase = new THREE.Mesh(standBaseGeom, metalMaterial);
    standBase.position.set(0, 0.6, -0.8);
    setupGroup.add(standBase);

    const standPoleGeom = new THREE.BoxGeometry(0.12, 1.1, 0.12);
    const standPole = new THREE.Mesh(standPoleGeom, metalMaterial);
    standPole.position.set(0, 1.1, -0.95);
    standPole.rotation.x = -0.1;
    setupGroup.add(standPole);

    // 4. Curved Ultra-wide Screen Panel
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 1.5, -0.8);
    setupGroup.add(monitorGroup);

    // Create curved screen procedurally by segments
    const screenSegments = 16;
    const curveRadius = 6;
    const curveAngle = Math.PI / 5; // curved arc
    const screenHeight = 1.0;
    const screenDepth = 0.08;

    const screenGeometry = new THREE.CylinderGeometry(
      curveRadius,
      curveRadius,
      screenHeight,
      screenSegments,
      1,
      true, // open ended
      Math.PI * 1.5 - curveAngle / 2,
      curveAngle
    );

    // Generate dynamic Canvas texture for simulated monitor diagnostic graphics
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 512;
    canvasTex.height = 128;
    const ctx = canvasTex.getContext('2d');
    
    const updateCanvasTexture = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, 512, 128);

      // Cyber grid background
      ctx.strokeStyle = `rgba(${primaryColor.r * 255}, ${primaryColor.g * 255}, ${primaryColor.b * 255}, 0.12)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 128);
        ctx.stroke();
      }
      for (let y = 0; y < 128; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Horizontal scanning line
      const scanY = (Date.now() / 25) % 128;
      ctx.fillStyle = `rgba(${primaryColor.r * 255}, ${primaryColor.g * 255}, ${primaryColor.b * 255}, 0.2)`;
      ctx.fillRect(0, scanY, 512, 2);

      // CPU/GPU text metrics
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('NEONFORGE BATTLESTATION V4.8', 16, 32);

      ctx.fillStyle = rgbColor;
      ctx.font = '13px monospace';
      ctx.fillText(`SYS: ONLINE`, 16, 60);
      ctx.fillText(`CPU: 42°C  | GPU: 58°C`, 16, 85);
      ctx.fillText(`AUDIO LOCK: 99.8%`, 16, 110);

      // Glowing visualizer bars
      const numBars = 10;
      for (let i = 0; i < numBars; i++) {
        const h = Math.abs(Math.sin(Date.now() * 0.003 + i * 0.5)) * 50;
        ctx.fillStyle = rgbColor;
        ctx.fillRect(350 + i * 14, 110 - h, 10, h);
      }
    };

    updateCanvasTexture();
    const screenTexture = new THREE.CanvasTexture(canvasTex);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });

    const screenMesh = new THREE.Mesh(screenGeometry, screenMat);
    // Rotate cylinder segment to face forward
    screenMesh.rotation.y = 0;
    screenMesh.position.z = curveRadius;
    monitorGroup.add(screenMesh);

    // Curved backing frame for monitor
    const backGeom = new THREE.CylinderGeometry(
      curveRadius + screenDepth,
      curveRadius + screenDepth,
      screenHeight + 0.06,
      screenSegments,
      1,
      false,
      Math.PI * 1.5 - curveAngle / 2,
      curveAngle
    );
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.7,
      metalness: 0.5
    });
    const backMesh = new THREE.Mesh(backGeom, backMat);
    backMesh.position.z = curveRadius;
    monitorGroup.add(backMesh);

    // Glowing logo strip on screen back
    const backGlowGeom = new THREE.BoxGeometry(0.1, 0.8, 0.05);
    const backGlowMesh = new THREE.Mesh(backGlowGeom, ledMaterial);
    backGlowMesh.position.set(0, 0, -0.05);
    monitorGroup.add(backGlowMesh);

    // 5. Gaming PC Tower (Transparent case with internal hardware)
    const pcGroup = new THREE.Group();
    pcGroup.position.set(2.1, 0.95, -0.2);
    setupGroup.add(pcGroup);

    // PC Outer Case (Glossy Glass Panel)
    const pcShellGeom = new THREE.BoxGeometry(0.7, 1.0, 0.8);
    const pcGlass = new THREE.Mesh(pcShellGeom, glassMaterial);
    pcGlass.castShadow = true;
    pcGroup.add(pcGlass);

    // PC metal frame rails
    const pcFrameGeom = new THREE.BoxGeometry(0.72, 1.02, 0.04);
    const pcFrameF = new THREE.Mesh(pcFrameGeom, metalMaterial);
    pcFrameF.position.z = 0.38;
    pcGroup.add(pcFrameF);
    const pcFrameB = new THREE.Mesh(pcFrameGeom, metalMaterial);
    pcFrameB.position.z = -0.38;
    pcGroup.add(pcFrameB);

    // Internal Motherboard Block
    const moboGeom = new THREE.BoxGeometry(0.08, 0.8, 0.6);
    const moboMat = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.9 });
    const mobo = new THREE.Mesh(moboGeom, moboMat);
    mobo.position.x = -0.25;
    pcGroup.add(mobo);

    // GPU Block
    const gpuGeom = new THREE.BoxGeometry(0.4, 0.18, 0.5);
    const gpuMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.3 });
    const gpu = new THREE.Mesh(gpuGeom, gpuMat);
    gpu.position.set(0, -0.1, 0.05);
    pcGroup.add(gpu);

    // Glowing RGB strip on GPU
    const gpuStripGeom = new THREE.BoxGeometry(0.42, 0.02, 0.04);
    const gpuStrip = new THREE.Mesh(gpuStripGeom, ledMaterial);
    gpuStrip.position.set(0, -0.05, 0.31);
    pcGroup.add(gpuStrip);

    // Spinning Cooler Fans (internal coolers)
    const coolerGroup = new THREE.Group();
    coolerGroup.position.set(0, 0.18, 0.1);
    pcGroup.add(coolerGroup);

    const fanRingGeom = new THREE.RingGeometry(0.12, 0.15, 16);
    const fanRingMat = new THREE.MeshBasicMaterial({ color: primaryColor, side: THREE.DoubleSide });
    const fanRing1 = new THREE.Mesh(fanRingGeom, fanRingMat);
    fanRing1.rotation.y = Math.PI / 2;
    fanRing1.position.z = -0.15;
    coolerGroup.add(fanRing1);

    const fanRing2 = new THREE.Mesh(fanRingGeom, fanRingMat);
    fanRing2.rotation.y = Math.PI / 2;
    fanRing2.position.z = 0.15;
    coolerGroup.add(fanRing2);

    // Rotating fan blades inside rings
    const bladeGeom = new THREE.BoxGeometry(0.02, 0.25, 0.04);
    const bladeGroup1 = new THREE.Group();
    bladeGroup1.position.set(0.01, 0, -0.15);
    coolerGroup.add(bladeGroup1);
    const bladeGroup2 = new THREE.Group();
    bladeGroup2.position.set(0.01, 0, 0.15);
    coolerGroup.add(bladeGroup2);

    for (let j = 0; j < 3; j++) {
      const b1 = new THREE.Mesh(bladeGeom, metalMaterial);
      b1.rotation.x = (j * Math.PI) / 3;
      bladeGroup1.add(b1);

      const b2 = new THREE.Mesh(bladeGeom, metalMaterial);
      b2.rotation.x = (j * Math.PI) / 3;
      bladeGroup2.add(b2);
    }

    // 6. Cyber mechanical keyboard
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.5, 0.6, 0.2);
    setupGroup.add(kbGroup);

    const kbBaseGeom = new THREE.BoxGeometry(1.4, 0.05, 0.55);
    const kbBase = new THREE.Mesh(kbBaseGeom, carbonMaterial);
    kbGroup.add(kbBase);

    // Multi-colored glowing keys
    const keysGeom = new THREE.BoxGeometry(1.3, 0.03, 0.45);
    const keysMat = new THREE.MeshBasicMaterial({ color: primaryColor });
    const keys = new THREE.Mesh(keysGeom, keysMat);
    keys.position.y = 0.03;
    kbGroup.add(keys);

    // 7. Mouse
    const mouseGeom = new THREE.BoxGeometry(0.2, 0.08, 0.35);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x09090c, roughness: 0.1 });
    const mouse = new THREE.Mesh(mouseGeom, mouseMat);
    mouse.position.set(0.7, 0.61, 0.2);
    setupGroup.add(mouse);

    const mouseWheelGeom = new THREE.BoxGeometry(0.02, 0.04, 0.08);
    const mouseWheel = new THREE.Mesh(mouseWheelGeom, ledMaterial);
    mouseWheel.position.set(0.7, 0.65, 0.14);
    setupGroup.add(mouseWheel);

    // 8. Headset on Stand (Left side of desk)
    const headsetStandGroup = new THREE.Group();
    headsetStandGroup.position.set(-2.0, 0.58, -0.3);
    setupGroup.add(headsetStandGroup);

    // Base
    const hsBaseGeom = new THREE.BoxGeometry(0.3, 0.03, 0.3);
    const hsBase = new THREE.Mesh(hsBaseGeom, metalMaterial);
    headsetStandGroup.add(hsBase);

    // Pole
    const hsPoleGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
    const hsPole = new THREE.Mesh(hsPoleGeom, metalMaterial);
    hsPole.position.y = 0.4;
    headsetStandGroup.add(hsPole);

    // Holder hook
    const hsHookGeom = new THREE.BoxGeometry(0.04, 0.04, 0.25);
    const hsHook = new THREE.Mesh(hsHookGeom, metalMaterial);
    hsHook.position.set(0, 0.8, 0.06);
    headsetStandGroup.add(hsHook);

    // Hanging headphones
    const headset = new THREE.Group();
    headset.position.set(0, 0.65, 0.06);
    headsetStandGroup.add(headset);

    const arcGeom = new THREE.TorusGeometry(0.18, 0.03, 8, 24, Math.PI);
    const hsArc = new THREE.Mesh(arcGeom, carbonMaterial);
    hsArc.rotation.x = Math.PI;
    hsArc.position.y = 0.12;
    headset.add(hsArc);

    const cupGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16);
    const hsCupL = new THREE.Mesh(cupGeom, metalMaterial);
    hsCupL.rotation.z = Math.PI / 2;
    hsCupL.position.set(-0.19, -0.05, 0);
    headset.add(hsCupL);

    const hsCupR = hsCupL.clone();
    hsCupR.position.x = 0.19;
    headset.add(hsCupR);

    // Cup glow highlights
    const cupGlowGeom = new THREE.RingGeometry(0.04, 0.06, 12);
    const hsCupGlowL = new THREE.Mesh(cupGlowGeom, ledMaterial);
    hsCupGlowL.rotation.y = Math.PI / 2;
    hsCupGlowL.position.set(-0.235, -0.05, 0);
    headset.add(hsCupGlowL);

    const hsCupGlowR = hsCupGlowL.clone();
    hsCupGlowR.rotation.y = -Math.PI / 2;
    hsCupGlowR.position.x = 0.235;
    headset.add(hsCupGlowR);

    // --- INTERACTIVE ORBIT EVENT LISTENERS ---
    const onPointerDown = (e) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetTheta += deltaX * 0.005;
      targetPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, targetPhi - deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      radius = Math.max(5.0, Math.min(15.0, radius + e.deltaY * 0.008));
    };

    // Attach listeners directly to canvas
    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotation
      if (autoRotate) {
        targetTheta += autoRotateSpeed;
      }

      // Smooth camera orbit damping
      theta += (targetTheta - theta) * 0.1;
      phi += (targetPhi - phi) * 0.1;

      // Update camera position using spherical coordinates
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi) + 0.5; // offset upward
      camera.lookAt(0, 0.8, 0);

      // Spin internal PC cooler fans
      bladeGroup1.rotation.x += 0.2;
      bladeGroup2.rotation.x += 0.2;

      // Update Canvas Texture and visualizer bars
      updateCanvasTexture();
      screenTexture.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('wheel', onWheel);
      
      // Dispose resources
      deskTopGeom.dispose();
      ledStripGeom.dispose();
      legGeom.dispose();
      floorGlowGeom.dispose();
      standBaseGeom.dispose();
      standPoleGeom.dispose();
      screenGeometry.dispose();
      backGeom.dispose();
      backGlowGeom.dispose();
      pcShellGeom.dispose();
      pcFrameGeom.dispose();
      moboGeom.dispose();
      gpuGeom.dispose();
      gpuStripGeom.dispose();
      fanRingGeom.dispose();
      bladeGeom.dispose();
      kbBaseGeom.dispose();
      keysGeom.dispose();
      mouseGeom.dispose();
      mouseWheelGeom.dispose();
      hsBaseGeom.dispose();
      hsPoleGeom.dispose();
      hsHookGeom.dispose();
      arcGeom.dispose();
      cupGeom.dispose();
      cupGlowGeom.dispose();

      carbonMaterial.dispose();
      metalMaterial.dispose();
      glassMaterial.dispose();
      ledMaterial.dispose();
      floorGlowMat.dispose();
      screenMat.dispose();
      backMat.dispose();
      moboMat.dispose();
      gpuMat.dispose();
      fanRingMat.dispose();
      keysMat.dispose();
      mouseMat.dispose();

      screenTexture.dispose();
      canvasTex.remove();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [rgbColor]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden" 
      style={{ minHeight: '350px' }}
    />
  );
};

export default CyberSetup3D;
