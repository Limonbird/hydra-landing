document.addEventListener("DOMContentLoaded", () => {
  const joinForm = document.querySelector(".join__form");
  const joinFormSubmitButton = joinForm.querySelector(".join__submit");

  const isFormValid = (form) => {
    return form.checkValidity();
  };

  const addLoader = async () => {
    const response = await fetch("html/loader.html");
    const html = await response.text();
    document.body.insertAdjacentHTML("afterbegin", html);
  };

  const removeLoader = () => {
    const loader = document.querySelector(".loader");
    if (loader) loader.remove();
  };

  joinFormSubmitButton.addEventListener("click", () => {
    joinForm.classList.add("join__form--validated");
    const isValid = isFormValid(joinForm);
    joinFormSubmitButton.disabled = !isValid;
  });

  joinForm.addEventListener("input", () => {
    const isValid = isFormValid(joinForm);

    if (!isValid && joinForm.classList.contains("join__form--validated")) {
      joinFormSubmitButton.disabled = true;
    } else {
      joinFormSubmitButton.disabled = false;
    }
  });

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    joinFormSubmitButton.disabled = true;
    addLoader();

    setTimeout(() => {
      const data = new FormData(joinForm);
      const msg = {};

      for (let [name, value] of data) {
        msg[name] = value;
      }

      alert(`Данные из формы:\n\n ${JSON.stringify(msg, null, 2)}`);

      joinForm.reset();
      joinForm.classList.remove("join__form--validated");
      joinFormSubmitButton.disabled = false;
      removeLoader();
    }, 2000);
  });
});
