import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

type ModelProps = React.ComponentProps<'group'> & {
  ghostState: string; 
}

export function Model({ ghostState, ...props }: ModelProps) {
  const group = useRef<THREE.Group>(null)

  const idle = useGLTF('/models/kakaba-wait.glb')
  const chase = useGLTF('/models/kakaba-chase.glb')
  const scared = useGLTF('/models/kakaba-scared.glb')

  const idleAnim = useAnimations(idle.animations, idle.scene)
  const chaseAnim = useAnimations(chase.animations, chase.scene)
  const scaredAnim = useAnimations(scared.animations, scared.scene)

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
      const action = Object.values(actions)[0]
      
      if (action) {
        if (shouldPlay) {
            action.reset().fadeIn(0.2).play();
            if (ghostState === 'EATEN' || ghostState === 'EYES') {
                action.timeScale = 1.5; 
            } else {
                action.timeScale = 1;
            }
        } else {
            action.fadeOut(0.2);
        }
      }
    }

    playAnim(idleAnim.actions, isIdle)
    playAnim(chaseAnim.actions, isRunning)
    playAnim(scaredAnim.actions, isScared)

  }, [ghostState, isIdle, isRunning, isScared, idleAnim, chaseAnim, scaredAnim])

  const adjustPosition: [number, number, number] = [0, 0, 0]

  return (
    <group ref={group} {...props} dispose={null}>

      <primitive 
        object={idle.scene} 
        visible={isIdle} 
        position={adjustPosition}
        scale={isIdle ? 1 : 0} 
      />

      <primitive 
        object={chase.scene} 
        visible={isRunning} 
        position={adjustPosition}
        scale={isRunning ? 1 : 0} 
      />

      <primitive 
        object={scared.scene} 
        visible={isScared} 
        position={adjustPosition}
        scale={isScared ? 1 : 0} 
      />

    </group>
  )
}

useGLTF.preload('/models/kakaba-wait.glb')
useGLTF.preload('/models/kakaba-chase.glb')
useGLTF.preload('/models/kakaba-scared.glb')