document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromMap = urlParams.get('from') || "map3";
    const playerX = urlParams.get('playerX');
    const playerY = urlParams.get('playerY');

    const inventorySlots = document.querySelectorAll('.item-slot');
    let inventory = JSON.parse(localStorage.getItem('inventory')) || Array.from(inventorySlots).map(() => null);
    let playerStats = JSON.parse(localStorage.getItem('playerStats')) || {
        healthCurrent: 50,
        healthMax: 100,
        attack: 20,
        defense: 15,
        manaCurrent: 30,
        manaMax: 50
    };

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

    function useItem(slotIndex) {
        const item = inventory[slotIndex];
        if (item) {
            if (item.type === 'potion') {
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
        }
    }

    function updateInventoryDisplay() {
        inventorySlots.forEach((slot, index) => {
            slot.innerHTML = '';
            if (inventory[index]) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');
                itemElement.innerHTML = `<img src="${inventory[index].image}" alt="${inventory[index].name}"><span>${inventory[index].quantity}</span>`;
                itemElement.addEventListener('click', () => {
                    useItem(index);
                    hideItemDescription(); // Hide description when item is used
                });
                itemElement.addEventListener('mouseover', () => showItemDescription(index));
                itemElement.addEventListener('mouseout', hideItemDescription);
                slot.appendChild(itemElement);
            }
        });
    }

    function showItemDescription(index) {
        const item = inventory[index];
        if (item) {
            const descriptionBox = document.createElement('div');
            descriptionBox.id = 'item-description';
            descriptionBox.innerText = `${item.description}`;
            document.body.appendChild(descriptionBox);

            document.addEventListener('mousemove', moveDescriptionBox);
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

    function updatePlayerStatsDisplay() {
        document.getElementById('health-current').textContent = playerStats.healthCurrent;
        document.getElementById('health-max').textContent = playerStats.healthMax;
        document.getElementById('attack').textContent = playerStats.attack;
        document.getElementById('defense').textContent = playerStats.defense;
        document.getElementById('mana-current').textContent = playerStats.manaCurrent;
        document.getElementById('mana-max').textContent = playerStats.manaMax;
    }

    function saveState() {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('playerStats', JSON.stringify(playerStats));
    }

    updateInventoryDisplay();
    updatePlayerStatsDisplay();
});
