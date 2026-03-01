import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export type LabadzeGhostName = 'iko' | 'jafara' | 'kakaba' | 'janela';

type ModelProps = React.ComponentProps<'group'> & {
  ghostState: string; 
  name: LabadzeGhostName; 
};

export function LabadzeGhostModel({ ghostState, name, ...props }: ModelProps) {
  const group = useRef<THREE.Group>(null);

  const idle = useGLTF(`/models/${name}-wait.glb`);
  const chase = useGLTF(`/models/${name}-chase.glb`);
  const scared = useGLTF(`/models/${name}-scared.glb`);

  const idleAnim = useAnimations(idle.animations, idle.scene);
  const chaseAnim = useAnimations(chase.animations, chase.scene);
  const scaredAnim = useAnimations(scared.animations, scared.scene);

  const isScared = ghostState === 'SCARED' || ghostState === 'FLASHING';
  
  const isRunning = 
    ghostState === 'NORMAL' || 
    ghostState === 'CHASING' || 
    ghostState === 'SCATTER' || 
    ghostState === 'EATEN' || 
    ghostState === 'EYES';

  const isIdle = !isScared && !isRunning;

  useEffect(() => {
    const playAnim = (
      actions: { [key: string]: THREE.AnimationAction | null }, 
      shouldPlay: boolean
    ) => {
      const action = Object.values(actions)[0];
      
      if (action) {
        if (shouldPlay) {
            action.reset().fadeIn(0.2).play();
            action.timeScale = (ghostState === 'EATEN' || ghostState === 'EYES') ? 1.5 : 1;
        } else {
            action.fadeOut(0.2);
        }
      }
    };

    playAnim(idleAnim.actions, isIdle);
    playAnim(chaseAnim.actions, isRunning);
    playAnim(scaredAnim.actions, isScared);

  }, [ghostState, isIdle, isRunning, isScared, idleAnim, chaseAnim, scaredAnim]);
  

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive 
        object={idle.scene} 
        visible={isIdle} 
        scale={isIdle ? 1 : 0} 
      />

      <primitive 
        object={chase.scene} 
        visible={isRunning} 
        scale={isRunning ? 1 : 0} 
      />

      <primitive 
        object={scared.scene} 
        visible={isScared} 
        scale={isScared ? 1 : 0} 
      />
    </group>
  );
}
