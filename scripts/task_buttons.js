import { modal, modalCloseBtn, modalImg, table, bucket } from "./constants.js"


let currentBtnId = null; // кнопка, для которой открыта модалка

// ===== Модалка: закрытие =====
modalCloseBtn.addEventListener('click', () => {
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
  // Клик по кнопке открывает модалку
  button.addEventListener('click', async () => {
    let taskCode = button.textContent;

    const { data: data_img_url, error: error_img_url } = await table
      .select("image_url")
      .eq("task_code", taskCode)

    if (error_img_url) {
      console.error("Не удалось загрузить url картинки из table images:", error_img_url.message);
      return;
    }

    if (data_img_url.length == 0) {
      modalImg.setAttribute("src", "");
      modal.style.display = "flex";
      return;
    }

    const imgUrl = data_img_url[0].image_url;
    const filePath = imgUrl.split("/images/")[1];

    const { data: data_img, error: error_img } = await bucket.getPublicUrl(filePath);

    const file = data_img.publicUrl;
    modalImg.setAttribute("src", file);

    modal.style.display = "flex";
  });
});
