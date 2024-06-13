document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById("game-container");
    const npcB = document.getElementById("npcB");
    const dialogContent = document.getElementById("dialog-content");
    let buttonsContainer;

    npcB.addEventListener("click", function() {
        buttonsContainer = document.createElement("div");
        buttonsContainer.id = "button-container";
        buttonsContainer.style.position = "absolute";
        buttonsContainer.style.top = "50%";
        buttonsContainer.style.left = "50%";
        buttonsContainer.style.transform = "translate(-50%, -50%)";
        buttonsContainer.style.textAlign = "center";

        const button1 = createButton("好", "謝謝你");
        const button2 = createButton("不好", "你是一個壞蛋");
        const button3 = createButton("我支持蔡英文", "我反悔了，還是不加入好了");
        buttonsContainer.appendChild(button1);
        buttonsContainer.appendChild(button2);
        buttonsContainer.appendChild(button3);

        gameContainer.appendChild(buttonsContainer);
    });

    function createButton(text, dialog) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("small-button");
        button.style.marginRight = "10px";
        button.addEventListener("click", function() {
            dialogContent.innerText = "魔女：" + dialog;
            if (buttonsContainer) {
                buttonsContainer.remove();
                buttonsContainer = null;
            }
            // send to end
            axios.post('http://localhost:8888/receive-dialog', { dialog })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
        return button;
    }
});

/*document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById("game-container");
    const npcB = document.getElementById("npcB");
    const dialogContent = document.getElementById("dialog-content");
    let buttonsContainer;

    npcB.addEventListener("click", function() {
        buttonsContainer = document.createElement("div");
        buttonsContainer.id = "button-container";
        buttonsContainer.style.position = "absolute";
        buttonsContainer.style.top = "50%";
        buttonsContainer.style.left = "50%";
        buttonsContainer.style.transform = "translate(-50%, -50%)";
        buttonsContainer.style.textAlign = "center";

        const button1 = createButton("好", "謝謝你");
        const button2 = createButton("不好", "你是一個壞蛋");
        const button3 = createButton("我支持蔡英文", "我反悔了，還是不加入好了");
        buttonsContainer.appendChild(button1);
        buttonsContainer.appendChild(button2);
        buttonsContainer.appendChild(button3);

        gameContainer.appendChild(buttonsContainer);
    });

    function createButton(text, dialog) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("small-button");
        button.style.marginRight = "10px";
        button.addEventListener("click", function() {

            dialogContent.innerText = "魔女：" + dialog;

            if (buttonsContainer) {
                buttonsContainer.remove();
                buttonsContainer = null;
            }
        });
        return button;
    }
});
*/
