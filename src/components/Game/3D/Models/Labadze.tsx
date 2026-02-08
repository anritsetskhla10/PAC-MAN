import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

type ModelProps = React.ComponentProps<'group'> & {
  playerState: string; 
}

export function Model({ playerState, ...props }: ModelProps) {
  const group = useRef<THREE.Group>(null)

  const idle = useGLTF('/models/labadze-idle.glb')
  const run = useGLTF('/models/labadze-run.glb')
  const death = useGLTF('/models/labadze-death.glb')

  const idleAnim = useAnimations(idle.animations, idle.scene)
  const runAnim = useAnimations(run.animations, run.scene)
  const deathAnim = useAnimations(death.animations, death.scene)

  const isDead = playerState === 'DYING' || playerState === 'GAME_OVER' || playerState === 'DEAD'
  const isMoving = (playerState === 'MOVING' || playerState === 'RUNNING') && !isDead
  const isIdle = !isDead && !isMoving

  useEffect(() => {
    const deathAction = Object.values(deathAnim.actions)[0]
    
    if (isDead) {
      if (deathAction) {
        deathAction.reset();
        deathAction.setLoop(THREE.LoopOnce, 1); 
        deathAction.clampWhenFinished = true; 
        deathAction.play();
      }
    } else {
      deathAction?.stop();
    }

    const runAction = Object.values(runAnim.actions)[0]
    if (isMoving) runAction?.reset().fadeIn(0.1).play()
    else runAction?.fadeOut(0.1)

    const idleAction = Object.values(idleAnim.actions)[0]
    if (isIdle) idleAction?.reset().fadeIn(0.1).play()
    else idleAction?.fadeOut(0.1)

  }, [playerState, isDead, isMoving, isIdle, idleAnim, runAnim, deathAnim])

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
        object={run.scene} 
        visible={isMoving} 
        position={adjustPosition}
        scale={isMoving ? 1 : 0} 
      />

      <primitive 
        object={death.scene} 
        visible={isDead} 
        position={adjustPosition}
        scale={isDead ? 1 : 0} 
      />

    </group>
  )
}

useGLTF.preload('/models/labadze-idle.glb')
useGLTF.preload('/models/labadze-run.glb')
useGLTF.preload('/models/labadze-death.glb')