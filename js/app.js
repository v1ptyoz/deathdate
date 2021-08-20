document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".app--page");
    const appFooter = document.querySelector(".footer-app");
    const section = document.querySelector('.section');
    const data = {};

    function doStep(step) {
        pages.forEach(page => {
            page.style.display = 'none';
        })
        appFooter.style.display = 'none';
        pages[step].style.display = 'block';
    }
    doStep(0);


    let firstAnswer;
    const firstButtons = document.querySelectorAll("button[data-first]");
    firstButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            firstAnswer = button.getAttribute("data-first");
            doStep(1);
            data.first = firstAnswer;
        })
    })

    let secondAnswer;
    let age;
    const secondButton = document.querySelector("button[data-second]");
    const selectDay = document.querySelector("select[data-select='day']");
    const selectMonth = document.querySelector("select[data-select='month']");
    const selectYear = document.querySelector("select[data-select='year']");

    function checkSelect(select) {
        if (select.value == 0) {
            select.classList.add("select--required");
            return false;
        } else {
            select.classList.remove("select--required");
            return true;
        }
    }

    secondButton.addEventListener('click', (e) => {
        e.preventDefault()

        function checkZero(number) {
            if (number <= 9) {
                return `0${number}`
            } else {
                return number;
            }

        }

        if (checkSelect(selectDay) && checkSelect(selectMonth) && checkSelect(selectYear)) {
            let currentDate = new Date();
            const appDate = document.querySelector(".app__date");
            appDate.textContent = `${checkZero(+currentDate.getDate())}.${checkZero(+currentDate.getMonth())}.${currentDate.getFullYear()}`;
            secondAnswer = new Date(`${selectYear.value}-${selectMonth.value}-${selectDay.value}`);
            secondAnswer.setHours(currentDate.getHours());
            secondAnswer.setMinutes(currentDate.getMinutes());
            secondAnswer.setSeconds(currentDate.getSeconds());
            age = currentDate.getFullYear() - secondAnswer.getFullYear();
            doStep(2)
            data.second = secondAnswer;
            data.age = age;
            setTimeout(doStep, 2000, 3);
        }
    })

    let thirdAnswer;
    const thirdButtons = document.querySelectorAll("button[data-third]");
    const appPopup = document.querySelectorAll(".app__popup");

    function showPopup(popup) {
        appPopup[popup].style.opacity = "1";
    }

    thirdButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            thirdAnswer = button.getAttribute("data-third");
            data.third = thirdAnswer;
            if (data.age <= 35) {
                doStep(4)
                setTimeout(showPopup, 500, 0)
            }
            if (data.age >= 36 && age <= 45) {
                doStep(5)
                setTimeout(showPopup, 500, 1)
            }
            if (data.age >= 46) {
                doStep(6)
                setTimeout(showPopup, 500, 2)
            }
        })
    })

    let fourthAnswer;
    const fourthButtons = document.querySelectorAll("button[data-fourth]");
    fourthButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            fourthAnswer = button.getAttribute("data-fourth");
            data.fourth = fourthAnswer;
            doStep(7);
            doLoading();
        })
    })

    function doLoading() {
        const loading = document.querySelector(".loading__load");
        const line = loading.querySelector("span");
        const percentText = document.querySelector(".percent");
        let currentPercent = 0;

        if (pages[7].style.display === "block") {
            let interval = setInterval(() => {
                currentPercent += 20;
                line.style.width = currentPercent + "%";
                percentText.textContent = currentPercent + "%";
                if (currentPercent >= 100) {
                    clearInterval(interval);
                    doStep(8);
                    appFooter.style.display = 'block';
                }
            }, 400)
        }
    }

    const finalBtn = pages[8].querySelector('button');
    finalBtn.addEventListener("click", e => {
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://swapi.dev/api/people/1/');
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(data));

        xhr.addEventListener('load', () => {
            const res = JSON.parse(xhr.responseText);
            pages[8].style.display = "none";
            appFooter.style.display = "none";
            renderAll(res);

        });

    })

    function renderAll(obj) {
        for (let key in obj) {
            if( typeof(obj[key]) === 'object' ){
                render(key, true);
                renderAll(obj[key]);
            } else {
                render(key, false, obj[key]);
            }
        }
    }

    function render(key, isObject = false, value) {
        if (isObject) {
            let h2 = document.createElement('h2');
            h2.style.color = "white";
            h2.style.paddingLeft = `50px`;
            h2.innerText = key;
            section.appendChild(h2);
        } else {
            let p = document.createElement('p');
            p.style.color = "white";
            p.innerText = `${key} => ${value}`;
            section.appendChild(p);

        }
    }

})