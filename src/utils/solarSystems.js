export const SUN_RADIUS = 3

function clusterRadiusOf(planets) {
  return Math.max(...planets.map((planet) => planet.distance + planet.radius))
}

const laboralPlanets = [
  {
    id: 'cimdol',
    name: 'CIMDOL',
    kicker: 'Ingeniero de Sistemas · Desde inicios de 2025',
    tagline: 'Centro Integral para el Manejo del Dolor.',
    description:
      'Ingeniero de Sistemas en CIMDOL SAS: desarrollo de software y de la página web de la organización, además de apoyo en el mantenimiento de hardware de oficina.',
    siteLink: 'https://www.cimdol.co',
    biome: 'oceanic',
    color: '#4fb0a6',
    radius: 1.1,
    distance: 8,
    orbitSpeed: 0.11,
    rotationSpeed: 0.5,
    initialAngle: 1.2,
  },
  {
    id: 'dstei-ticanor',
    name: 'DSTEI Ticanor',
    kicker: 'Ingeniero de Sistemas · Proyecto financiado por IEEE · Desde 2024',
    tagline: 'Sistemas embebidos aplicados a proyectos aeroespaciales.',
    description:
      'Participación como ingeniero de sistemas en el proyecto Ticanor, financiado por la iniciativa DSTEI de IEEE, con trabajo en sistemas embebidos aplicados a iniciativas aeroespaciales.',
    biome: 'rocky',
    color: '#d97fb0',
    radius: 0.95,
    distance: 12.5,
    orbitSpeed: 0.09,
    rotationSpeed: 0.45,
    initialAngle: 3.8,
  },
  {
    id: 'sonido-cardenas',
    name: 'Sonido Cárdenas',
    kicker: 'Desarrollador Web Freelance · Popayán y Cali',
    tagline: 'Amplificación, luces y DJ para eventos.',
    description:
      'Desarrollo de la página web de Sonido Cárdenas como trabajo independiente (freelance): amplificación, luces y DJ para eventos en Popayán y Cali.',
    siteLink: 'https://www.sonidocardenas.com/',
    biome: 'volcanic',
    color: '#c25fd6',
    radius: 1.05,
    distance: 17,
    orbitSpeed: 0.065,
    rotationSpeed: 0.6,
    initialAngle: 5.2,
  },
  {
    id: 'sia-unicauca',
    name: 'SIA Unicauca',
    kicker: 'Desarrollador Web Freelance · Semillero de Ingeniería Aeroespacial',
    tagline: 'Ad Astra — Hacia las Estrellas.',
    description:
      'Desarrollo de la página web del Semillero de Ingeniería Aeroespacial (SIA) de la Universidad del Cauca, como trabajo independiente (freelance).',
    siteLink: 'https://siaunicauca.github.io/',
    repoLink: 'https://github.com/siaunicauca/siaunicauca.github.io',
    stack: ['TypeScript'],
    biome: 'rocky',
    color: '#3f9d5c',
    radius: 1,
    distance: 21.5,
    orbitSpeed: 0.05,
    rotationSpeed: 0.55,
    initialAngle: 0.6,
  },
]

const academicoPlanets = [
  {
    id: 'cansat-unam',
    name: 'CANSAT UNAM',
    kicker: 'Competencia internacional · UNAM · 2024 y 2025',
    tagline: 'Concurso mundial de satélites enlatados.',
    description:
      'Dirigió los equipos de competencia del capítulo estudiantil AESS Unicauca en CANSAT, el concurso mundial de satélites enlatados organizado por la UNAM, en las ediciones 2024 y 2025.',
    biome: 'rocky',
    color: '#e0623f',
    radius: 1,
    distance: 8,
    orbitSpeed: 0.1,
    rotationSpeed: 0.5,
    initialAngle: 2.3,
  },
  {
    id: 'nasa-space-apps',
    name: 'NASA Space Apps Challenge',
    kicker: 'Hackathon internacional · 2024 y 2025',
    tagline: 'El hackathon internacional de la NASA.',
    description:
      'Dirigió la organización del hackathon NASA Space Apps Challenge en las ediciones 2024 y 2025, como parte de su liderazgo en el capítulo estudiantil AESS Unicauca.',
    siteLink: 'https://www.spaceappschallenge.org/',
    biome: 'stormy',
    color: '#4f5fe0',
    radius: 1.05,
    distance: 12,
    orbitSpeed: 0.08,
    rotationSpeed: 0.55,
    initialAngle: 4.4,
  },
  {
    id: 'aess-epics',
    name: 'AESS Unicauca · EPICS in IEEE',
    kicker: 'Vicepresidente, capítulo estudiantil AESS · Desde feb. 2025',
    tagline: 'IEEE Aerospace and Electronic Systems Society.',
    description:
      'Como vicepresidente del capítulo estudiantil AESS Unicauca, lideró la gestión y consecución de financiamiento por 6.200 USD para un proyecto de impacto social bajo la iniciativa EPICS in IEEE.',
    siteLink: 'https://epics.ieee.org/',
    biome: 'oceanic',
    color: '#e0c23f',
    radius: 1.1,
    distance: 16,
    orbitSpeed: 0.065,
    rotationSpeed: 0.5,
    initialAngle: 0.9,
  },
  {
    id: 'bootcamp-isif',
    name: 'Bootcamp FUSION — ISIF',
    kicker: 'Formación especializada · 2025',
    tagline: 'International Society of Information Fusion.',
    description:
      'Bootcamp FUSION organizado por ISIF (International Society of Information Fusion), enfocado en fusión de información aplicada a navegación y estimación de estados.',
    siteLink: 'https://isif.org/',
    biome: 'arid',
    color: '#6f8fe0',
    radius: 0.85,
    distance: 20,
    orbitSpeed: 0.05,
    rotationSpeed: 0.65,
    initialAngle: 3.1,
  },
  {
    id: 'bootcamp-ntnu',
    name: 'Bootcamp FUSION — NTNU',
    kicker: 'Formación especializada · 2026',
    tagline: 'Norwegian University of Science and Technology.',
    description:
      'Bootcamp FUSION organizado por la NTNU (Norwegian University of Science and Technology), con enfoque en fusión de información para navegación y estimación de estados aplicada a drones/UAVs.',
    siteLink: 'https://www.ntnu.edu/',
    biome: 'icy',
    color: '#8fd4ff',
    radius: 0.8,
    distance: 24,
    orbitSpeed: 0.04,
    rotationSpeed: 0.6,
    initialAngle: 5.6,
  },
]

export const SOLAR_SYSTEMS = [
  {
    id: 'academico',
    label: 'Vida Académica',
    center: [-34, 0, 0],
    sun: {
      id: 'sun-academico',
      name: 'Universidad del Cauca',
      kicker: 'Ingeniería de Sistemas · 2021 – 2027 (esperado)',
      tagline: 'Formación, investigación y liderazgo estudiantil.',
      description:
        'Estudiante de Ingeniería de Sistemas en la Universidad del Cauca. Su interés investigativo se centra en information fusion aplicada a navegación, drones/UAVs y estimación de estados.',
      color: '#8fd4ff',
      radius: SUN_RADIUS,
      clusterRadius: clusterRadiusOf(academicoPlanets),
    },
    planets: academicoPlanets,
  },
  {
    id: 'laboral',
    label: 'Vida Laboral',
    center: [34, 0, 0],
    sun: {
      id: 'sun-laboral',
      name: 'Perfil Profesional',
      kicker: 'Ingeniero de Sistemas en formación',
      tagline: 'Desarrollo de software y liderazgo de proyectos técnicos.',
      description:
        'Estudiante de Ingeniería de Sistemas de la Universidad del Cauca con experiencia profesional activa en desarrollo de software y liderazgo de proyectos técnicos financiados por IEEE. Combina trabajo de ingeniería en industria con participación en iniciativas de investigación aplicada en sistemas embebidos y aeroespaciales.',
      color: '#ffcf7a',
      radius: SUN_RADIUS,
      clusterRadius: clusterRadiusOf(laboralPlanets),
    },
    planets: laboralPlanets,
  },
]
