
import { renderUploadImageComponent } from "./upload-image-component.js"; 
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    let imageUrl = ""; 

    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            
            <!-- Сюда вставится кнопка "Выберите фото" -->
            <div class="upload-image-container"></div>
            
            <input type="text" id="description-input" class="input" placeholder="Введите описание" />
            
            <button class="button" id="add-button">Опубликовать</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl; 
      },
    });

    document.getElementById("add-button").addEventListener("click", (event) => {
      const description = document.getElementById("description-input").value;
      const button = event.target;

      if (!description) {
        alert("Введите описание поста");
        return;
      }
      if (!imageUrl) {
        alert("Загрузите фотографию");
        return;
      }

      button.disabled = true; 
      button.textContent = "Загружаю...";

      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}