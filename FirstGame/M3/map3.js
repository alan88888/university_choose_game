document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const npc = document.getElementById("npc");
    const npcTalkButton = document.getElementById("npc-talk-button");
    const npcDialogue = document.getElementById("npc-dialogue");
    const npcText = document.getElementById("npc-text");
    const npcOptions = document.getElementById("npc-dialogue-options");

    const hero = document.getElementById("hero");
    const heroTalkButton = document.getElementById("hero-talk-button");
    const heroDialogue = document.getElementById("hero-dialogue");
    const heroOption1 = document.getElementById("hero-option1");
    const heroOption2 = document.getElementById("hero-option2");

    const witch = document.getElementById("witch");
    const witchTalkButton = document.getElementById("witch-talk-button");
    const witchDialogue = document.getElementById("witch-dialogue");
    const witchOption1 = document.getElementById("witch-option1");
    const witchOption2 = document.getElementById("witch-option2");

    // 检查URL参数，获取玩家坐标
    const urlParams = new URLSearchParams(window.location.search);
    let playerX = parseFloat(urlParams.get('playerX')) || initialPlayerX;
    let playerY = parseFloat(urlParams.get('playerY')) || initialPlayerY;

    player.style.top = playerY + "px";
    player.style.left = playerX + "px";

    const viewButton = document.getElementById("view-button");
    const infoBox = document.getElementById("info-box");
    const centerSquare = document.getElementById("center-square");
    const gameContainer = document.getElementById('game-container');
    const blockZones = [
        document.getElementById("block-zone-1"),
        document.getElementById("block-zone-2"),
        document.getElementById("block-zone-3"),
        document.getElementById("block-zone-4")
    ];

    let canMove = true; // 用于控制玩家是否能移动

    // 初始化时隐藏对话框和按钮
    npcDialogue.classList.add("hidden");
    npcTalkButton.classList.add("hidden");

    heroDialogue.classList.add("hidden");
    heroTalkButton.classList.add("hidden");

    witchDialogue.classList.add("hidden");
    witchTalkButton.classList.add("hidden");

    // 更新玩家位置
    function updatePlayerPosition() {
        localStorage.setItem("playerX", playerX);
        localStorage.setItem("playerY", playerY);
    }

    // 玩家移动事件
    document.addEventListener("keydown", function(event) {
        if (!canMove) return; // 如果不能移动则直接返回

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

        // 检查是否与任何阻挡区块碰撞
        if (!checkBlockCollision(newPlayerX, newPlayerY)) {
            playerX = newPlayerX;
            playerY = newPlayerY;
        } else {
            console.log('Collision detected!');
        }

        player.style.top = playerY + "px";
        player.style.left = playerX + "px";
        updatePlayerPosition();
        checkProximity();
        checkNPCInteraction(npc, npcTalkButton, npcDialogue);
        checkNPCInteraction(hero, heroTalkButton, heroDialogue);
        checkNPCInteraction(witch, witchTalkButton, witchDialogue);
        checkInteraction1();
        checkInteraction2();
        checkInteraction3();
        checkInteraction4();
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
                return true; // 发生碰撞
            }
        }
        return false;
    }

    viewButton.addEventListener("click", function() {
        infoBox.style.display = "block";
        infoBox.innerHTML = '北-水晶礦區 南-林間空地 東-接駁站 西-商店街';
    });

    const openBagButton = document.getElementById("open-bag-button");
    openBagButton.addEventListener("click", function() {
        // 保存玩家位置
        const currentTop = parseFloat(player.style.top);
        const currentLeft = parseFloat(player.style.left);

        window.location.href = `../Bag/bag.html?from=map3&playerX=${currentLeft}&playerY=${currentTop}`;
    });

    function checkProximity() {
        const playerRect = player.getBoundingClientRect();
        const centerSquareRect = centerSquare.getBoundingClientRect();
        const distance = Math.hypot(playerRect.left - centerSquareRect.left, playerRect.top - centerSquareRect.top);

        if (distance < 50) {
            viewButton.classList.remove("hidden");
        } else {
            viewButton.classList.add("hidden");
            infoBox.style.display = "none";
        }
    }

    function checkNPCInteraction(npcElement, talkButton, dialogueBox) {
        const playerRect = player.getBoundingClientRect();
        const npcRect = npcElement.getBoundingClientRect();
        const distance = Math.hypot(playerRect.left - npcRect.left, playerRect.top - npcRect.top);

        if (distance < 50) {
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
    }

    function startDialogue() {
        const dialogues = [
            "....",
            ".....zzzZZZZ",
            "嗨呀!(驚醒) 抱歉阿年輕人，老夫又不小心打起了瞌睡",
            "哈哈，怎麼了嗎? 有甚麼需要老頭子我幫忙的，儘管說吧"
        ];
        let dialogueIndex = 0;
    
        function showNextDialogue() {
            if (dialogueIndex < dialogues.length - 1) {
                npcText.innerText = dialogues[dialogueIndex];
                dialogueIndex++;
                showContinueButton(showNextDialogue);
            } else {
                npcText.innerText = dialogues[dialogueIndex];
                checkKnightToken();
            }
        }
    
        showNextDialogue();
    }
    
    function checkKnightToken() {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const equipInventory = JSON.parse(localStorage.getItem('equipInventory')) || [];
        const equippedItem = JSON.parse(localStorage.getItem('equippedItem')) || null;
    
        const hasKnightToken = inventory.some(item => item && item.name === "騎士勳章") ||
            equipInventory.some(item => item && item.name === "騎士勳章") ||
            (equippedItem && equippedItem.name === "騎士勳章");
    
        if (hasKnightToken) {
            showDialogueOptions([
                { text: "再來一碗", action: serveAnotherBowl },
                { text: "關於你", action: aboutYou },
                { text: "沒事", action: endDialogueNow }
            ]);
        } else {
            showDialogueOptions([
                { text: "關於鍋子", action: aboutPot },
                { text: "關於你", action: aboutYou },
                { text: "沒事", action: endDialogueNow }
            ]);
        }
    }
    
    function serveAnotherBowl() {
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const fishIndex = inventory.findIndex(item => item && item.name === "森林鱸魚");
    
        if (fishIndex !== -1 && inventory[fishIndex].quantity >= 5) {
            inventory[fishIndex].quantity -= 5;
            if (inventory[fishIndex].quantity === 0) {
                inventory[fishIndex] = null;
            }
            localStorage.setItem('inventory', JSON.stringify(inventory));
            addKnightSoupToInventory();
            npcText.innerText = "再來一碗燉湯已經準備好了，享用吧!";
            showContinueButton(() => {
                npcDialogue.style.display = "none";
                canMove = true;
            });
        } else {
            npcText.innerText = "好像已經吃完了呢";
            showContinueButton(() => {
                npcDialogue.style.display = "none";
                canMove = true;
            });
        }
    }
    
    function addKnightSoupToInventory() {
        const soup = {
            name: "騎士大燉湯",
            description: "一碗有滿滿飽足感的蔬菜魚肉燉湯",
            image: "soup.png",
            type: "potion",
            effect: { health: 100, mana: 0 }
        };
        const inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from({ length: 20 }, () => null);
    
        const existingItemIndex = inventory.findIndex(item => item && item.name === soup.name);
        if (existingItemIndex !== -1) {
            inventory[existingItemIndex].quantity += 1;
        } else {
            const emptySlotIndex = inventory.findIndex(item => item === null);
            if (emptySlotIndex !== -1) {
                inventory[emptySlotIndex] = { ...soup, quantity: 1 };
            } else {
                alert("背包已滿！");
                return;
            }
        }
    
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }
    
    function showDialogueOptions(options) {
        npcOptions.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'dialogue-button';
            button.innerText = option.text;
            button.onclick = option.action;
            npcOptions.appendChild(button);
        });
    }
    
    function showContinueButton(action) {
        npcOptions.innerHTML = '';
        const button = document.createElement('button');
        button.className = 'dialogue-button';
        button.innerText = "▶繼續對話▶";
        button.onclick = action;
        npcOptions.appendChild(button);
    }
    

    function aboutPot() {
        const dialogues = [
            "阿~~這個啊",
            "你也想來幾碗嗎? 我家祖傳的燉湯，很美味的",
            "但總覺得缺了點什麼啊~~ 這附近能入鍋的食材著實有點少啊",
            "要是能再加點蔬菜和魚肉的話，想必會更加好吃的"
        ];
        let dialogueIndex = 0;
    
        function showNextDialogue() {
            if (dialogueIndex < dialogues.length - 1) {
                npcText.innerText = dialogues[dialogueIndex];
                dialogueIndex++;
                showContinueButton(showNextDialogue);
            } else {
                npcText.innerText = dialogues[dialogueIndex];
                dialogueIndex++;
                checkPlayerFish();
            }
        }
    
        function checkPlayerFish() {
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
            const fish = inventory.find(item => item && item.name === "森林鱸魚");
            if (fish && fish.quantity >= 5) {
                showDialogueOptions([
                    { text: "我這裡剛好有一些食材", action: giveFish },
                    { text: "抱歉，我身上也沒有", action: apologizeNoFish }
                ]);
            } else {
                showContinueButton(() => {
                    npcDialogue.style.display = "none";
                    canMove = true;
                });
            }
        }
    
        function giveFish() {
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
            const fishIndex = inventory.findIndex(item => item && item.name === "森林鱸魚");
            if (fishIndex !== -1 && inventory[fishIndex].quantity >= 5) {
                inventory[fishIndex].quantity -= 5;
                if (inventory[fishIndex].quantity === 0) {
                    inventory[fishIndex] = null;
                }
                localStorage.setItem('inventory', JSON.stringify(inventory));
                npcText.innerText = "哎呀! 真是太棒啦，這個味道! 你也務必要嚐看看";
                showContinueButton(() => {
                    npcText.innerText = "太感謝你了，心地善良的年輕人啊";
                    showContinueButton(() => {
                        npcText.innerText = "雖然只是一把老骨頭而已，但遇到困難時請呼叫我吧，一定能派上用場的";
                        addKnightSoupToInventory();
                        addKnightTokenToBag();
                        showContinueButton(() => {
                            npcDialogue.style.display = "none";
                            canMove = true;
                        });
                    });
                });
            }
        }

        function addKnightTokenToBag() {
            const knightToken = {
                name: "騎士勳章",
                description: "與老騎士締結友誼的證明，一枚老舊卻依然帶有光澤，有著樹藤紋理的勳章",
                image: "token-1.png",
                specialAttack: "堅毅守護者",
                specialAttackDescription: "三回合內防禦提升30%",
                specialAttackCost: 10,
                friendshipSkill: "防禦反擊",
                friendshipSkillDescription: "受到攻擊時立刻對攻擊者發動一次普通攻擊，持續三回合",
                friendshipSkillCost: 50,
                friendshipSkillCooldown: 5,
                passiveSkill: "防守態勢",
                passiveSkillDescription: "帶有防禦提升效果時，每回合結束回復10血量"
            };
        
            let equipInventory = JSON.parse(localStorage.getItem('equipInventory')) || Array.from({ length: 10 }, () => null);
        
            for (let i = 0; i < equipInventory.length; i++) {
                if (!equipInventory[i]) {
                    equipInventory[i] = knightToken;
                    localStorage.setItem('equipInventory', JSON.stringify(equipInventory));
                    return;
                }
            }
        
            alert('裝備儲存格已滿！');
        }
    
        function apologizeNoFish() {
            npcText.innerText = "沒關係的，只是湯會清淡一點而已";
            showContinueButton(() => {
                npcDialogue.style.display = "none";
                canMove = true;
            });
        }
    
        showNextDialogue();
    }
    
    function endDialogue(type) {
        let finalText;
        switch(type) {
            case "沒事":
                finalText = "呵~阿~~~ 那我得回去再稍微睡一會了";
                break;
            case "關於你":
                finalText = "(年邁的騎士看起來有些許的消沉)";
                break;
            case "關於鍋子":
                finalText = "要是能再加點蔬菜和魚肉的話，想必會更加好吃的";
                break;
            default:
                finalText = "呵~阿~~~ 那我得回去再稍微睡一會了";
        }
        npcText.innerText = finalText;
        showContinueButton(() => {
            npcDialogue.style.display = "none";
            canMove = true;
        });
    }
    
    function aboutYou() {
        const dialogues = [
            "哎呀~ 我還真是健忘阿，都忘記先報上名字是基本禮儀了",
            "我叫做瑟蓋爾，是直屬於瑟魯斯王室的親衛騎士",
            "我的祖國因為魔王的現世，陷入了危難之中，而我必須做點什麼....",
            "只要能...打倒魔王.. 一切都會好起來的...一定會的...(沉默)"
        ];
        let dialogueIndex = 0;
    
        function showNextDialogue() {
            if (dialogueIndex < dialogues.length) {
                npcText.innerText = dialogues[dialogueIndex];
                dialogueIndex++;
                showContinueButton(showNextDialogue);
            } else {
                endDialogue("關於你");
            }
        }
    
        showNextDialogue();
    }
    
    function endDialogueNow() {
        endDialogue("沒事");
    }

    function checkInteraction1() {
        const transitionZone = document.getElementById("transition-zone1");
        const playerRect = player.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const shrinkFactorX = 10;
        const shrinkFactorY = 5;
        const shrinkedTransitionRect = {
            top: transitionRect.top + shrinkFactorY,
            right: transitionRect.right - shrinkFactorX,
            bottom: transitionRect.top + shrinkFactorY,
            left: transitionRect.left + shrinkFactorX
        };

        if (
            playerRect.left < shrinkedTransitionRect.right &&
            playerRect.right > shrinkedTransitionRect.left &&
            playerRect.top < shrinkedTransitionRect.bottom
        ) {
            window.location.href = "../M6/map6.html?from=map3";
        }
    }

    function checkInteraction2() {
        const transitionZone = document.getElementById("transition-zone2");
        const playerRect = player.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const shrinkFactorX = 10;
        const shrinkFactorY = 5;
        const shrinkedTransitionRect = {
            top: transitionRect.top + shrinkFactorY,
            right: transitionRect.right - shrinkFactorX,
            bottom: transitionRect.bottom + shrinkFactorY,
            left: transitionRect.right - shrinkFactorX
        };

        if (
            playerRect.bottom > shrinkedTransitionRect.top &&
            playerRect.right > shrinkedTransitionRect.left &&
            playerRect.top < shrinkedTransitionRect.bottom
        ) {
            window.location.href = "../M4/map4.html";
        }
    }

    function checkInteraction3() {
        const transitionZone = document.getElementById("transition-zone3");
        const playerRect = player.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const shrinkFactorX = 10;
        const shrinkFactorY = 10;
        const shrinkedTransitionRect = {
            top: transitionRect.bottom - shrinkFactorY,
            right: transitionRect.right - shrinkFactorX,
            bottom: transitionRect.top - shrinkFactorY,
            left: transitionRect.left + shrinkFactorX
        };

        if (
            playerRect.left < shrinkedTransitionRect.right &&
            playerRect.right > shrinkedTransitionRect.left &&
            playerRect.bottom > shrinkedTransitionRect.top
        ) {
            window.location.href = "../M5/map5.html";
        }
    }

    function checkInteraction4() {
        const transitionZone = document.getElementById("transition-zone4");
        const playerRect = player.getBoundingClientRect();
        const transitionRect = transitionZone.getBoundingClientRect();

        const shrinkFactorX = 25;
        const shrinkFactorY = 5;
        const shrinkedTransitionRect = {
            top: transitionRect.top + shrinkFactorY,
            right: transitionRect.right - shrinkFactorX,
            bottom: transitionRect.bottom + shrinkFactorY,
            left: transitionRect.right - shrinkFactorX
        };

        if (
            playerRect.bottom > shrinkedTransitionRect.top &&
            playerRect.left < shrinkedTransitionRect.right &&
            playerRect.top < shrinkedTransitionRect.bottom
        ) {
            window.location.href = "../M2/map2.html?from=map3";
        }
    }

    function createCloudAnimation(cloud, duration, initialDelay) {
        const randomY = Math.floor(Math.random() * (gameContainer.offsetHeight - cloud.offsetHeight));
        cloud.style.top = `${randomY}px`;
        cloud.style.left = '-200px'; // 初始位置在畫布外
        setTimeout(() => {
            cloud.style.animation = `moveCloud ${duration}s linear infinite`; // 設置動畫
        }, initialDelay); // 初次出現的延遲
    }

    const clouds = document.querySelectorAll('.cloud');
    const durations = [33, 52, 71]; // 不同的動畫持續時間，單位為秒
    const initialDelays = [0, 10000, 20000]; // 每朵雲初次出現的延遲，單位為毫秒

    clouds.forEach((cloud, index) => {
        const duration = durations[index % durations.length];
        const initialDelay = initialDelays[index % initialDelays.length];
        createCloudAnimation(cloud, duration, initialDelay);
        cloud.addEventListener('animationiteration', () => createCloudAnimation(cloud, duration, 0));
    });
});
