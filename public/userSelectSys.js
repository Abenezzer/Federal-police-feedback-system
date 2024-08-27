const select = document.querySelector("#user-select-system");
const display = document.querySelector("#display-on-select");

select.addEventListener("change", (e) => {
  console.log("user select system");
  display.classList.remove("d-none");
});
