document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enter-button');
    const backgroundVideo = document.getElementById('background-video'); 
    const backgroundMusic = document.getElementById('background-music'); 
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // Başlangıçta ana içeriği gizle
    mainContent.classList.add('hidden'); 

    // MÜZİĞİ VE VİDEOYU SESSİZ BAŞLATMAYA ÇALIŞ
    function attemptSilentPlay() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0;
            backgroundMusic.muted = true;
            backgroundMusic.play().catch(e => console.log("Music play pending user interaction: " + e.message));
        }
        if (backgroundVideo) {
            backgroundVideo.volume = 0;
            backgroundVideo.muted = true;
            backgroundVideo.play().catch(e => console.log("Video play pending user interaction: " + e.message));
        }
    }

    // Sayfa yüklenir yüklenmez sessiz başlatmayı dene
    attemptSilentPlay();


    // "ENTER SITE" butonuna tıklanınca - Sesi Açma Garantisi
    enterButton.addEventListener('click', () => {
        
        // 1. Müziğin Sesini Aç ve oynatmayı zorla
        if (backgroundMusic) {
            backgroundMusic.volume = 1;
            backgroundMusic.muted = false; 
            backgroundMusic.play(); 
        }

        // 2. Arka Plan Videonun Sesini Aç
        if (backgroundVideo) {
            backgroundVideo.volume = 1;
            backgroundVideo.muted = false;
        }

        // 3. Giriş ekranını yavaşça gizle
        loadingScreen.classList.add('hidden');
            
        // 4. Ana içeriği göster
        setTimeout(() => {
            loadingScreen.style.display = 'none'; 
            mainContent.classList.remove('hidden'); 
        }, 700); 
    }, { once: true });
});