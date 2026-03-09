document.addEventListener('DOMContentLoaded', (event) => {
    const loadingManager = {
        assetCounter: 0,
        totalAssets: 523, // Update this number based on the actual total assets being loaded + 1
        progressBar: document.getElementById('progress-bar'),
        loadingScreen: document.getElementById('loading-screen'),
        gameRoot: document.getElementById('game-root'),

        assetLoaded: function() {
            this.assetCounter++;
            const progress = (this.assetCounter / this.totalAssets) * 100;
            if (this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }

            if (this.assetCounter === this.totalAssets) {
                if (this.loadingScreen) {
                    this.loadingScreen.style.display = 'none';
                }
                if (this.gameRoot) {
                    this.gameRoot.style.display = 'block';
                }
                setCameraOverlay(true);
                menu = "main";
            }
        }
    };

    // Make assetLoaded globally accessible for p5.js callbacks
    window.assetLoaded = function() {
        loadingManager.assetLoaded();
    };
});
