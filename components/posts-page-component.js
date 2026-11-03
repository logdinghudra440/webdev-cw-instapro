import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, getToken, page } from "../index.js";
import { addLike, removeLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
    const postsHTML = (posts || []).map((post) => {
    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
          <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            ${(() => {
              if (user && post.likes && post.likes.some((like) => like.id === user.id)) {
                return `<img src="./assets/images/like-active.svg">`;
              } else {
                return `<img src="./assets/images/like-not-active.svg">`; 
              }
            })()}
          </button>
          <p class="post-likes-text">
          Нравится: <strong>${post.likes ? post.likes.length : 0}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${new Date(post.createdAt).toLocaleString("ru-RU")}
        </p>
      </li>
    `;
  }).join('');

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHTML}
      </ul>
    </div>
  `;
 
  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.stopPropagation(); 
      
      const postId = btn.dataset.postId;
      const post = posts.find((p) => p.id === postId);

      if (!user) {
        alert("Нужно авторизоваться");
        return;
      }

      const isLiked = post.likes && post.likes.some((like) => like.id === user.id);
      
      try {

        if (isLiked) {
          await removeLike({ token: getToken(), postId });
        } else {
          await addLike({ token: getToken(), postId });
        }

        if (page === POSTS_PAGE) {
          goToPage(POSTS_PAGE);
        } else {
          goToPage(USER_POSTS_PAGE, { userId: post.user.id });
        }
      } catch (error) {
        alert("Ошибка: " + error.message);
      }
    });
  });
  }
}
