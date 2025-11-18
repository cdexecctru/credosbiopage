// =======================================================
// ADMİN PANELİ VE ANALİZ SCRIPTİ
// Her sayfa yenilemesinde şifre sorar.
// =======================================================

const STATIC_PASSWORD = 'Emir9163cd!'; // ❗ ADMİN ŞİFRENİZ ❗
const GEO_API_URL = 'https://ipapi.co/json/'; 
const RECORD_KEY = 'credos_visitor_records';

// =======================================================
// ANALİZ FONKSİYONLARI
// =======================================================

/**
 * Coğrafi Konum bilgisini API'den çeker.
 * @returns {Promise<object>} Şehir, ülke, IP ve tarayıcı bilgisi.
 */
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

/**
 * Ziyaretçi verisini LocalStorage'a kaydeder.
 */
function recordVisitorEvent(event_name, event_type = "PageView") {
    getVisitorInfo().then(info => {
        const timestamp = new Date().toLocaleString('tr-TR');
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

/**
 * LocalStorage'daki verileri Admin panelinde listeler.
 */
function displayRecords() {
    const records = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
    const listContainer = document.getElementById('visitor-list');
    const totalRecordsSpan = document.getElementById('total-records');
    
    if (!listContainer || !totalRecordsSpan) return;

    listContainer.innerHTML = '';
    totalRecordsSpan.textContent = records.length;

    // Kayıtları tersten (en yeniyi en üste) listele
    records.reverse().forEach(record => {
        const div = document.createElement('div');
        div.className = 'visitor-record';
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

/**
 * Giriş işlemini kontrol eder.
 */
function handleLogin() {
    const passwordInput = document.getElementById('admin-password');
    const loginMessage = document.getElementById('login-message');
    
    if (passwordInput.value === STATIC_PASSWORD) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('analytics-section').classList.remove('hidden');
        // localStorage.setItem('admin_logged_in', 'true'); // ❌ Oturum kaydı kaldırıldı
        displayRecords();
    } else {
        loginMessage.textContent = 'Hatalı Şifre!';
        passwordInput.value = '';
    }
}

/**
 * Kayıtları siler ve ekranı günceller.
 */
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

    // Ses ve video başlatma
    function attemptSilentPlay() {
        if (backgroundMusic) { backgroundMusic.volume = 0; backgroundMusic.muted = true; backgroundMusic.play().catch(e => {}); }
        if (backgroundVideo) { backgroundVideo.volume = 0; backgroundVideo.muted = true; backgroundVideo.play().catch(e => {}); }
    }
    attemptSilentPlay();

    // 1. ZİYARETÇİ ANALİZ KAYDI (index.html, project1.html'de çalışır)
    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'project1.html') {
        recordVisitorEvent("SAYFA YÜKLENDİ", "PageView");
    }

    // 2. GİRİŞ VE İNDİRME İŞLEMLERİ
    if (enterButton) { // index.html veya project1.html sayfasında ise
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
    
    if (downloadButton) { // project1.html sayfasında ise
        downloadButton.addEventListener('click', () => {
            recordVisitorEvent("DOSYA İNDİRİM BAŞLATILDI", "Click");
        });
    }

    // 3. ADMİN SAYFASI İŞLEMLERİ (admin.html'de çalışır)
    if (currentPage === 'admin.html') {
        const loginButton = document.getElementById('login-button');
        const clearButton = document.getElementById('clear-data-button');

        // ❌ Oturum Kontrolü Kaldırıldı: Sayfa yüklendiğinde daima giriş ekranını göster
        
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
            // Enter tuşu ile giriş
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