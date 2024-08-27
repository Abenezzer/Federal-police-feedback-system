const select = document.querySelector("#user-select-system");
const display = document.querySelector("#display-on-select");
const formPlace = document.querySelector("#form-place");

select.addEventListener("change", (e) => {
  console.log("cool - cool");
  const selectedValue = e.target.value;
  console.log(e.target.value);
  if (selectedValue !== "placeHolder") {
    fetch(`/get-question/${selectedValue}`)
      .then((response) => response.text()) // Get the response as text (HTML)
      .then((html) => {
        console.log(html);
        formPlace.innerHTML = html;
        return;
        formPlace.innerHTML = html;
        console.log(html);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
