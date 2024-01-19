const getAnotherUser = function (event) {
    event.preventDefault();
    console.log(event.target[0].value);
}

const bind_getAnotherUser = function () {
    const elements = document.getElementsByClassName('get_another_user');
    console.log(elements);
    Array.from(elements).forEach((element) => {
        console.log(element);
        element.addEventListener('submit', getAnotherUser);
    });
}

document.addEventListener('DOMContentLoaded', bind_getAnotherUser);
