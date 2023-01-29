let mainCont = document.getElementById("main_container");
let allCards = document.getElementById("all_cards");
let createCardBtn = document.getElementById("create_card");
let cardsNumber = document.getElementById("cards_number")
let createCont = document.getElementById("create_container");
let closeBtn = document.getElementById("close");
let question = document.getElementById("question");
let answer = document.getElementById("answer");
let saveBtn = document.getElementById("save");
let hideAllAnswersBtn = document.getElementById("hide_all_answers")
let downloadBtn = document.getElementById("download")
let uploadBtn = document.getElementById("upload")



createCardBtn.addEventListener("click", e => {
    mainCont.style.display = 'none';
    createCont.style.display = '';
})

closeBtn.addEventListener("click", e => {
    mainCont.style.display = '';
    createCont.style.display = 'none'
})

saveBtn.addEventListener("click", e => {
    addCard();
})

function addCard() {
    let div = document.createElement("div");
    div.classList.add("box");
    div.innerHTML += "<textarea rows='3' id='q'>" + question.value + "</textarea>" + "<br>";
    div.innerHTML += "<textarea rows='5' id='a'>" + answer.value + "</textarea>" + "<br>";
    div.innerHTML += "<button id='show_answer'>Show answer</button>"
    div.children[2].setAttribute("style","display: none;" );
    allCards.append(div)
    div.lastChild.addEventListener("click",  e => hideShowAnswer(div));

    question.value = "";
    answer.value = "";
    cardsNumber.innerText = Number(cardsNumber.innerText) + 1
    mainCont.style.display = '';
    createCont.style.display = 'none';
}

function hideShowAnswer(div) {
    if (div.children[4].attributes.getNamedItem("id").value === 'show_answer') {
        div.children[2].setAttribute("style", "display: '';");
        let new_btn = document.createElement("button");
        new_btn.setAttribute("id", 'hide_answer');
        new_btn.innerText = 'Hide answer'
        div.lastChild.replaceWith(new_btn);
        div.lastChild.addEventListener("click", e => hideShowAnswer(div));
    } else {
        div.children[2].setAttribute("style", "display: none;");
        let new_btn = document.createElement("button");
        new_btn.setAttribute("id", 'show_answer');
        new_btn.innerText = 'Show answer'
        div.lastChild.replaceWith(new_btn);
        div.lastChild.addEventListener("click", e => hideShowAnswer(div));
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
    console.log(text);
    let data = text.split("\r\n");
    for(let i = 0; i < data.length - 1; ++i) {
        let row = data[i].split(";");
        question.value = row[0];
        answer.value = row[1];
        addCard(e);
    }


    file.value = null;

    // fetch('uploads/' + encodeURIComponent(entry.name),
    //     {method: 'PUT', body: data});
    // location.reload();
});
