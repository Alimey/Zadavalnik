const sidebar = document.getElementById('sidebar');
let menuOpen = false;

function openNav() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    sidebar.classList.add('open');
    document.querySelector('.open-btn').textContent = '×';
  } else {
    sidebar.classList.remove('open');
    document.querySelector('.open-btn').textContent = '☰';
  }
}

sidebar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    document.querySelector('.open-btn').textContent = '☰';
    menuOpen = false;
  });
});
