import postData from ''; // Сервисная функция которая постит данные

// Функция счетчик, которая по клику на плюс или минус принимает данные с сервера и прибавляет/убавляет количество в поле результата
function counter({
    minusButtonsIdentifier, // идентификатор всех кнопок минус
    plusButtonsIdentifier, // идентификатор всех кнопок плюс
    resultFieldIdentifier, // идентификатор всех полей для результата
    nonActiveClass, // класс неактивной кнопки
    url // урл сервера
}) {
    const minusButtons = document.querySelectorAll(minusButtonsIdentifier);
    const plusButtons = document.querySelectorAll(plusButtonsIdentifier);
    const resultField = document.querySelectorAll(resultFieldIdentifier);

    let sendRequest = true;

    if (!minusButtons.length || !plusButtons.length || !resultField.length) { return; } 

    function buttonClickEvent(button, i) {
        if (sendRequest) {
            if (button === plusButtons[i]) { // если плюс
                if (!button.classList.contains(nonActiveClass)) { // проверяем, если неактивный класс у кнопки, то не отправляем запрос
                    sendRequest = false;
                    postData(url, {action: 'add'}) // в тело передаем объект с нужной инфой
                        .then(result => {
                            if (+result.quantity > 1) { minusButtons[i].classList.remove(nonActiveClass); } // делаем проверку, если количество больше 1 то у кнопки минус удаляем не активный класс

                            if (result.quantity >= result.total) { // делаем проверку, если количество больше или равно общему количеству
                                button.classList.add(nonActiveClass); // то вешаем класс неактивности на кнопку плюс
                                resultField[i].textContent = result.quantity; // выводим количество в поле результата
                            } else { // если количество меньше общего количества
                                resultField[i].textContent = result.quantity; // выводим количество в поле результата
                            }
                        })
                        .finally(result => sendRequest = true);
                }
            }
            if (button === minusButtons[i]) { // если минус
                if (!button.classList.contains(nonActiveClass)) { // проверяем, если неактивный класс у кнопки, то не отправляем запрос
                    sendRequest = false;
                    postData(url, {action: 'remove'}) // в тело передаем объект с нужной инфой
                        .then(result => {
                            if (result.quantity < result.total) { plusButtons[i].classList.remove(nonActiveClass); } // делаем проверку, если количество меньше общего количества то у кнопки плюс удаляем не активный класс

                            if (+result.quantity <= 1) { // делаем проверку, если количество меньше или равно единице
                                button.classList.add(nonActiveClass); // то вешаем класс неактивности на кнопку минус
                                resultField[i].textContent = result.quantity; // выводим количество в поле результата
                            } else { // если количество больше общего количества
                                resultField[i].textContent = result.quantity; // выводим количество в поле результата
                            }
                        })
                        .finally(result => sendRequest = true);
                }
            }
        }
    }

    plusButtons.forEach((plusButton, i) => plusButton.addEventListener('click', e => {
        e.preventDefault();
        buttonClickEvent(plusButton, i);
    }));
    minusButtons.forEach((minusButton, i) => minusButton.addEventListener('click', e => {
        e.preventDefault();
        buttonClickEvent(minusButton, i);
    }));
}

export default counter;

// Вызов функции счетчик, которая по клику на плюс или минус принимает данные с сервера и прибавляет/убавляет количество в поле результата
// counter({
//     minusButtonsIdentifier: '[data-counter-minus]',
//     plusButtonsIdentifier: '[data-counter-plus]',
//     resultFieldIdentifier: '[data-counter-block]',
//     nonActiveClass: 'b-cart--content--collection--clause--info--counter--action---no-active',
//     url: '' // сюда пишется урл сервера
// })