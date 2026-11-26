const more = document.getElementById('moreBtn');
const sheet = document.getElementById('linkSheet');
const mobile = window.matchMedia('(max-width: 900px)');

more.addEventListener('click', () => sheet.showModal());
sheet.addEventListener('click', (event) => {
  if (event.target === sheet) {
    const bounds = sheet.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      sheet.close();
    }
  }
});
mobile.addEventListener('change', () => {
  if (!mobile.matches && sheet.open) sheet.close();
});

const art = document.getElementById('heroArt');
const rotation = document.getElementById('heroRotation');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const slides = [...art.querySelectorAll('img')];
const artwork = [
  { src: slides[0].getAttribute('src'), alt: slides[0].alt },
  { src: './assets/hero-wink.png', alt: '白と金の衣装でウィンクする愛神アプロ' },
  { src: './assets/birthday-dress-smile.png', alt: '青いドレスで微笑む愛神アプロ' },
  { src: './assets/center-part.png', alt: 'センターパートの愛神アプロの立ち絵' },
];

let current = artwork[0];
let active = slides[0];
let remaining = [];
let timer;
let paused = false;
let loading = false;

function canRotate() {
  return !paused && !motion.matches && !document.hidden;
}

async function changeArtwork() {
  if (!canRotate() || loading) return;
  if (remaining.length === 0) remaining = artwork.filter(item => item !== current);
  const index = Math.floor(Math.random() * remaining.length);
  const [next] = remaining.splice(index, 1);
  const incoming = slides.find(slide => slide !== active);
  loading = true;
  try {
    incoming.src = next.src;
    await incoming.decode();
    if (!canRotate()) return;

    incoming.alt = next.alt;
    incoming.removeAttribute('aria-hidden');
    incoming.classList.add('is-visible');
    active.classList.remove('is-visible');
    active.setAttribute('aria-hidden', 'true');
    active = incoming;
    current = next;
  } catch {
    // Keep showing the current image if an asset fails to load.
  } finally {
    loading = false;
  }
}

function updateRotation() {
  clearInterval(timer);
  rotation.hidden = motion.matches;
  rotation.textContent = paused ? '自動切替を再開' : '自動切替を停止';
  if (canRotate()) timer = setInterval(changeArtwork, 6500);
}

rotation.addEventListener('click', () => {
  paused = !paused;
  updateRotation();
});
motion.addEventListener('change', updateRotation);
document.addEventListener('visibilitychange', updateRotation);
updateRotation();

sheet.querySelectorAll('a[href^="#"]').forEach(link => { link.addEventListener('click', () => sheet.close()); });

const gallery = document.getElementById('fanArtTrack');
const galleryControls = document.querySelector('.gallery-controls');
const [previousArt, nextArt] = galleryControls.querySelectorAll('button');

function updateGalleryControls() {
  previousArt.disabled = gallery.scrollLeft <= 1;
  nextArt.disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 1;
}

function scrollGallery(direction) {
  const [first, second] = gallery.children;
  const step = second.offsetLeft - first.offsetLeft;
  const currentIndex = Math.round(gallery.scrollLeft / step);
  gallery.scrollTo({ left: (currentIndex + direction) * step, behavior: motion.matches ? 'auto' : 'smooth' });
}

previousArt.addEventListener('click', () => scrollGallery(-1));
nextArt.addEventListener('click', () => scrollGallery(1));
gallery.addEventListener('scroll', updateGalleryControls, { passive: true });
new ResizeObserver(updateGalleryControls).observe(gallery);
galleryControls.hidden = false;
updateGalleryControls();
