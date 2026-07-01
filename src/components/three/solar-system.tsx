'use client'

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars, Html, Line } from '@react-three/drei'
import { useMemo, useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import { useApp } from '@/lib/store'
import type { Planet } from '@/lib/types'
import { GalaxyUniverse } from '@/components/three/galaxy-universe'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function planetWorldPosition(p: Planet, t: number, speed: number): THREE.Vector3 {
  if (p.orbitRadius === 0) return new THREE.Vector3(0, 0, 0)
  const angle = t * p.orbitSpeed * speed
  return new THREE.Vector3(
    Math.cos(angle) * p.orbitRadius,
    0,
    Math.sin(angle) * p.orbitRadius,
  )
}

/* ------------------------------------------------------------------ */
/* Sun — emissive sphere + point light + glow halo                     */
/* ------------------------------------------------------------------ */

function Sun({ planet, onClick, hovered }: {
  planet: Planet
  onClick: () => void
  hovered: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const haloRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * planet.rotationSpeed * 0.3
    if (haloRef.current) {
      const s = 1 + Math.sin(performance.now() * 0.0015) * 0.04
      haloRef.current.scale.setScalar(s)
    }
  })

  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Bright core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.visualRadius, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Soft glow halo */}
      <mesh ref={haloRef} scale={hovered ? 1.15 : 1}>
        <sphereGeometry args={[planet.visualRadius * 1.35, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* The light source */}
      <pointLight
        intensity={3.5}
        distance={120}
        decay={1.4}
        color={planet.color}
      />
      <ambientLight intensity={0.12} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Planet mesh — orbits the sun, self-rotates, optional rings + moon   */
/* ------------------------------------------------------------------ */

function PlanetMesh({
  planet,
  speed,
  paused,
  selected,
  onSelect,
}: {
  planet: Planet
  speed: number
  paused: boolean
  selected: boolean
  onSelect: () => void
}) {
  const orbitRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  // Earth gets a little moon for extra charm
  const isEarth = planet.slug === 'earth'

  useFrame((_, delta) => {
    if (paused) return
    if (orbitRef.current) {
      angleRef.current += delta * planet.orbitSpeed * speed * 0.6
      const a = angleRef.current
      orbitRef.current.position.set(
        Math.cos(a) * planet.orbitRadius,
        0,
        Math.sin(a) * planet.orbitRadius,
      )
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * planet.rotationSpeed * speed
    }
  })

  const ringGeo = useMemo(() => {
    if (planet.ringInner == null || planet.ringOuter == null) return null
    return new THREE.RingGeometry(planet.ringInner, planet.ringOuter, 96)
  }, [planet.ringInner, planet.ringOuter])

  return (
    <group ref={orbitRef}>
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        {/* Selection / hover highlight ring on the floor of the orbit plane */}
        {(hovered || selected) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -planet.visualRadius * 1.1, 0]}>
            <ringGeometry args={[planet.visualRadius * 1.4, planet.visualRadius * 1.7, 48]} />
            <meshBasicMaterial
              color={selected ? '#7dd3fc' : planet.color}
              transparent
              opacity={selected ? 0.7 : 0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        <mesh ref={meshRef} scale={hovered ? 1.12 : 1}>
          <sphereGeometry args={[planet.visualRadius, 48, 48]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.emissive}
            emissiveIntensity={planet.emissive !== '#000000' ? 0.35 : 0.05}
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>

        {/* Rings (Saturn / Uranus) */}
        {ringGeo && (
          <mesh
            rotation={[
              -Math.PI / 2 + (planet.slug === 'uranus' ? Math.PI / 2.2 : 0.35),
              0,
              0,
            ]}
            geometry={ringGeo}
          >
            <meshBasicMaterial
              color={planet.ringColor ?? planet.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {/* Earth's moon */}
        {isEarth && <Moon planetRadius={planet.visualRadius} speed={speed} paused={paused} />}

        {/* Floating label on hover */}
        {hovered && (
          <Html center distanceFactor={14} position={[0, planet.visualRadius + 0.8, 0]} zIndexRange={[20, 0]}>
            <div className="pointer-events-none whitespace-nowrap rounded-full glass-strong px-3 py-1 text-xs font-medium text-foreground shadow-xl">
              {planet.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

function Moon({ planetRadius, speed, paused }: { planetRadius: number; speed: number; paused: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  const a = useRef(0)
  useFrame((_, delta) => {
    if (paused) return
    a.current += delta * 1.5 * speed
    if (ref.current) {
      const r = planetRadius * 2.2
      ref.current.position.set(
        Math.cos(a.current) * r,
        Math.sin(a.current * 0.6) * 0.3,
        Math.sin(a.current) * r,
      )
    }
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[planetRadius * 0.27, 16, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={1} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Orbit ring — thin circle on the orbital plane                       */
/* ------------------------------------------------------------------ */

function OrbitRing({ radius, color, highlighted }: { radius: number; color: string; highlighted: boolean }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const seg = 128
    for (let i = 0; i <= seg; i++) {
      const ang = (i / seg) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(ang) * radius, 0, Math.sin(ang) * radius))
    }
    return pts
  }, [radius])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={highlighted ? 1.6 : 0.6}
      transparent
      opacity={highlighted ? 0.6 : 0.22}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Camera rig — flies to the focused planet                            */
/* ------------------------------------------------------------------ */

function CameraRig({ planets, speed, paused }: { planets: Planet[]; speed: number; paused: boolean }) {
  const focusSlug = useApp((s) => s.focusSlug)
  const { camera, controls } = useThree()
  const target = useRef(new THREE.Vector3(0, 6, 26))
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += paused ? 0 : delta * speed
    const focus = focusSlug ? planets.find((p) => p.slug === focusSlug) : null
    if (focus) {
      const pos = planetWorldPosition(focus, t.current, 1)
      const dist = Math.max(focus.visualRadius * 6, 4)
      const desired = pos.clone().add(new THREE.Vector3(dist, dist * 0.5, dist))
      target.current.lerp(desired, Math.min(1, delta * 2))
      lookAt.current.lerp(pos, Math.min(1, delta * 3))
      camera.position.lerp(target.current, Math.min(1, delta * 2))
      if (controls && 'target' in controls) {
        const c = controls as { target: THREE.Vector3; update?: () => void }
        c.target.lerp(lookAt.current, Math.min(1, delta * 3))
        c.update?.()
      }
    }
  })

  return null
}

/* ------------------------------------------------------------------ */
/* Click-away handler — clicking empty space deselects                  */
/* ------------------------------------------------------------------ */

function BackgroundClickCatcher() {
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)
  return (
    <mesh
      position={[0, 0, 0]}
      onClick={() => {
        selectPlanet(null)
        setFocusSlug(null)
      }}
      visible={false}
    >
      <sphereGeometry args={[200, 8, 8]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Main scene                                                          */
/* ------------------------------------------------------------------ */

function Scene() {
  const planets = useApp((s) => s.planets)
  const selectedSlug = useApp((s) => s.selectedSlug)
  const focusSlug = useApp((s) => s.focusSlug)
  const selectPlanet = useApp((s) => s.selectPlanet)
  const setFocusSlug = useApp((s) => s.setFocusSlug)
  const paused = useApp((s) => s.paused)
  const speed = useApp((s) => s.speed)
  const [sunHovered, setSunHovered] = useState(false)

  const onSelect = (slug: string) => {
    selectPlanet(slug)
    setFocusSlug(slug)
  }

  return (
    <>
      <color attach="background" args={['#05060f']} />
      <fog attach="fog" args={['#05060f', 60, 130]} />

      {/* Deep-space universe: Milky Way sky + distant real galaxies.
          Wrapped in its own Suspense so the solar system renders
          immediately while the galaxy textures stream in. */}
      <Suspense fallback={null}>
        <GalaxyUniverse />
      </Suspense>

      <Stars radius={200} depth={100} count={9000} factor={5} saturation={0} fade speed={0.6} />

      {planets
        .filter((p) => p.orbitRadius > 0)
        .map((p) => (
          <OrbitRing
            key={`orbit-${p.slug}`}
            radius={p.orbitRadius}
            color={p.color}
            highlighted={selectedSlug === p.slug || focusSlug === p.slug}
          />
        ))}

      {planets
        .filter((p) => p.type === 'star')
        .map((p) => (
          <Sun
            key={p.slug}
            planet={p}
            hovered={sunHovered}
            onClick={() => onSelect(p.slug)}
          />
        ))}

      {planets
        .filter((p) => p.type !== 'star')
        .map((p) => (
          <PlanetMesh
            key={p.slug}
            planet={p}
            speed={speed}
            paused={paused}
            selected={selectedSlug === p.slug}
            onSelect={() => onSelect(p.slug)}
          />
        ))}

      <BackgroundClickCatcher />
      <CameraRig planets={planets} speed={speed} paused={paused} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={6}
        maxDistance={120}
        autoRotate
        autoRotateSpeed={0.18}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Exported canvas wrapper                                             */
/* ------------------------------------------------------------------ */

export default function SolarSystem() {
  return (
    <Canvas
      camera={{ position: [0, 10, 30], fov: 55, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
