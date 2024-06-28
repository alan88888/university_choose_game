document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const npc = document.getElementById("npc");
    const talkButton = document.getElementById("talk-button");
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    const dialogueOk = document.getElementById("dialogue-ok");
    const dialogueNo = document.getElementById("dialogue-no");
    const transitionZone = document.getElementById("transition-zone");

    let canMove = true;

    const urlParams = new URLSearchParams(window.location.search);
    let playerX = parseFloat(urlParams.get('playerX')) || 400;
    let playerY = parseFloat(urlParams.get('playerY')) || 30;

    player.style.top = playerY + "px";
    player.style.left = playerX + "px";

    let playerStats = JSON.parse(localStorage.getItem('playerStats')) || {
        healthCurrent: 50,
        healthMax: 100,
        attack: 20,
        defense: 15,
        manaCurrent: 30,
        manaMax: 50
    };

    function updatePlayerPosition() {
        localStorage.setItem("playerX", playerX);
        localStorage.setItem("playerY", playerY);
    }

    document.addEventListener("keydown", function(event) {
        if (!canMove) return;

        const key = event.key;
        switch(key) {
            case "ArrowUp":
                playerY -= 10;
                break;
            case "ArrowDown":
                playerY += 10;
                break;
            case "ArrowLeft":
                playerX -= 10;
                break;
            case "ArrowRight":
                playerX += 10;
                break;
        }

        if (playerX < 0) playerX = 0;
        if (playerY < 0) playerY = 0;
        const gameContainer = document.getElementById('game-container');
        if (playerX > gameContainer.offsetWidth - player.offsetWidth) {
            playerX = gameContainer.offsetWidth - player.offsetWidth;
        }
        if (playerY > gameContainer.offsetHeight - player.offsetHeight) {
            playerY = gameContainer.offsetHeight - player.offsetHeight;
        }

        player.style.top = playerY + "px";
        player.style.left = playerX + "px";
        updatePlayerPosition();
        checkInteraction();
    });

    const openBagButton = document.getElementById("open-bag-button");
    openBagButton.addEventListener("click", function() {
        const currentTop = parseFloat(player.style.top);
        const currentLeft = parseFloat(player.style.left);

        window.location.href = `../Bag/bag.html?from=map5&playerX=${currentLeft}&playerY=${currentTop}`;
    });

    function checkInteraction() {
        const playerRect = player.getBoundingClientRect();
        const npcRect = npc.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const interactionDistance = 50;
        if (
            Math.abs(playerRect.left - npcRect.left) < interactionDistance &&
            Math.abs(playerRect.top - npcRect.top) < interactionDistance
        ) {
            talkButton.style.top = (npcRect.top - 10) + "px";
            talkButton.style.left = (npcRect.left + npcRect.width / 2) + "px";
            talkButton.classList.remove("hidden");
            talkButton.onclick = function() {
                dialogueBox.classList.remove("hidden");
                dialogueText.innerText = "需要我為您回復精神嗎?那麼請握起我的手，片刻就好";
                dialogueOk.classList.remove("hidden");
                dialogueNo.classList.remove("hidden");
                canMove = false;
            };
        } else {
            talkButton.classList.add("hidden");
            dialogueBox.classList.add("hidden");
            canMove = true;
        }

        const shrinkFactorX = 10;
        const shrinkFactorY = 5;
        const shrinkedTransitionRect = {
            top: transitionRect.top + shrinkFactorY,
            right: transitionRect.right - shrinkFactorX,
            bottom: transitionRect.bottom - shrinkFactorY,
            left: transitionRect.left + shrinkFactorX
        };
        if (
            playerRect.left < shrinkedTransitionRect.right &&
            playerRect.right > shrinkedTransitionRect.left &&
            playerRect.top < shrinkedTransitionRect.bottom &&
            playerRect.bottom > shrinkedTransitionRect.top
        ) {
            window.location.href = "../M3/map3.html?from=map5";
        }
    }

    function handleDialogueEnd() {
        dialogueOk.classList.add("hidden");
        dialogueNo.classList.add("hidden");
        setTimeout(() => {
            dialogueBox.classList.add("hidden");
            canMove = true;
        }, 2000);
    }

    dialogueOk.addEventListener("click", function() {
        dialogueText.innerText = "在此，我將為您獻上祝福，願您能再次踏上旅途";
        playerStats.healthCurrent = playerStats.healthMax;
        playerStats.manaCurrent = playerStats.manaMax;
        localStorage.setItem('playerStats', JSON.stringify(playerStats));
        handleDialogueEnd();
    });

    dialogueNo.addEventListener("click", function() {
        dialogueText.innerText = "那麼下次再見";
        handleDialogueEnd();
    });
});
