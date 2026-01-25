const contextMenu = document.getElementById('contextMenu');
const toggleSolvedBtn = document.getElementById('toggleSolvedBtn');
let targetButton = null;

// Убираем стандартное меню для всех кнопок задач
document.querySelectorAll('.task-btn').forEach(button => {
  button.addEventListener('contextmenu', e => {
    e.preventDefault(); // 🔹 Отключаем стандартное меню
    e.stopPropagation();

    targetButton = button;

    // Меняем текст кнопки в меню
    if (targetButton.classList.contains('solved')) {
      toggleSolvedBtn.textContent = 'Снять отметку';
    } else {
      toggleSolvedBtn.textContent = 'Пометить решённой';
    }

    // Показываем меню рядом с курсором
    contextMenu.style.display = 'block';
    contextMenu.style.top = e.pageY + 'px';
    contextMenu.style.left = e.pageX + 'px';
  });
});

// При клике по кнопке "пометить решённой"
toggleSolvedBtn.addEventListener('click', () => {
  if (targetButton) {
    targetButton.classList.toggle('solved');
    saveSolvedTasks();
  }
  hideMenu();
});

// Скрываем меню при клике вне его
document.addEventListener('click', e => {
  if (!contextMenu.contains(e.target)) hideMenu();
});

// Скрываем при Esc
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') hideMenu();
});

function hideMenu() {
  contextMenu.style.display = 'none';
}

// Сохраняем и загружаем состояние решённых задач
function saveSolvedTasks() {
  const solved = [];
  document.querySelectorAll('.task-btn.solved').forEach(btn => solved.push(btn.dataset.img));
  localStorage.setItem('solvedTasks', JSON.stringify(solved));
}

function loadSolvedTasks() {
  const solved = JSON.parse(localStorage.getItem('solvedTasks') || '[]');
  solved.forEach(img => {
    const btn = document.querySelector(`.task-btn[data-img="${img}"]`);
    if (btn) btn.classList.add('solved');
  });
}

loadSolvedTasks();