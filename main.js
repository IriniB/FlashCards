let mainCont = document.getElementById("main_container");
let allCards = document.getElementById("all_cards");
let createCardBtn = document.getElementById("create_card");
let cardsNumber = document.getElementById("cards_number");
let createCont = document.getElementById("create_container");
let closeBtn = document.getElementById("close");
let question = document.getElementById("question");
let answer = document.getElementById("answer");
let saveBtn = document.getElementById("save");
let hideAllAnswersBtn = document.getElementById("hide_all_answers");
let downloadBtn = document.getElementById("download");
let uploadBtn = document.getElementById("upload");

let cardsCounter = 0;
restoreCardsAfterReload();

function restoreCardsAfterReload() {
    let keys = Object.keys(localStorage);
    let cardsNum = keys.length;
    cardsCounter = cardsNum;

    for(let i = 0; i < cardsNum; ++i) {
        let card = JSON.parse(localStorage.getItem(keys[i]));
        question.value = card.q;
        answer.value = card.a;
        addCardToContainer();
    }
}


createCardBtn.addEventListener("click", e => {
    mainCont.style.display = 'none';
    createCont.style.display = '';
});

closeBtn.addEventListener("click", e => {
    mainCont.style.display = '';
    createCont.style.display = 'none'
});

saveBtn.addEventListener("click", e => {
    addCard();
});

function addCard() {
    localStorage.setItem(cardsCounter, JSON.stringify({"q": question.value, "a": answer.value}));
    cardsCounter += 1;
    addCardToContainer();
}

function addCardToContainer() {
    let div = document.createElement("div");
    div.classList.add("box");
    div.innerHTML += "<textarea rows='3' id='q'>" + question.value + "</textarea>" + "<br>";
    div.innerHTML += "<textarea rows='5' id='a'>" + answer.value + "</textarea>" + "<br>";
    div.innerHTML += "<button id='show_answer'>Show answer</button>";
    div.innerHTML += "<button id='delete_card'>Delete card</button>";
    div.children[2].setAttribute("style","display: none;" );
    div.children[4].addEventListener("click",  e => hideShowAnswer(div));
    allCards.append(div);
    div.lastChild.addEventListener("click",  e => deleteCard(div));

    question.value = "";
    answer.value = "";
    cardsNumber.innerText = Number(cardsNumber.innerText) + 1;
    mainCont.style.display = '';
    createCont.style.display = 'none';
}

function hideShowAnswer(div) {
    if (div.children[4].attributes.getNamedItem("id").value === 'show_answer') {
        div.children[2].setAttribute("style", "display: '';");
        let new_btn = document.createElement("button");
        new_btn.setAttribute("id", 'hide_answer');
        new_btn.innerText = 'Hide answer';
        div.children[4].replaceWith(new_btn);
        div.children[4].addEventListener("click", e => hideShowAnswer(div));
    } else {
        div.children[2].setAttribute("style", "display: none;");
        let new_btn = document.createElement("button");
        new_btn.setAttribute("id", 'show_answer');
        new_btn.innerText = 'Show answer';
        div.children[4].replaceWith(new_btn);
        div.children[4].addEventListener("click", e => hideShowAnswer(div));
    }
}

function deleteCard(div) {
    allCards.removeChild(div);
    deleteCardFromStorage(div);
}

function deleteCardFromStorage(div) {
    let keys = Object.keys(localStorage);
    let cardsNum = keys.length;
    for(let i = 0; i < cardsNum; ++i) {
        let q = div.children[0].value;
        let a = div.children[2].value;
        let cardValue = JSON.stringify({"q": q, "a": a});
        if (localStorage.getItem(keys[i]) === cardValue) {
            localStorage.removeItem(keys[i]);
            return;
        }
    }
}


hideAllAnswersBtn.addEventListener("click", e => {
    for(let i = 0; i < allCards.children.length; ++i) {
        if (allCards.children[i].children[4].attributes.getNamedItem("id").value !== 'show_answer') {
            hideShowAnswer(allCards.children[i]);
        }
    }
});


downloadBtn.addEventListener("click", e => {
    let data = "";
    for(let i = 0; i < allCards.children.length; ++i) {
        let q = allCards.children[i].children[0].value;
        let a = allCards.children[i].children[2].value;
        data += q + ";" + a + "\r\n";
    }

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(data));
    element.setAttribute('download', 'flash_cards.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});

uploadBtn.addEventListener("click", async e => {
    let file = document.getElementById("file");
    let text = await (new Response(file.files[0])).text();
    let data = text.split("\r\n");
    localStorage.clear();
    for(let i = 0; i < data.length - 1; ++i) {
        let row = data[i].split(";");
        question.value = row[0];
        answer.value = row[1];
        addCard(e);
    }
    file.value = null;
});
