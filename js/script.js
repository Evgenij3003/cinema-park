/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==========================================================================================================================================================================*/
/* Обработка "кликов" на кнопки "Остаться" и "Отписаться" на странице "Отписка" */
if (document.querySelector(".page-unsubscribe")) {
    const buttonStay = document.querySelector("[data-button-stay]");
    const buttonUnsubscribe = document.querySelector("[data-button-unsubscribe]");
    const contentMain = document.querySelector(".content--main");

    buttonStay.addEventListener("click", function(e) {
        const contentStay = document.querySelector(".content--stay");

        hideBlock(contentMain, 250);
        showBlock(contentStay, 250);

        if (contentStay.querySelector("input[type='radio']")) {
            onChangeRadio(contentStay);
        }

        handleForm(contentStay);
    });

    buttonUnsubscribe.addEventListener("click", function(e) {
        const contentUnsubscribe = document.querySelector(".content--unsubscribe");

        hideBlock(contentMain, 250);
        showBlock(contentUnsubscribe, 250);

        if (contentUnsubscribe.querySelector("input[type='radio']")) {
            onChangeRadio(contentUnsubscribe);
        }

        handleForm(contentUnsubscribe);
    });
}


// Функция скрытия блока:
function hideBlock(elem, timeout = 200) {
    if (typeof elem !== "undefined") {
        elem.classList.add("hide");
        
        setTimeout(() => {
            elem.style.display = "none";
        }, timeout);
    }
}

// Функция показа блока:
function showBlock(elem, timeout = 200) {
    if (typeof elem !== "undefined") {
        setTimeout(() => {
            elem.style.display = "block";
            elem.classList.remove("hide");
        }, timeout);
    }
}

// Функция обработки переключения радио-кнопок:
function onChangeRadio(elem) {
    const form = elem.querySelector(".form-unsubscribe");
    const textarea = elem.querySelector("textarea");

    form.addEventListener("change", function(e) {
        if (e.target.getAttribute("type") === "radio") {
            const activeValue = e.target.value;

            if (activeValue === "otherReason") {
                form.classList.add("validate");

                typeof textarea !== "undefined" 
                    ? textarea.style.display = "inline-block" 
                    : null;
            } else {
                form.classList.remove("validate");
                textarea.classList.remove("input-error");

                if (textarea.parentElement.querySelector("span.error")) {
                    let errorElem = textarea.parentElement.querySelector("span.error");
                    errorElem.setAttribute("hidden", "");
                }

                typeof textarea !== "undefined" 
                    ? textarea.style.display = "none" 
                    : null;
            }
        }
    });
}



/*==========================================================================================================================================================================*/
/* Отправка формы */
function handleForm(elem) {
    const form = elem.querySelector("form");
    let error = 0;

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        sendForm(form);
    });


    // Функция проверки и обработки результатов валидации формы:
    async function sendForm(form) {
        if (form.classList.contains("validate")) {
            validateForm(form);
        }

        let formData = new FormData(form);

        if (error === 0) {
            let response = await fetch("form.php", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                let result = await response.json();
                form.reset();
            } else {
                alert("Ошибка отправки");
            }
        } else {
            alert("Заполните обязательные поля");
        }
    }  


    // Функция валидации формы:
    function validateForm(form) {
        error = 0;
        let inputsRequired = form.querySelectorAll("[data-required]");

        for (let index = 0; index < inputsRequired.length; index++) {
            const input = inputsRequired[index];
            removeError(input);

            if ((input.getAttribute("type") === "text" || input.tagName === "TEXTAREA") && input.value.trim().length < 3) {
                addError(input);
            }
        }
    }
                
                
    // Функция добавления полю ввода и его родителю класса "input-error" (ошибка):
    function addError(input) {
        error++;
        input.classList.add("input-error");

        if (input.parentElement.querySelector("span.error")) {
            let errorElem = input.parentElement.querySelector("span.error");
            errorElem.removeAttribute("hidden");
        }
    }
            
                
    // Функция удаления у поля ввода и его родителя класса "input-error" (ошибка):
    function removeError(input) {
        input.classList.remove("input-error");

        if (input.parentElement.querySelector("span.error")) {
            let errorElem = input.parentElement.querySelector("span.error");
            errorElem.setAttribute("hidden", "");
        }
    }
}