import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { targetButton } from "./context_menu.js"

const supabaseUrl = 'https://tyujfmvpszsccahmqriv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWpmbXZwc3pzY2NhaG1xcml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Mjc5MTAsImV4cCI6MjA4NTAwMzkxMH0.bU-E-5RkfiQbbdNQkTazLu7rIgs4mUeIEiUmvh11YzI';       // ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const addImgBtn = document.getElementById('addImgBtn');
const imgFile = document.getElementById('imgFile');

const tableName = "images";
const bucket = supabase.storage.from("images")

console.log(addImgBtn);
console.log(imgFile);


// При клике открыть меню загрузки изображения
addImgBtn.addEventListener('click', () => {
  document.getElementById('contextMenu').style.display = 'none';
  imgFile.click();
});

imgFile.addEventListener('change', async () => {
  const file = imgFile.files[0];
  if (!file) return;

  // Достаем из таблицы БД images старый URL картинки задачи 
  // и удаляем картинку из storage по этому URL
  const { data: data_old_img, error: error_old_url } = await supabase
    .from(tableName)
    .select("image_url")
    .eq('task_code', targetButton.textContent)

  console.log(data_old_img,  "\n");

  if (error_old_url) {
    console.warn('Не удалось получить старый URL из bucket images:', error_old_url.message, "\n");
    // return;
  } else {
    let filePathToDelete = []

    for (const old_img_url of data_old_img) {
      let fileToDelete = old_img_url.image_url.split('/images/')[1];
      filePathToDelete.push(fileToDelete);
    }

    console.log(filePathToDelete);

    const { delete_storage_data, delete_storage_error } = await bucket.remove(filePathToDelete);

    if (delete_storage_error) {
      console.error('Не удалось удалить картинку по старому URL из storage images:', delete_storage_error.message);
      return;
    }
  }

  console.warn('Продолжаем.\n')

  // Загружаем новую картинку в storage, предварительно сформировав имя с помощью Date.now()
  // а потом меняем URL в таблице images
  const filePath = `task_button-${targetButton.textContent}-${Date.now()}`;

  const { upload_storage_data, upload_storage_error } = await bucket.upload(filePath, file);

  if (upload_storage_error) {
    console.error('Не удалось загрузить новую картинку в storage images:', upload_storage_error.message);
    return;
  }

  const { data: get_public_url_data } = bucket.getPublicUrl(filePath);

  const publicUrl = get_public_url_data.publicUrl;

  if (data_old_img.length > 0) {
    const { data: update_table_data, error: update_table_error } = await supabase
      .from(tableName)
      .update({image_url: publicUrl})
      .eq('task_code', targetButton.textContent)

    if (update_table_error) {
      console.error('Не удалось обновить URL в таблице images:', update_table_error.message);
      return;
    }
  } else {
    const { data: upload_table_data, error: upload_table_error } = await supabase
      .from(tableName)
      .insert([
        {
          image_url: publicUrl,
          task_code: targetButton.textContent
        }
      ]);

    if (upload_table_error) {
      console.error('Не удалось загрузить новую строку в таблице images:', upload_table_error.message);
      return;
    }
  }
});
