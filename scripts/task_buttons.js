import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://tyujfmvpszsccahmqriv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWpmbXZwc3pzY2NhaG1xcml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Mjc5MTAsImV4cCI6MjA4NTAwMzkxMH0.bU-E-5RkfiQbbdNQkTazLu7rIgs4mUeIEiUmvh11YzI';       // ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey);
const table = supabase.from("images");
const storage = supabase.storage.from("images");


const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeBtn');

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

    const { data: data_img, error: error_img } = await storage.getPublicUrl(filePath);

    const file = data_img.publicUrl;
    modalImg.setAttribute("src", file);

    modal.style.display = "flex";
  });
});
