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
