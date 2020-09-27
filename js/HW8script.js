import images from "./gallery-items.js";

//Заметки * /
//1. Нужно поработать над именами, пока оставил так, что бы не тратить время. Буду набивать руку * /
//2. Как по мне, многовато классов, но зато хорошо читается * /

// Здесь вынесены все нужные переменные
const galleryContainer = document.querySelector(".js-gallery");
const backdropOverlayContainer = document.querySelector(".js-lightbox");
const backdropOverlay = document.querySelector(".lightbox__overlay");
const backdropEl = document.querySelector("div.lightbox");
const modalImgEl = document.querySelector(".lightbox__image");
const modalCloseBtnEl = document.querySelector(
  'button[data-action="close-lightbox"]'
);
const imageCard = createImageCardMockup(images);

//Собираем и вставляем контент
galleryContainer.insertAdjacentHTML("beforeend", imageCard);

//ставим прослушку закрытия по кнопке, закрытия по бекдропу, и открытия модального окна
modalCloseBtnEl.addEventListener("click", onModalBtnClosePress);
galleryContainer.addEventListener("click", onOpenGalleryContainerClick);
backdropOverlay.addEventListener("click", onBackdropClickClose);

//функция создает разметку
function createImageCardMockup(images) {
  return images
    .map(({ original, preview, description }, index) => {
      return `
        <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      data-index="${index}"
      alt="${description}"
    />
  </a>
</li>
    `;
    })
    .join("");
}

//функция открывает модалку, вешает слушателя клавиатуры. Создает класс для управления стрелками.
function onOpenGalleryContainerClick(evt) {
  evt.preventDefault();
  window.addEventListener("keydown", onEscapeKeyPress);
  window.addEventListener("keydown", onRightArrowPress);
  window.addEventListener("keydown", onLeftArrowPress);

  const targetItem = evt.target.closest(".gallery__item");
  targetItem.classList.add("lightbox-image");

  const isGalleryLinkEl = evt.target.classList.contains("gallery__image");
  if (!isGalleryLinkEl) return;

  backdropEl.classList.add("is-open");

  const originImgSrc = evt.target.dataset.source;
  modalImgEl.setAttribute("src", originImgSrc);

  const originImgAlt = evt.target.alt;
  modalImgEl.setAttribute("alt", originImgAlt);
}

// закрытие по Эск.
function onEscapeKeyPress(evt) {
  if (evt.code === "Escape") {
    onCloseModal();
  }
}

//закрытие по кнопке
function onModalBtnClosePress() {
  if (modalCloseBtnEl.nodeName === "BUTTON") {
    onCloseModal();
  }
}

//закрытие по клику на бэкдроп
function onBackdropClickClose(evt) {
  if (evt.currentTarget === evt.target) {
    onCloseModal();
  }
}

//само закрытие и снятие слушателей клавиатуры. Удаляет src
function onCloseModal() {
  backdropOverlayContainer.classList.remove("is-open");

  window.removeEventListener("keydown", onEscapeKeyPress);
  window.removeEventListener("keydown", onRightArrowPress);
  window.removeEventListener("keydown", onLeftArrowPress);
  deleteImgSrc();
}

//само удаление src
function deleteImgSrc() {
  modalImgEl.src = "";
}

// смена картинки вправо. При нажатии выбирает картинку по классу и меняет его на соседа
function onRightArrowPress(event) {
  if (event.code === "ArrowRight") {
    const currentItem = document.querySelector(".lightbox-image");
    if (currentItem === galleryContainer.lastElementChild) {
      return;
    }
    const nextItem = currentItem.nextElementSibling;
    changeImage(currentItem, nextItem);
  }
}
//такой же подход как и выше
function onLeftArrowPress(event) {
  if (event.code === "ArrowLeft") {
    const currentItem = document.querySelector(".lightbox-image");
    if (currentItem === galleryContainer.firstElementChild) {
      return;
    }
    const nextItem = currentItem.previousElementSibling;
    changeImage(currentItem, nextItem);
  }
}

//функция для замены картинки, а имено замена классов.
function changeImage(currActiveItem, nextActiveItem) {
  const nextImage = nextActiveItem.querySelector(".gallery__image");
  setImageSrcAlt(nextImage);
  currActiveItem.classList.remove("lightbox-image");
  nextActiveItem.classList.add("lightbox-image");
}

//замена адреса картинки в html
function setImageSrcAlt(evt) {
  modalImgEl.src = evt.dataset.source;
  modalImgEl.alt = evt.alt;
}
