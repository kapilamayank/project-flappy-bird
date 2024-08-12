document.querySelector(".easy-button").addEventListener("click", () => {
  window.location.href = "/gamePage.html?userChoice=easy";
});

document.querySelector(".hard-button").addEventListener("click", () => {
  window.location.href = "/gamePage.html?userChoice=hard";
});
