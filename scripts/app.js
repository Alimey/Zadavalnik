import { addImgBtn, contextMenu, imgInputFile } from "./constants.js"
import { table, bucket } from "./constants.js"
import { targetBtn } from "./context_menu.js"

// При клике открыть меню загрузки изображения
addImgBtn.addEventListener('click', () => {
  contextMenu.style.display = 'none';
  imgInputFile.click();
});

// Если были выбраны изображения, берем первое и загружаем в БД
imgInputFile.addEventListener('change', async () => {
  const file = imgInputFile.files[0];
  if (!file) return;

  // Достаем из таблицы БД images старый URL картинки задачи 
  // и удаляем картинку из bucket по этому URL
  const { data: data_old_img, error: error_old_url } = await table
    .select("image_url")
    .eq('task_code', targetBtn.textContent)

  if (error_old_url) {
    console.warn('Не удалось получить старый URL из bucket images:', error_old_url.message, "\n");
  } else if (data_old_img.length > 0) {
    let filePathToDelete = []

    for (const old_img_url of data_old_img) {
      let fileToDelete = old_img_url.image_url.split('/images/')[1];
      filePathToDelete.push(fileToDelete);
    }

    const { delete_bucket_data, delete_bucket_error } = await bucket.remove(filePathToDelete);

    if (delete_bucket_error) {
      console.error('Не удалось удалить картинку по старому URL из bucket images:', delete_bucket_error.message);
      return;
    }
  }

  // Загружаем новую картинку в bucket, предварительно сформировав имя с помощью Date.now()
  // а потом меняем URL в таблице images
  const filePath = `task_button-${targetBtn.textContent}-${Date.now()}`;

  const { upload_bucket_data, upload_bucket_error } = await bucket.upload(filePath, file);

  if (upload_bucket_error) {
    console.error('Не удалось загрузить новую картинку в bucket images:', upload_bucket_error.message);
    return;
  }

  const { data: get_public_url_data } = bucket.getPublicUrl(filePath);

  const publicUrl = get_public_url_data.publicUrl;

  if (data_old_img.length > 0) {
    const { data: update_table_data, error: update_table_error } = await table
      .update({image_url: publicUrl})
      .eq('task_code', targetBtn.textContent)

    if (update_table_error) {
      console.error('Не удалось обновить URL в таблице images:', update_table_error.message);
      return;
    }
  } else {
    const { data: upload_table_data, error: upload_table_error } = await table
      .insert([
        {
          image_url: publicUrl,
          task_code: targetBtn.textContent
        }
      ]);

    if (upload_table_error) {
      console.error('Не удалось загрузить новую строку в таблице images:', upload_table_error.message);
      return;
    }
  }
});
