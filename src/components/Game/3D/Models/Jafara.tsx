import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { type GLTF, SkeletonUtils } from 'three-stdlib'

type ActionName = 'IdleV4.2(maya_head)'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    avaturn_body: THREE.SkinnedMesh
    avaturn_hair_0: THREE.SkinnedMesh
    avaturn_shoes_0: THREE.SkinnedMesh
    avaturn_look_0: THREE.SkinnedMesh
    Hips: THREE.Bone
  }
  materials: {
    avaturn_body_material: THREE.MeshStandardMaterial
    avaturn_hair_0_material: THREE.MeshStandardMaterial
    avaturn_shoes_0_material: THREE.MeshStandardMaterial
    avaturn_look_0_material: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: React.JSX.IntrinsicElements['group']) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/jafara.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = actions['IdleV4.2(maya_head)'];
    if (action) {
      action.reset().fadeIn(0.5).play();
    }
    return () => {
      action?.fadeOut(0.5);
    };
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Hips} />
          <skinnedMesh name="avaturn_body" geometry={nodes.avaturn_body.geometry} material={materials.avaturn_body_material} skeleton={nodes.avaturn_body.skeleton} />
          <skinnedMesh name="avaturn_hair_0" geometry={nodes.avaturn_hair_0.geometry} material={materials.avaturn_hair_0_material} skeleton={nodes.avaturn_hair_0.skeleton} />
          <skinnedMesh name="avaturn_shoes_0" geometry={nodes.avaturn_shoes_0.geometry} material={materials.avaturn_shoes_0_material} skeleton={nodes.avaturn_shoes_0.skeleton} />
          <skinnedMesh name="avaturn_look_0" geometry={nodes.avaturn_look_0.geometry} material={materials.avaturn_look_0_material} skeleton={nodes.avaturn_look_0.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/jafara.glb')