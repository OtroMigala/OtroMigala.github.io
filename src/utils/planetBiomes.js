export const BIOMES = {
  rocky: {
    cloudDensity: 0,
    oceanMode: false,
    roughnessBase: 0.95,
    blotchContrast: 1.3,
    saturation: 0,
    emissiveCracks: false,
  },
  arid: {
    cloudDensity: 0.15,
    oceanMode: false,
    roughnessBase: 0.85,
    blotchContrast: 1.1,
    saturation: -0.1,
    emissiveCracks: false,
  },
  oceanic: {
    cloudDensity: 0.5,
    oceanMode: true,
    roughnessBase: 0.7,
    blotchContrast: 1,
    saturation: 0,
    emissiveCracks: false,
  },
  volcanic: {
    cloudDensity: 0.2,
    oceanMode: false,
    roughnessBase: 0.9,
    blotchContrast: 1.4,
    saturation: 0.1,
    emissiveCracks: true,
  },
  stormy: {
    cloudDensity: 0.85,
    oceanMode: false,
    roughnessBase: 0.6,
    blotchContrast: 0.8,
    saturation: 0,
    emissiveCracks: false,
    bandedClouds: true,
  },
  icy: {
    cloudDensity: 0.35,
    oceanMode: false,
    roughnessBase: 0.45,
    blotchContrast: 0.6,
    saturation: -0.3,
    emissiveCracks: false,
  },
}

export function getBiome(key) {
  return BIOMES[key] ?? BIOMES.rocky
}
