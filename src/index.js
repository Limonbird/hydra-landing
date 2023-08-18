document.addEventListener("DOMContentLoaded", () => {
  const joinForm = document.querySelector(".join__form");
  const joinFormSubmitButton = joinForm.querySelector(".join__submit");
  const inputList = joinForm.querySelectorAll("input");
  const textareaList = joinForm.querySelectorAll("textarea");
  const formElementList = [...inputList, ...textareaList];

  const hasErrors = (elementList) => {
    return elementList.some((element) => {
      return !element.validity.valid;
    });
  };

  formElementList.forEach((element) => {
    element.addEventListener("change", () => {
      const isFormValid = !hasErrors(formElementList);

      if (isFormValid) {
        joinFormSubmitButton.disabled = false;
      }
    });
  });

  joinFormSubmitButton.addEventListener("click", () => {
    const isFormValid = !hasErrors(formElementList);

    if (!isFormValid) {
      joinForm.classList.add("join__form--validated");
      joinFormSubmitButton.disabled = true;
    }
  });

  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    //@TODO: добавить лоадер (код из php-формы, css найти неоновый лоадер)
    joinFormSubmitButton.disabled = true;

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
    }, 2000);
  });
});
