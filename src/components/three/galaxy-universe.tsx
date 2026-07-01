'use client'

import { useTexture, Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Galaxy data — real astrophotography placed in the deep distance     */
/* ------------------------------------------------------------------ */

interface GalaxySpec {
  name: string
  texture: string
  position: [number, number, number]
  scale: number
  spin: number // self-rotation speed
  tint: string
}

// Distant galaxies placed far beyond the solar system (radius ~160-180).
// Each is a billboarded sprite so it always faces the camera.
const GALAXIES: GalaxySpec[] = [
  {
    name: 'Andromeda',
    texture: '/galaxies/andromeda.jpg',
    position: [120, 70, -130],
    scale: 34,
    spin: 0.015,
    tint: '#cfd8ff',
  },
  {
    name: 'Whirlpool',
    texture: '/galaxies/whirlpool.webp',
    position: [-150, 45, -90],
    scale: 30,
    spin: -0.012,
    tint: '#ffe6c0',
  },
  {
    name: 'Sombrero',
    texture: '/galaxies/sombrero.jpg',
    position: [-90, -60, 140],
    scale: 24,
    spin: 0.008,
    tint: '#ffd9a8',
  },
  {
    name: 'Triangulum',
    texture: '/galaxies/triangulum.jpeg',
    position: [140, -40, 100],
    scale: 32,
    spin: -0.018,
    tint: '#d4f0ff',
  },
  {
    name: 'Nebula',
    texture: '/galaxies/nebula.jpg',
    position: [40, 110, 150],
    scale: 40,
    spin: 0.006,
    tint: '#ff9ec7',
  },
]

/* ------------------------------------------------------------------ */
/* Milky Way sky — giant inverted sphere textured with the panorama    */
/* ------------------------------------------------------------------ */

function MilkyWaySky() {
  const texture = useTexture('/galaxies/milkyway.jpg')
  // Configure for a soft, atmospheric background.
  // Mutating a loaded texture is the canonical R3F pattern for texture setup.
  useMemo(() => {
    /* eslint-disable react-hooks/immutability */
    texture.colorSpace = THREE.SRGBColorSpace
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.repeat.set(2, 1)
    texture.anisotropy = 8
    /* eslint-enable react-hooks/immutability */
  }, [texture])

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Inverted sphere so we see the texture from inside */}
      <sphereGeometry args={[300, 64, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        fog={false}
        toneMapped={false}
        opacity={0.55}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* A single distant galaxy — billboarded sprite with additive glow     */
/* ------------------------------------------------------------------ */

function DistantGalaxy({ spec }: { spec: GalaxySpec }) {
  const texture = useTexture(spec.texture)
  const ref = useRef<THREE.Group>(null!)
  const matRef = useRef<THREE.SpriteMaterial>(null!)

  useMemo(() => {
    /* eslint-disable react-hooks/immutability */
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    /* eslint-enable react-hooks/immutability */
  }, [texture])

  // Gentle twinkle + slow drift so the deep field feels alive
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (matRef.current) {
      const tw = 0.65 + Math.sin(t * 0.4 + spec.position[0]) * 0.15
      matRef.current.opacity = tw
    }
    if (ref.current) {
      ref.current.rotation.y = t * spec.spin * 0.15
      // subtle bob
      ref.current.position.y =
        spec.position[1] + Math.sin(t * 0.15 + spec.position[2]) * 2
    }
  })

  return (
    <group ref={ref} position={spec.position}>
      <Billboard>
        <sprite scale={[spec.scale, spec.scale, 1]}>
          <spriteMaterial
            ref={matRef}
            map={texture}
            color={spec.tint}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            opacity={0.7}
            fog={false}
            toneMapped={false}
          />
        </sprite>

        {/* Soft halo glow behind the galaxy for extra realism */}
        <sprite scale={[spec.scale * 1.8, spec.scale * 1.8, 1]} position={[0, 0, -0.5]}>
          <spriteMaterial
            map={texture}
            color={spec.tint}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            transparent
            opacity={0.12}
            fog={false}
            toneMapped={false}
          />
        </sprite>
      </Billboard>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* The full universe backdrop — sky + galaxies + far star dust         */
/* ------------------------------------------------------------------ */

export function GalaxyUniverse() {
  return (
    <group>
      <MilkyWaySky />
      {GALAXIES.map((g) => (
        <DistantGalaxy key={g.name} spec={g} />
      ))}
    </group>
  )
}
