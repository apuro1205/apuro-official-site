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
