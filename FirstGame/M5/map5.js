document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const npc = document.getElementById("npc");
    const talkButton = document.getElementById("talk-button");
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.getElementById("dialogue-text");
    const dialogueOptions = document.getElementById("dialogue-options");
    const dialogueImage = document.getElementById("dialogue-image");
    const transitionZone = document.getElementById("transition-zone");
    const gameContainer = document.getElementById('game-container');
    const fishButton = document.getElementById("fish-button");
    const fishingGame = document.getElementById("fishing-game");
    const pointer = document.getElementById("pointer");
    const messageBoard = document.getElementById("message-board");
    const fishImage = document.getElementById("fish-image");
    const messageText = document.getElementById("message-text");
    const confirmButton = document.getElementById("confirm-button");

    const blockZones = [
        document.getElementById("block-zone-1"),
        document.getElementById("block-zone-2"),
        document.getElementById("block-zone-3"),
        document.getElementById("block-zone-4"),
        document.getElementById("block-zone-5"),
        document.getElementById("block-zone-6")
    ];

    let canMove = true;
    dialogueBox.style.display = "none";
    talkButton.classList.add("hidden");
    fishButton.classList.add("hidden");
    fishingGame.style.display = "none";

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
        let newPlayerX = playerX;
        let newPlayerY = playerY;

        switch(key) {
            case "ArrowUp":
                newPlayerY -= 10;
                break;
            case "ArrowDown":
                newPlayerY += 10;
                break;
            case "ArrowLeft":
                newPlayerX -= 10;
                break;
            case "ArrowRight":
                newPlayerX += 10;
                break;
        }

        if (newPlayerX < 0) newPlayerX = 0;
        if (newPlayerY < 0) newPlayerY = 0;
        if (newPlayerX > gameContainer.offsetWidth - player.offsetWidth) {
            newPlayerX = gameContainer.offsetWidth - player.offsetWidth;
        }
        if (newPlayerY > gameContainer.offsetHeight - player.offsetHeight) {
            newPlayerY = gameContainer.offsetHeight - player.offsetHeight;
        }

        if (!checkBlockCollision(newPlayerX, newPlayerY)) {
            playerX = newPlayerX;
            playerY = newPlayerY;
        } else {
            console.log('Collision detected!');
        }

        player.style.top = playerY + "px";
        player.style.left = playerX + "px";
        updatePlayerPosition();
        checkInteraction();
    });

    function checkBlockCollision(newPlayerX, newPlayerY) {
        const playerRect = {
            top: newPlayerY,
            bottom: newPlayerY + player.offsetHeight,
            left: newPlayerX,
            right: newPlayerX + player.offsetWidth
        };

        for (let blockZone of blockZones) {
            const blockRect = blockZone.getBoundingClientRect();
            const gameContainerRect = gameContainer.getBoundingClientRect();
            const relativeBlockRect = {
                top: blockRect.top - gameContainerRect.top,
                bottom: blockRect.bottom - gameContainerRect.top,
                left: blockRect.left - gameContainerRect.left,
                right: blockRect.right - gameContainerRect.left
            };

            if (
                playerRect.right > relativeBlockRect.left &&
                playerRect.left < relativeBlockRect.right &&
                playerRect.bottom > relativeBlockRect.top &&
                playerRect.top < relativeBlockRect.bottom
            ) {
                console.log('Block collision with', blockZone.id);
                return true;
            }
        }
        return false;
    }

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
        const blockZone1Rect = blockZones[0].getBoundingClientRect();
        const interactionDistance = 30;

        if (
            Math.abs(playerRect.left - npcRect.left) < interactionDistance &&
            Math.abs(playerRect.top - npcRect.top) < interactionDistance
        ) {
            talkButton.style.top = (npcRect.top - 10) + "px";
            talkButton.style.left = (npcRect.left + npcRect.width / 2) + "px";
            talkButton.classList.remove("hidden");
            talkButton.onclick = function() {
                dialogueBox.style.display = "flex";
                startDialogue();
                canMove = false;
            };
        } else {
            talkButton.classList.add("hidden");
            dialogueBox.style.display = "none";
            canMove = true;
        }

        if (
            Math.abs(playerRect.left - blockZone1Rect.left) < interactionDistance + 30 &&
            Math.abs(playerRect.top - blockZone1Rect.top) < interactionDistance + 30 &&
            playerHasFishingRod()
        ) {
            fishButton.classList.remove("hidden");
            fishButton.onclick = startFishingGame;
        } else {
            fishButton.classList.add("hidden");
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

    function playerHasFishingRod() {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        return inventory.some(item => item && item.name === "釣竿");
    }

    function startFishingGame() {
        canMove = false;
        fishButton.innerText = "拉起";
        fishButton.onclick = endFishingGame;
        fishingGame.style.display = "block";
        pointer.style.animationPlayState = "running";
    }

    function endFishingGame() {
        pointer.style.animationPlayState = "paused";
        const pointerPosition = getPointerPosition();
        const fish = checkPointerPosition(pointerPosition);
        showMessageBoard(pointerPosition, fish);
    }

    function getPointerPosition() {
        const fishingBarRect = document.getElementById("fishing-bar").getBoundingClientRect();
        const pointerRect = pointer.getBoundingClientRect();
        const pointerPosition = ((pointerRect.left - fishingBarRect.left) / fishingBarRect.width) * 100;
        return pointerPosition;
    }

    function checkPointerPosition(pointerPosition) {
        if (pointerPosition >= 30 && pointerPosition < 45) {
            return checkFishProbability("yellow");
        } else if (pointerPosition >= 45 && pointerPosition < 55) {
            return checkFishProbability("green");
        } else if (pointerPosition >= 55 && pointerPosition < 70) {
            return checkFishProbability("yellow");
        } else {
            return "grey";
        }
    }

    function checkFishProbability(zone) {
        const fishTypes = {
            yellow: [
                { name: "森林鱸魚", description: "裹滿藤蔓與樹葉的綠色鱸魚，口感類似豆芽菜", image: "fish-1.png", effect: { health: 3, mana: 0 }, probability: 75 },
                { name: "鰍鰍蕉", description: "長著金黃外皮的泥鰍，擅長偽裝成香蕉", image: "fish-3.png", effect: { health: 15, mana: 0 }, probability: 25 }
            ],
            green: [
                { name: "森林鱸魚", description: "裹滿藤蔓與樹葉的綠色鱸魚，口感類似豆芽菜", image: "fish-1.png", effect: { health: 3, mana: 0 }, probability: 35 },
                { name: "鰍鰍蕉", description: "長著金黃外皮的泥鰍，擅長偽裝成香蕉", image: "fish-3.png", effect: { health: 15, mana: 0 }, probability: 50 },
                { name: "晶魚", description: "攝食過量耀晶石的魚類，身體也因此變得晶瑩剔透的", image: "fish-4.png", effect: { health: 0, mana: 30 }, probability: 15 }
            ]
        };

        const selectedZone = fishTypes[zone];
        const randomNumber = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const fish of selectedZone) {
            cumulativeProbability += fish.probability;
            if (randomNumber < cumulativeProbability) {
                return fish;
            }
        }

        return "grey";
    }

    function showMessageBoard(pointerPosition, fish) {
        canMove = false;
        fishButton.innerText = "拋竿";
        fishButton.onclick = startFishingGame;
        fishingGame.style.display = "none";

        if (fish === "grey") {
            messageText.innerText = "太令人難過了，什麼都沒釣到";
            fishImage.src = "";
            fishImage.classList.add("hidden");
        } else {
            const fishName = fish.name;
            const fishImageSrc = fish.image;
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
            const existingFish = inventory.find(item => item && item.name === fishName);
            const fishCount = existingFish ? existingFish.quantity : 0;
            const fishCountText = fishCount >= 5 ? "，但已經釣很多了，還是放生吧" : "";

            if (pointerPosition >= 30 && pointerPosition < 45) {
                messageText.innerHTML = `還不錯，釣到了${fishName}${fishCountText}`;
            } else if (pointerPosition >= 45 && pointerPosition < 55) {
                messageText.innerHTML = `非常好，釣到了${fishName}${fishCountText}`;
            } else if (pointerPosition >= 55 && pointerPosition < 70) {
                messageText.innerHTML = `還不錯，釣到了${fishName}${fishCountText}`;
            }
            fishImage.src = fishImageSrc;
            fishImage.classList.remove("hidden");

            if (!fishCountText) {
                addFishToBag(fish);
            }
        }

        messageBoard.classList.remove("hidden");
        confirmButton.onclick = function() {
            messageBoard.classList.add("hidden");
            canMove = true;
        };
    }

    function addFishToBag(fish) {
        const newFish = {
            name: fish.name,
            quantity: 1,
            type: 'fish',
            effect: fish.effect,
            description: fish.description,
            image: fish.image
        };

        let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from({ length: 15 }, () => null);

        const existingItemIndex = inventory.findIndex(item => item && item.name === newFish.name);
        if (existingItemIndex !== -1) {
            if (inventory[existingItemIndex].quantity < 5) {
                inventory[existingItemIndex].quantity += 1;
            } else {
                return;
            }
        } else {
            const emptySlotIndex = inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                inventory[emptySlotIndex] = newFish;
            } else {
                alert("背包已滿！");
                return;
            }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function handleDialogueEnd() {
        dialogueOptions.innerHTML = '';
        showContinueButton(() => {
            dialogueBox.style.display = "none";
            canMove = true;
        });
    }

    function addFishingRodToBag() {
        const fishingRod = {
            name: "釣竿",
            description: "一支釣魚竿，可以用來釣魚",
            image: "fishing.png"
        };

        let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from({ length: 15 }, () => null);

        const existingItemIndex = inventory.findIndex(item => item && item.name === fishingRod.name);
        if (existingItemIndex === -1) {
            const emptySlotIndex = inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                inventory[emptySlotIndex] = fishingRod;
            } else {
                alert("背包已滿！");
                return;
            }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    function startDialogue() {
        dialogueText.innerText = "有甚麼需要我幫助的嗎?";
        dialogueOptions.innerHTML = '';
        const options = [
            { text: "我需要回復精神", action: handleRest },
            { text: "關於愛好", action: handleHobby },
            { text: "關於魔王", action: handleDemonLord },
            { text: "沒事", action: handleEndDialogue }
        ];

        // 檢查玩家是否持有釣竿
        if (playerHasFishingRod()) {
            options[1] = { text: "推薦釣魚地點", action: handleFishingSpots };
        }

        showDialogueOptions(options);
    }

    function handleRest() {
        dialogueText.innerText = "那請握起我的手，片刻就好";
        showContinueButton(() => {
            dialogueText.innerText = "在此，我將為您獻上祝福，願您能再次踏上旅途";
            playerStats.healthCurrent = playerStats.healthMax;
            playerStats.manaCurrent = playerStats.manaMax;
            localStorage.setItem('playerStats', JSON.stringify(playerStats));
            handleDialogueEnd();
        });
    }

    function handleHobby() {
        dialogueText.innerText = "?????";
        showContinueButton(() => {
            dialogueText.innerText = "我存在的意義就是為了殺死魔王，使世界回歸和平，因此我並沒有什麼個人愛好";
            showContinueButton(() => {
                dialogueText.innerText = "嗯~~~ 好吧，或許釣魚算是吧?";
                showContinueButton(() => {
                    dialogueText.innerText = "只有在釣魚時，我才能稍稍忘卻使命感，享受悠閒的時光";
                    showContinueButton(() => {
                        dialogueText.innerText = "那您喜歡釣魚嗎?";
                        showDialogueOptions([
                            { text: "我也喜歡", action: () => {
                                dialogueText.innerText = "真的嗎 ! 那這支釣竿送給您吧，但願您也能享受愉快的釣魚時光";
                                addFishingRodToBag();
                                handleDialogueEnd();
                            }},
                            { text: "還好", action: handleEndDialogue }
                        ]);
                    });
                });
            });
        });
    }

    function handleDemonLord() {
        dialogueText.innerText = "魔王是一切罪惡的化身，是威脅世界的存在";
        showContinueButton(() => {
            dialogueText.innerText = "我知曉該如何殺死魔王，但我太過於弱小，恐怕無法獨自抵達";
            showContinueButton(() => {
                dialogueText.innerText = "因此，我希望您能協助我，伴我一同前往";
                handleDialogueEnd();
            });
        });
    }

    function handleFishingSpots() {
        dialogueText.innerText = "如果是這附近的話...";
        showContinueButton(() => {
            dialogueText.innerText = "一旁的小湖就是個不錯地點喔";
            showContinueButton(() => {
                dialogueText.innerText = "裡面有一些這片森林特有的魚種";
                showContinueButton(() => {
                    dialogueText.innerText = "像是有與植物共生的神奇魚類，也有像寶石一樣閃閃發亮的魚，還有...";
                    showContinueButton(() => {
                        dialogueText.innerText = "啊! 我好像不小心說太多了呢，這些還是由您親自去體驗會比較有趣喔";
                        handleDialogueEnd();
                    });
                });
            });
        });
    }

    function handleEndDialogue() {
        dialogueText.innerText = "那麼下次再見";
        handleDialogueEnd();
    }

    function showDialogueOptions(options) {
        dialogueOptions.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'dialogue-option-button';
            button.innerText = option.text;
            button.onclick = option.action;
            dialogueOptions.appendChild(button);
        });
    }
    
    function showContinueButton(action) {
        dialogueOptions.innerHTML = '';
        const button = document.createElement('button');
        button.className = 'dialogue-option-button';
        button.innerText = "▶繼續對話▶";
        button.onclick = action;
        dialogueOptions.appendChild(button);
    }

    function createCloudAnimation(cloud, duration, initialDelay) {
        const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - cloud.offsetHeight));
        cloud.style.top = `${randomY}px`;
        cloud.style.left = '-200px';
        setTimeout(() => {
            cloud.style.animation = `moveCloud ${duration}s linear infinite`;
        }, initialDelay);
    }

    const clouds = document.querySelectorAll('.cloud');
    const durations = [33, 52, 71];
    const initialDelays = [0, 10000, 20000];

    clouds.forEach((cloud, index) => {
        const duration = durations[index % durations.length];
        const initialDelay = initialDelays[index % initialDelays.length];
        createCloudAnimation(cloud, duration, initialDelay);
        cloud.addEventListener('animationiteration', () => createCloudAnimation(cloud, duration, 0));
    });
});
