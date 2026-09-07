const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => navMobile.classList.remove('open'))
  );
}

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }
}

/* ---------- stat counters ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  if (prefersReducedMotion) { el.textContent = prefix + target + suffix; return; }

  const duration = 1000;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
if (countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => countObserver.observe(el));
}

/* ---------- 3D tilt on case cards ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- three.js: shared loader for hero + banner effects ---------- */
/* Loaded dynamically and wrapped in try/catch on purpose: if the CDN is
   blocked or slow, the rest of the page (nav, content, reveals, counters)
   must keep working. This is the only part allowed to fail silently. */
let threePromise;
function loadThree() {
  if (!threePromise) {
    threePromise = import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  }
  return threePromise;
}

async function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || prefersReducedMotion) return;

  let THREE;
  try {
    THREE = await loadThree();
  } catch (err) {
    canvas.style.display = 'none';
    return;
  }

  const heroSection = canvas.closest('.hero');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 9;

  const POINT_COUNT = 90;
  const positions = new Float32Array(POINT_COUNT * 3);
  for (let i = 0; i < POINT_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({ color: 0x46e0c4, size: 0.06, transparent: true, opacity: 0.85 });
  const points = new THREE.Points(pointsGeo, pointsMat);

  const linePositions = [];
  const threshold = 3.1;
  for (let i = 0; i < POINT_COUNT; i++) {
    for (let j = i + 1; j < POINT_COUNT; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < threshold) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0xff7a33, transparent: true, opacity: 0.12 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  const group = new THREE.Group();
  group.add(points, lines);
  scene.add(group);

  let mouseX = 0, mouseY = 0;
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function resize() {
    const w = heroSection.clientWidth;
    const h = heroSection.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let raf;
  function animate() {
    raf = requestAnimationFrame(animate);
    group.rotation.y += 0.0009;
    group.rotation.x += (mouseY * 0.18 - group.rotation.x) * 0.03;
    group.rotation.y += (mouseX * 0.1) * 0.001;
    renderer.render(scene, camera);
  }
  animate();

  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { if (!raf) animate(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0 });
  visObserver.observe(heroSection);
}

initHero3D().catch(() => {
  const canvas = document.getElementById('heroCanvas');
  if (canvas) canvas.style.display = 'none';
});

/* ---------- three.js banner drifting orbs ---------- */
/* Same fail-quiet pattern as the hero: a subtle floating point cloud
   behind the CTA banner. Lighter than the hero (fewer points, no lines,
   slow drift, no mouse interaction) since it just needs to add texture,
   not compete with the headline. */
async function initBanner3D() {
  const canvas = document.getElementById('bannerCanvas');
  if (!canvas || prefersReducedMotion) return;

  let THREE;
  try {
    THREE = await loadThree();
  } catch (err) {
    canvas.style.display = 'none';
    return;
  }

  const section = canvas.closest('.banner');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 7;

  const POINT_COUNT = 46;
  const positions = new Float32Array(POINT_COUNT * 3);
  const speeds = new Float32Array(POINT_COUNT);
  for (let i = 0; i < POINT_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    speeds[i] = 0.04 + Math.random() * 0.08;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xff7a33, size: 0.09, transparent: true, opacity: 0.6 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function resize() {
    const w = section.clientWidth;
    const h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let raf, t = 0;
  function animate() {
    raf = requestAnimationFrame(animate);
    t += 0.01;
    const pos = geo.attributes.position;
    for (let i = 0; i < POINT_COUNT; i++) {
      pos.array[i * 3 + 1] += Math.sin(t + i) * 0.0015;
      pos.array[i * 3] += Math.cos(t * 0.6 + i) * 0.0012;
    }
    pos.needsUpdate = true;
    points.rotation.y += 0.0006;
    renderer.render(scene, camera);
  }
  animate();

  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { if (!raf) animate(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0 });
  visObserver.observe(section);
}

initBanner3D().catch(() => {
  const canvas = document.getElementById('bannerCanvas');
  if (canvas) canvas.style.display = 'none';
});
