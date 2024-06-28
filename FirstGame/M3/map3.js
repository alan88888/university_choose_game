document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");

    // 检查URL参数，获取玩家坐标
    const urlParams = new URLSearchParams(window.location.search);
    let playerX = parseFloat(urlParams.get('playerX')) || initialPlayerX;
    let playerY = parseFloat(urlParams.get('playerY')) || initialPlayerY;

    player.style.top = playerY + "px";
    player.style.left = playerX + "px";

    // 更新玩家位置
    function updatePlayerPosition() {
        localStorage.setItem("playerX", playerX);
        localStorage.setItem("playerY", playerY);
    }

    // 玩家移动事件
    document.addEventListener("keydown", function(event) {
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
        checkInteraction1();
        checkInteraction2();
        checkInteraction3();
        checkInteraction4();
    });

    // 打开背包按钮的点击事件
    const openBagButton = document.getElementById("open-bag-button");
    openBagButton.addEventListener("click", function() {
        // 保存玩家位置
        const currentTop = parseFloat(player.style.top);
        const currentLeft = parseFloat(player.style.left);

        window.location.href = `../Bag/bag.html?from=map3&playerX=${currentLeft}&playerY=${currentTop}`;
    });
});

function checkInteraction1() {
    const transitionZone = document.getElementById("transition-zone1");
    const playerRect = player.getBoundingClientRect();
    const transitionRect = transitionZone.getBoundingClientRect();

    // 将transition-zone的边界收缩到100*10的区域
    const shrinkFactorX = 10; // X轴边界收缩因子
    const shrinkFactorY = 5; // Y轴边界收缩因子
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
        // 如果角色接触到了过渡区域，重定向到另一个HTML页面
        window.location.href = "../M6/map6.html?from=map3";
    }
}

function checkInteraction2() {
    const transitionZone = document.getElementById("transition-zone2");
    const playerRect = player.getBoundingClientRect();
    const transitionRect = transitionZone.getBoundingClientRect();

    // 将transition-zone的边界收缩到100*10的区域
    const shrinkFactorX = 10; // X轴边界收缩因子
    const shrinkFactorY = 5; // Y轴边界收缩因子
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
        // 如果角色接触到了过渡区域，重定向到另一个HTML页面
        window.location.href = "../M4/map4.html";
    }
}

function checkInteraction3() {
    const transitionZone = document.getElementById("transition-zone3");
    const playerRect = player.getBoundingClientRect();
    const transitionRect = transitionZone.getBoundingClientRect();

    // 将transition-zone的边界收缩到100*10的区域
    const shrinkFactorX = 10; // X轴边界收缩因子
    const shrinkFactorY = 10; // Y轴边界收缩因子
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
        // 如果角色接触到了过渡区域，重定向到另一个HTML页面
        window.location.href = "../M5/map5.html";
    }
}

function checkInteraction4() {
    const transitionZone = document.getElementById("transition-zone4");
    const playerRect = player.getBoundingClientRect();
    const transitionRect = transitionZone.getBoundingClientRect();

    // 将transition-zone的边界收缩到100*10的区域
    const shrinkFactorX = 25; // X轴边界收缩因子
    const shrinkFactorY = 5; // Y轴边界收缩因子
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
        // 如果角色接触到了过渡区域，重定向到另一个HTML页面
        window.location.href = "../M2/map2.html?from=map3";
    }
}