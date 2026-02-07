// База данных supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = 'https://tyujfmvpszsccahmqriv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWpmbXZwc3pzY2NhaG1xcml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Mjc5MTAsImV4cCI6MjA4NTAwMzkxMH0.bU-E-5RkfiQbbdNQkTazLu7rIgs4mUeIEiUmvh11YzI';

const supabase = createClient(supabaseUrl, supabaseKey);
const table = supabase.from("images");
const bucket = supabase.storage.from("images");

// Контекстное меню
const contextMenu = document.getElementById('contextMenu');
const solvedBtn = document.getElementById('solvedBtn');
const addImgBtn = document.getElementById('addImgBtn');
const imgInputFile = document.getElementById('imgInputFile');

// Модальное окно (окно со всплывающей картинкой)
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCloseBtn = document.getElementById("modalCloseBtn");

// Боковое меню
const sidebar = document.getElementById('sidebar');
const openNavBtn = document.getElementById('opened_nav_btn');


export { 
  table, bucket, contextMenu, 
  solvedBtn, addImgBtn, imgInputFile, 
  modal, modalImg, modalCloseBtn, 
  sidebar, openNavBtn
};
