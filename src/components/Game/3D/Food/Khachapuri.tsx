import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export const Khachapuri = () => {
  const { materials, shapes } = useMemo(() => {
    const doughMat = new THREE.MeshStandardMaterial({
      roughness: 0.85,   
      metalness: 0.0,
      flatShading: false, 
      vertexColors: true, 
      side: THREE.DoubleSide,
    });

    const cheeseMat = new THREE.MeshStandardMaterial({
      color: "#ffc400", 
      roughness: 0.3,
      metalness: 0.1,
      emissive: "#ffab00",
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide,
    });

    const yolkMat = new THREE.MeshStandardMaterial({
      color: "#f1964f",
      roughness: 0.1,
      metalness: 0.0,
    });

    const butterMat = new THREE.MeshStandardMaterial({
      color: "#fffacd",
      roughness: 0.3,
      opacity: 0.9,
      transparent: true,
    });

    const crustRadius = 0.18; 

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, 0, 0),
      new THREE.Vector3(-0.6, 0, 0.55),
      new THREE.Vector3(0.6, 0, 0.55), 
      new THREE.Vector3(1.2, 0, 0),
      new THREE.Vector3(0.6, 0, -0.55),
      new THREE.Vector3(-0.6, 0, -0.55),
    ], true, 'catmullrom', 0.4);

    const cheeseShape = new THREE.Shape();
    cheeseShape.moveTo(-1.2, 0);
    cheeseShape.bezierCurveTo(-0.6, 0.65, 0.6, 0.65, 1.2, 0);
    cheeseShape.bezierCurveTo(0.6, -0.65, -0.6, -0.65, -1.2, 0);

    return { 
      materials: { dough: doughMat, cheese: cheeseMat, yolk: yolkMat, butter: butterMat },
      shapes: { curve, cheeseShape, crustRadius }
    };
  }, []);

  const crustGeoRef = useRef<THREE.BufferGeometry>(null);
  const leftTipRef = useRef<THREE.BufferGeometry>(null);
  const rightTipRef = useRef<THREE.BufferGeometry>(null);
  
  const applyDoughTexture = (geo: THREE.BufferGeometry, isTip: boolean = false) => {
    const count = geo.attributes.position.count;
    if (!geo.attributes.color) geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const posAttribute = geo.attributes.position;
    const colorAttribute = geo.attributes.color;
    const vertex = new THREE.Vector3();
    const baseColor = new THREE.Color("#dca560");
    const burntColor = new THREE.Color("#8a5020");

    const cylinderHeight = 0.3; 
    const halfHeight = cylinderHeight / 2; 

    for (let i = 0; i < count; i++) {
        vertex.fromBufferAttribute(posAttribute, i);
        
        if (isTip) {
            let t = (vertex.y + halfHeight) / cylinderHeight;
            t = Math.max(0, Math.min(1, t)); 

            const roundingScale = Math.sqrt(1.0 - t * t);

            vertex.x *= roundingScale;
            vertex.z *= roundingScale;

            const normalizedY = (vertex.y + halfHeight); 
            const twistAmount = normalizedY * 6.0; 
            const cosT = Math.cos(twistAmount);
            const sinT = Math.sin(twistAmount);
            const x = vertex.x * cosT - vertex.z * sinT;
            const z = vertex.x * sinT + vertex.z * cosT;
            vertex.x = x; vertex.z = z;
        }

        const noise = Math.sin(vertex.x * 12) * Math.cos(vertex.y * 12) * Math.sin(vertex.z * 12 + i * 0.1);
        let displacement = noise * 0.025; 
        if (isTip && vertex.y > 0.1) displacement *= 0.3;

        vertex.addScaledVector(vertex.clone().normalize(), displacement); 
        posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);

        const mixFactor = (noise + 1) / 2; 
        const finalColor = baseColor.clone().lerp(burntColor, Math.pow(mixFactor, 4) * 0.9);
        colorAttribute.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
    }
    geo.computeVertexNormals();
    posAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  };

  useLayoutEffect(() => {
    if (crustGeoRef.current) applyDoughTexture(crustGeoRef.current, false);
    if (leftTipRef.current) applyDoughTexture(leftTipRef.current, true);
    if (rightTipRef.current) applyDoughTexture(rightTipRef.current, true);
  }, []);

  return (
    <group rotation={[0, 0, 0]} scale={0.4}>
      <mesh material={materials.dough}>
        <tubeGeometry ref={crustGeoRef} args={[shapes.curve, 128, shapes.crustRadius, 64, true]} />
      </mesh>

      <group position={[0, -shapes.crustRadius * 0.4, 0]}>
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.dough}>
           <shapeGeometry args={[shapes.cheeseShape]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.02} material={materials.cheese}>
          <shapeGeometry args={[shapes.cheeseShape]} />
        </mesh>
      </group>

      <mesh position={[0, 0, 0]} material={materials.yolk}>
        <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
      </mesh>
      <mesh position={[0.35, 0.05, 0.1]} rotation={[0, 0.5, 0.2]} material={materials.butter}>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
      </mesh>

      <group>
        <mesh position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.dough}>
          <cylinderGeometry ref={leftTipRef} args={[0.05, shapes.crustRadius * 0.98, 0.3, 32, 32]} />
        </mesh>
        
        <mesh position={[1.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.dough}>
          <cylinderGeometry ref={rightTipRef} args={[0.05, shapes.crustRadius * 0.98, 0.3, 32, 32]} />
        </mesh>
      </group>
    </group>
  );
};