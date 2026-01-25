const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');
const modalContent = document.getElementById('modalContent');

let currentBtnId = null; // кнопка, для которой открыта модалка

// ===== Модалка: закрытие =====
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  currentBtnId = null; // сбрасываем текущую кнопку
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    currentBtnId = null;
  }
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
    currentBtnId = null;
  }
});

// ===== Кнопки =====
document.querySelectorAll('.task-btn').forEach(button => {
  const imgId = button.getAttribute('data-img');

  // Подгружаем сохранённое изображение для кнопки
  const savedImage = localStorage.getItem(imgId);
  if (savedImage) {
    button.setAttribute('data-img', savedImage);
  }

  // Клик по кнопке открывает модалку
  button.addEventListener('click', () => {
    const imgSrc = button.getAttribute('data-img');
    if (imgSrc) {
      modalImg.src = imgSrc;
      modal.style.display = 'flex';
      currentBtnId = imgId; // запоминаем кнопку для Drag & Drop
    } else {
      // Если нет сохранённого изображения, просто открываем пустую модалку
      modalImg.src = '';
      modal.style.display = 'flex';
      currentBtnId = imgId;
    }
  });
});
