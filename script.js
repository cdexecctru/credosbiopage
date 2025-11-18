// =======================================================
// ADMİN PANELİ VE ANALİZ SCRIPTİ (GÜVENSİZ VE OTURUMSUZ)
// Şifre kontrolü doğrudan JavaScript içinde yapılır.
// =======================================================

const STATIC_PASSWORD = 'Emir9163cd!'; 

const GEO_API_URL = 'https://ipapi.co/json/'; 
const RECORD_KEY = 'credos_visitor_records';

// =======================================================
// ANALİZ FONKSİYONLARI 
// =======================================================

async function getVisitorInfo() {
    try {
        const response = await fetch(GEO_API_URL);
        const data = await response.json();
        
        return {
            city: data.city || 'Bilinmiyor',
            country: data.country_name || 'Bilinmiyor',
            ip_api: data.ip || 'Erişim Engellendi', 
            userAgent: navigator.userAgent
        };
    } catch (error) {
        return { city: 'Hata', country: 'Hata', ip_api: 'Hata', userAgent: navigator.userAgent };
    }
}

function recordVisitorEvent(event_name, event_type = "PageView") {
    getVisitorInfo().then(info => {
        const timestamp = new Date().toLocaleString('tr-TR'); // Türkçe zaman formatı
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const newRecord = {
            id: Date.now(),
            time: timestamp,
            event: event_name,
            type: event_type,
            page: currentPage,
            geo: `${info.city}, ${info.country}`,
            ip_address: info.ip_api, 
            browser: info.userAgent.substring(0, 150)
        };

        const records = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
        records.push(newRecord);
        localStorage.setItem(RECORD_KEY, JSON.stringify(records));
    });
}

// =======================================================
// ADMİN PANELİ FONKSİYONLARI 
// =======================================================

function displayRecords() {
    const records = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
    const listContainer = document.getElementById('visitor-list');
    const totalRecordsSpan = document.getElementById('total-records');
    
    if (!listContainer || !totalRecordsSpan) return;

    listContainer.innerHTML = '';
    totalRecordsSpan.textContent = records.length;

    records.reverse().forEach(record => {
        const div = document.createElement('div');
        div.className = 'visitor-record glow-text'; 
        div.innerHTML = `
            <p><strong>Zaman:</strong> ${record.time}</p>
            <p><strong>Olay:</strong> ${record.event} (${record.type})</p>
            <p><strong>Sayfa:</strong> ${record.page}</p>
            <p><strong>Konum:</strong> ${record.geo}</p>
            <p><strong>IP Adresi:</strong> ${record.ip_address || 'Kayıt Yok'}</p>
            <p><strong>Tarayıcı:</strong> ${record.browser}...</p>
        `;
        listContainer.appendChild(div);
    });
}

function handleLogin() {
    const passwordInput = document.getElementById('admin-password');
    const loginMessage = document.getElementById('login-message');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === STATIC_PASSWORD) {
        // Şifre doğruysa
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('analytics-section').classList.remove('hidden');
        displayRecords();
        loginMessage.textContent = 'Giriş Başarılı!';
    } else {
        // Şifre yanlışsa
        loginMessage.textContent = 'Hatalı Şifre!';
        passwordInput.value = '';
    }
}

function handleClearData() {
    if (confirm("Tüm ziyaretçi kayıtlarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        localStorage.removeItem(RECORD_KEY);
        displayRecords();
        alert("Kayıtlar temizlendi!");
    }
}

// =======================================================
// ANA DOM İŞLEYİCİ
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const enterButton = document.getElementById('enter-button');
    
    // MÜZİK VE VİDEO İŞLEMLERİ
    const backgroundVideo = document.getElementById('background-video'); 
    const backgroundMusic = document.getElementById('background-music'); 
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const downloadButton = document.querySelector('.glow-download-button'); 

    function attemptSilentPlay() {
        if (backgroundMusic) { backgroundMusic.volume = 0; backgroundMusic.muted = true; backgroundMusic.play().catch(e => {}); }
        if (backgroundVideo) { backgroundVideo.volume = 0; backgroundVideo.muted = true; backgroundVideo.play().catch(e => {}); }
    }
    attemptSilentPlay();

    // 1. ZİYARETÇİ ANALİZ KAYDI
    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'project1.html') {
        recordVisitorEvent("SAYFA YÜKLENDİ", "PageView");
    }

    // 2. GİRİŞ VE İNDİRME İŞLEMLERİ
    if (enterButton) { 
        enterButton.addEventListener('click', () => {
            if (backgroundMusic) { backgroundMusic.volume = 1; backgroundMusic.muted = false; backgroundMusic.play(); }
            if (backgroundVideo) { backgroundVideo.volume = 1; backgroundVideo.muted = false; }
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none'; 
                mainContent.classList.remove('hidden'); 
            }, 700); 
            recordVisitorEvent("ENTER Butonuna Tıklandı", "Click");
        }, { once: true });
    }
    
    if (downloadButton) { 
        downloadButton.addEventListener('click', () => {
            recordVisitorEvent("DOSYA İNDİRİM BAŞLATILDI", "Click");
        });
    }

    // 3. ADMİN SAYFASI İŞLEMLERİ
    if (currentPage === 'admin.html') {
        const loginButton = document.getElementById('login-button');
        const clearButton = document.getElementById('clear-data-button');
        
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
            document.getElementById('admin-password').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
        if (clearButton) {
            clearButton.addEventListener('click', handleClearData);
        }
    }
});