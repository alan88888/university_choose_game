document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const transitionZone = document.getElementById("transition-zone");
    const box = document.getElementById("box");
    const message = document.getElementById("message");
    const openBoxButton = document.getElementById("open-box-button");
    const dialogueBox = document.getElementById("dialogue-box");
    const acceptButton = document.getElementById("accept-button");
    const declineButton = document.getElementById("decline-button");
    const dialogueText = document.getElementById("dialogue-text");
    const dialogueTitle = document.getElementById("dialogue-title");

    // 检查URL参数，获取玩家坐标
    const urlParams = new URLSearchParams(window.location.search);
    let playerX = parseFloat(urlParams.get('playerX')) || initialPlayerX;
    let playerY = parseFloat(urlParams.get('playerY')) || initialPlayerY;

    player.style.top = playerY + "px";
    player.style.left = playerX + "px";

    let canMove = true;

    // 更新玩家位置
    function updatePlayerPosition() {
        localStorage.setItem("playerX", playerX);
        localStorage.setItem("playerY", playerY);
    }

    // 玩家移动事件
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
        // 限制玩家活动范围
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
        checkProximity();
    });

    // 打开背包按钮的点击事件
    const openBagButton = document.getElementById("open-bag-button");
    openBagButton.addEventListener("click", function() {
        // 保存玩家位置
        const currentTop = parseFloat(player.style.top);
        const currentLeft = parseFloat(player.style.left);

        window.location.href = `../Bag/bag.html?from=map2&playerX=${currentLeft}&playerY=${currentTop}`;
    });

    function checkInteraction() {
        const playerRect = player.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const shrinkFactorX = 10; // X轴边界收缩因子
        const shrinkFactorY = 5; // Y轴边界收缩因子
        const shrinkedTransitionRect = {
            top: transitionRect.top + shrinkFactorY,
            right: transitionRect.left - shrinkFactorX,
            bottom: transitionRect.bottom + shrinkFactorY,
            left: transitionRect.left - shrinkFactorX
        };
        if (
            playerRect.bottom > shrinkedTransitionRect.top &&
            playerRect.left > shrinkedTransitionRect.right &&
            playerRect.top < shrinkedTransitionRect.bottom
        ) {
            window.location.href = "../M3/map3.html?from=map2";
        }
    }

    function openBox() {
        dialogueBox.classList.remove("hidden");
        canMove = false;
        acceptButton.style.display = "inline-block";
        declineButton.style.display = "inline-block";
    }

    function handleDialogueEnd() {
        setTimeout(() => {
            dialogueBox.classList.add("hidden");
            canMove = true;
        }, 2000);
    }

    function addPotionToBag() {
        const potion = {
            name: "迎賓酒",
            quantity: 1,
            type: 'potion',
            effect: { health: 3, mana: 3 },
            description: '盛放於頗有韻味的高腳杯中有著些許氣泡的金黃色液體',
            image: 'potion.png'
        };

        let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from({length: 10}, () => null);

        const existingItemIndex = inventory.findIndex(item => item && item.name === potion.name);
        if (existingItemIndex !== -1) {
            inventory[existingItemIndex].quantity += 1;
        } else {
            const emptySlotIndex = inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                inventory[emptySlotIndex] = potion;
            } else {
                alert("背包已滿！");
                return;
            }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function addDungToBag() {
        const dung = {
            name: "蔬菜棒蘸雪",
            quantity: 1,
            type: "dung",
            effect: { health: -5, mana: -2 },
            description: '十分甚至九分美味的蔬菜棒蘸醬令人回味無窮',
            image: "dung.png"
        };

        let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from({length: 10}, () => null);

        const existingItemIndex = inventory.findIndex(item => item && item.name === dung.name);
        if (existingItemIndex !== -1) {
            inventory[existingItemIndex].quantity += 1;
        } else {
            const emptySlotIndex = inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                inventory[emptySlotIndex] = dung;
            } else {
                alert("背包已滿！");
                return;
            }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    openBoxButton.addEventListener("click", openBox);

    acceptButton.addEventListener("click", function() {
        const random = Math.random();
        if (random < 0.5) {
            addPotionToBag();
        } else {
            addDungToBag();
        }
        dialogueText.innerText = "不可以浪費食物喔";
        acceptButton.style.display = "none";
        declineButton.style.display = "none";
        handleDialogueEnd();
    });

    declineButton.addEventListener("click", function() {
        dialogueText.innerText = "哎呀，真是可惜這麼好的料理(迫真)";
        acceptButton.style.display = "none";
        declineButton.style.display = "none";
        handleDialogueEnd();
    });

    function checkProximity() {
        const playerRect = player.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();
        const distance = Math.hypot(playerRect.left - boxRect.left, playerRect.top - boxRect.top);

        if (distance < 100) {
            message.style.display = "block";
        } else {
            message.style.display = "none";
        }
    }
});
