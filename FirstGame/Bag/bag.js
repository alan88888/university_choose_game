document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromMap = urlParams.get('from') || "map3";
    const playerX = urlParams.get('playerX');
    const playerY = urlParams.get('playerY');

    const inventorySlots = document.querySelectorAll('.item-slot');
    const equipSlots = document.querySelectorAll('.equip-slot');
    const equippedItemSlot = document.getElementById('equipped-item');
    
    let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from(inventorySlots).map(() => null);
    if (inventory.length < 20) {
        inventory = inventory.concat(Array(20 - inventory.length).fill(null)); // 確保inventory包含20個格子
    }

    let equippedItem = JSON.parse(localStorage.getItem('equippedItem')) || null;
    let equipInventory = JSON.parse(localStorage.getItem('equipInventory')) || Array.from(equipSlots).map(() => null);
    if (equipInventory.length < 10) {
        equipInventory = equipInventory.concat(Array(10 - equipInventory.length).fill(null)); // 確保equipInventory包含10個格子
    }

    function goBack() {
        const mapFolderMapping = {
            "map2": "../M2/map2.html",
            "map3": "../M3/map3.html",
            "map4": "../M4/map4.html",
            "map5": "../M5/map5.html",
            "map6": "../M6/map6.html",
            "map7": "../M7/map7.html"
        };

        const mapPath = mapFolderMapping[fromMap] || "../M3/map3.html";
        window.location.href = `${mapPath}?playerX=${playerX}&playerY=${playerY}`;
    }

    document.getElementById('back-button').addEventListener('click', goBack);
    document.getElementById('clear-button').addEventListener('click', clearInventoryAndResetStats);

    function clearInventoryAndResetStats() {
        inventory = Array.from(inventorySlots).map(() => null);
        equipInventory = Array.from(equipSlots).map(() => null);
        equippedItem = null;
        playerStats = {
            healthCurrent: 10,
            healthMax: 100,
            manaCurrent: 10,
            manaMax: 50,
            attackCurrent: 20,
            attackMax: 999,
            baseDefense: 15,
            defenseCurrent: 15,
            defenseMax: 999,
            luckCurrent: 10,
            luckMax: 100
        };
        updateInventoryDisplay();
        updateEquipInventoryDisplay();
        updateEquippedItemDisplay();
        updatePlayerStatsDisplay();
        updateSkillsDisplay();
        updateDefense();
        saveState();
    }

    let playerStats = JSON.parse(localStorage.getItem('playerStats')) || {
        healthCurrent: 50,
        healthMax: 100,
        manaCurrent: 30,
        manaMax: 50,
        attackCurrent: 20,
        attackMax: 999,
        defenseCurrent: 15,
        defenseMax: 999,
        luckCurrent: 10,
        luckMax: 100
    };
    
    function updatePlayerStatsDisplay() {
        document.getElementById('health-current').textContent = playerStats.healthCurrent;
        document.getElementById('health-max').textContent = playerStats.healthMax;
        document.getElementById('mana-current').textContent = playerStats.manaCurrent;
        document.getElementById('mana-max').textContent = playerStats.manaMax;
        document.getElementById('attack-current').textContent = playerStats.attackCurrent;
        document.getElementById('defense-current').textContent = playerStats.defenseCurrent;
        document.getElementById('luck-current').textContent = playerStats.luckCurrent;
    }
    
    function addItemToInventory(item) {
        for (let i = 0; i < inventory.length; i++) {
            if (!inventory[i]) {
                inventory[i] = { ...item, quantity: 1 };
                updateInventoryDisplay();
                saveState();
                return;
            } else if (inventory[i].name === item.name) {
                inventory[i].quantity += 1;
                updateInventoryDisplay();
                saveState();
                return;
            }
        }
        alert('背包已滿！');
    }

    function addEquipItemToInventory(item) {
        for (let i = 0; i < equipInventory.length; i++) {
            if (!equipInventory[i]) {
                equipInventory[i] = { ...item, quantity: 1 };
                updateEquipInventoryDisplay();
                saveState();
                return;
            }
        }
        alert('裝備儲存格已滿！');
    }

    function useItem(slotIndex) {
        const item = inventory[slotIndex];
        if (item && item.name !== "釣竿") {
            if (item.type === 'potion' || item.type === 'fish') {
                playerStats.healthCurrent = Math.min(playerStats.healthMax, playerStats.healthCurrent + item.effect.health);
                playerStats.manaCurrent = Math.min(playerStats.manaMax, playerStats.manaCurrent + item.effect.mana);
            } else if (item.type === 'dung') {
                playerStats.healthCurrent = Math.max(0, playerStats.healthCurrent - 5);
                playerStats.manaCurrent = Math.max(0, playerStats.manaCurrent - 2);
            }

            playerStats.healthCurrent = Math.max(0, Math.min(playerStats.healthCurrent, playerStats.healthMax));
            playerStats.manaCurrent = Math.max(0, Math.min(playerStats.manaCurrent, playerStats.manaMax));

            if (item.quantity > 1) {
                inventory[slotIndex].quantity -= 1;
            } else {
                inventory[slotIndex] = null;
            }

            updateInventoryDisplay();
            updatePlayerStatsDisplay();
            saveState();
        } else if (item && item.name === "釣竿") {
            alert('這個道具無法使用');
        }

        // 確保裝備顯示正確
        updateEquippedItemDisplay();
        updateSkillsDisplay();
    }

    function equipItem(slotIndex) {
        const item = equipInventory[slotIndex];
        if (item) {
            if (equippedItem) {
                addEquipItemToInventory(equippedItem);
            }
            equippedItem = item;
            equipInventory[slotIndex] = null;
            updateEquipInventoryDisplay();
            updateEquippedItemDisplay();
            updateSkillsDisplay();
            updateDefense(); // 更新防禦值
            saveState();
        }
    }
    
    function unequipItem() {
        if (equippedItem) {
            addEquipItemToInventory(equippedItem);
            equippedItem = null;
            updateEquippedItemDisplay();
            updateSkillsDisplay();
            updateDefense(); // 更新防禦值
            saveState();
        }
    }
    

    function updateInventoryDisplay() {
        inventorySlots.forEach((slot, index) => {
            slot.innerHTML = '';
            if (inventory[index]) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                const itemContent = `<img src="${inventory[index].image}" alt="${inventory[index].name}">`;
                if (inventory[index].name !== "釣竿") {
                    itemElement.innerHTML = `${itemContent}<span>${inventory[index].quantity}</span>`;
                    itemElement.addEventListener('click', () => {
                        useItem(index);
                        hideItemDescription();
                    });
                } else {
                    itemElement.innerHTML = itemContent;
                    itemElement.addEventListener('click', () => {
                        alert('這個道具無法被直接使用');
                    });
                }
                itemElement.addEventListener('mouseover', () => showItemDescription(index));
                itemElement.addEventListener('mouseout', hideItemDescription);
                slot.appendChild(itemElement);
            }
        });
    }

    function updateEquipInventoryDisplay() {
        equipSlots.forEach((slot, index) => {
            slot.innerHTML = '';
            if (equipInventory[index]) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                const itemContent = `<img src="${equipInventory[index].image}" alt="${equipInventory[index].name}">`;
                itemElement.innerHTML = itemContent;
                itemElement.addEventListener('click', () => {
                    equipItem(index);
                    hideItemDescription();
                });
                itemElement.addEventListener('mouseover', () => showEquipItemDescription(index));
                itemElement.addEventListener('mouseout', hideItemDescription);
                slot.appendChild(itemElement);
            }
        });
    }

    function updateEquippedItemDisplay() {
        equippedItemSlot.innerHTML = '';
        if (equippedItem) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            const itemContent = `<img src="${equippedItem.image}" alt="${equippedItem.name}" style="width: 100px; height: 100px;">`; // 增加裝備圖片大小
            itemElement.innerHTML = itemContent;
            itemElement.addEventListener('click', () => {
                unequipItem();
                hideItemDescription();
            });
            itemElement.addEventListener('mouseover', showEquippedItemDescription);
            itemElement.addEventListener('mouseout', hideItemDescription);
            equippedItemSlot.appendChild(itemElement);
        }
    }

    function showItemDescription(index) {
        hideItemDescription(); // 先隱藏任何現有的描述框
        const item = inventory[index];
        if (item) {
            const descriptionBox = document.createElement('div');
            descriptionBox.id = 'item-description';
            descriptionBox.innerHTML = `<span class="item-name">${item.name}</span><br>描述:<br>${item.description}`;
            document.body.appendChild(descriptionBox);

            document.addEventListener('mousemove', moveDescriptionBox);
        }
    }

    function showEquipItemDescription(index) {
        hideItemDescription(); // 先隱藏任何現有的描述框
        const item = equipInventory[index];
        if (item) {
            const descriptionBox = document.createElement('div');
            descriptionBox.id = 'item-description';
            descriptionBox.innerHTML = `<span class="item-name">${item.name}</span><br>描述:<br>${item.description}`;
            document.body.appendChild(descriptionBox);

            document.addEventListener('mousemove', moveDescriptionBox);
        }
    }

    function showEquippedItemDescription() {
        hideItemDescription(); // 先隱藏任何現有的描述框
        if (equippedItem) {
            const descriptionBox = document.createElement('div');
            descriptionBox.id = 'item-description';
            descriptionBox.innerHTML = `<span class="item-name">${equippedItem.name}</span><br>描述:<br>${equippedItem.description}`;
            document.body.appendChild(descriptionBox);

            document.addEventListener('mousemove', moveDescriptionBox);

            // 設置描述框的初始位置
            descriptionBox.style.left = `${event.pageX + 10}px`;
            descriptionBox.style.top = `${event.pageY + 10}px`;
        }
    }

    function showSkillDescription(skillName, skillDescription) {
        hideItemDescription(); // 先隱藏任何現有的描述框
        if (skillDescription) {
            const descriptionBox = document.createElement('div');
            descriptionBox.id = 'item-description';
            descriptionBox.innerHTML = `<span class="item-name">${skillName}</span><br>描述:<br>${skillDescription}`;
            document.body.appendChild(descriptionBox);

            document.addEventListener('mousemove', moveDescriptionBox);

            // 設置描述框的初始位置
            descriptionBox.style.left = `${event.pageX + 10}px`;
            descriptionBox.style.top = `${event.pageY + 10}px`;
        }
    }

    function hideItemDescription() {
        const descriptionBox = document.getElementById('item-description');
        if (descriptionBox) {
            document.body.removeChild(descriptionBox);
            document.removeEventListener('mousemove', moveDescriptionBox);
        }
    }

    function moveDescriptionBox(event) {
        const descriptionBox = document.getElementById('item-description');
        if (descriptionBox) {
            descriptionBox.style.left = `${event.pageX + 10}px`;
            descriptionBox.style.top = `${event.pageY + 10}px`;
        }
    }

    function updateSkillsDisplay() {
        document.getElementById('normal-attack').textContent = '普通攻擊';
        if (equippedItem) {
            const specialAttackElement = document.getElementById('special-attack');
            specialAttackElement.textContent = equippedItem.specialAttack || '無';
            specialAttackElement.addEventListener('mouseover', () => showSkillDescription(equippedItem.specialAttack, equippedItem.specialAttackDescription));
            specialAttackElement.addEventListener('mouseout', hideItemDescription);

            const friendshipSkillElement = document.getElementById('friendship-skill');
            friendshipSkillElement.textContent = equippedItem.friendshipSkill || '無';
            friendshipSkillElement.addEventListener('mouseover', () => showSkillDescription(equippedItem.friendshipSkill, equippedItem.friendshipSkillDescription));
            friendshipSkillElement.addEventListener('mouseout', hideItemDescription);

            const passiveSkillElement = document.getElementById('passive-skill');
            passiveSkillElement.textContent = equippedItem.passiveSkill || '無';
            passiveSkillElement.addEventListener('mouseover', () => showSkillDescription(equippedItem.passiveSkill, equippedItem.passiveSkillDescription));
            passiveSkillElement.addEventListener('mouseout', hideItemDescription);
        } else {
            document.getElementById('special-attack').textContent = '無';
            document.getElementById('friendship-skill').textContent = '無';
            document.getElementById('passive-skill').textContent = '無';
        }
    }

    function updateDefense() {
        if (equippedItem && equippedItem.name === "騎士勳章") {
            playerStats.defenseCurrent = playerStats.baseDefense + 20;
        } else {
            playerStats.defenseCurrent = playerStats.baseDefense;
        }
        document.getElementById('defense-current').textContent = playerStats.defenseCurrent;
    }
    

    function saveState() {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('equipInventory', JSON.stringify(equipInventory));
        localStorage.setItem('equippedItem', JSON.stringify(equippedItem));
        localStorage.setItem('playerStats', JSON.stringify(playerStats)); // 確保運氣屬性被保存
    }

    function wrapText(text, maxLineLength) {
        const words = text.split(' ');
        let wrappedText = '';
        let line = '';
    
        words.forEach((word) => {
            if ((line + word).length > maxLineLength) {
                wrappedText += line + '\n';
                line = '';
            }
            line += word + ' ';
        });
    
        return wrappedText + line.trim();
    }
    

    updateInventoryDisplay();
    updateEquipInventoryDisplay();
    updateEquippedItemDisplay();
    updatePlayerStatsDisplay(); // 確保在頁面加載時更新顯示
    updateSkillsDisplay();
    updateDefense(); 
});
