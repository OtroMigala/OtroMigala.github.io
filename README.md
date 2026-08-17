# Juan Alejandro Cárdenas — Portafolio

Portafolio interactivo construido como un sistema solar navegable: dos sistemas
(Vida Académica y Vida Laboral), cada uno con su propio sol y planetas, uno por
proyecto real. Todo el arte —texturas, atmósferas, nubes, estrellas— es
procedural, generado por código en tiempo real, sin imágenes ni modelos 3D
externos.

**Sitio en vivo:** https://otromigala.github.io/

## Stack

- React + Vite
- Three.js / React Three Fiber / drei
- `@react-three/postprocessing` (bloom, viñeta, antialiasing)
- GSAP para las animaciones de cámara y UI
- CSS puro (sin frameworks de estilos)

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Despliegue

Cada push a `main` dispara un workflow de GitHub Actions
(`.github/workflows/deploy.yml`) que compila el proyecto y lo publica en
GitHub Pages automáticamente.
