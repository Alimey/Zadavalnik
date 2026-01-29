import { sidebar } from "./constants.js"


let menuOpen = false;

function openNav() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    sidebar.classList.add('opened_sidebar');
    document.querySelector('.opened_nav_btn').textContent = '×';
  } else {
    sidebar.classList.remove('opened_sidebar');
    document.querySelector('.opened_nav_btn').textContent = '☰';
  }
}

sidebar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('opened_sidebar');
    document.querySelector('.opened_nav_btn').textContent = '☰';
    menuOpen = false;
  });
});
