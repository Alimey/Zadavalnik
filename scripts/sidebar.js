import { sidebar, openNavBtn } from "./constants.js"


let menuOpen = false;

openNavBtn.addEventListener( 'click', () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    sidebar.classList.add('opened_sidebar');
    openNavBtn.textContent = '×';
  } else {
    sidebar.classList.remove('opened_sidebar');
    openNavBtn.textContent = '☰';
  }
});

sidebar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('opened_sidebar');
    openNavBtn.textContent = '☰';
    menuOpen = false;
  });
});
