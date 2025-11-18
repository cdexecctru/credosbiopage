// =======================================================
// ADMİN PANELİ VE ANALİZ SCRIPTİ (ŞİFRESİZ VE GÜNCEL)
// Şifre kontrolü ve login işlemleri kaldırılmıştır.
// =======================================================

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

function displayRecords() {
    const records = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
    const listContainer = document.getElementById('visitor-list');
    const totalRecordsSpan = document.getElementById('total-records');
    
    if (!listContainer || !totalRecordsSpan) return;

    listContainer.innerHTML = '';
    totalRecordsSpan.textContent = records.length;

    records.reverse().forEach(record => {
        const div = document.createElement('div');
        div.className = 'visitor-record neon-text'; // Neon metin sınıfı kullanılır
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
    const downloadButton = document.querySelector('.download-link'); // Index'teki proje linki

    // Sayfa yüklendiğinde sessiz oynatma denemesi
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
    if (enterButton) { // index.html'de ENTER butonu varsa
        enterButton.addEventListener('click', () => {
            // Sesi ve videoyu aç
            if (backgroundMusic) { backgroundMusic.volume = 1; backgroundMusic.muted = false; backgroundMusic.play(); }
            if (backgroundVideo) { backgroundVideo.volume = 1; backgroundVideo.muted = false; }
            
            // Ekran geçişi
            loadingScreen.classList.remove('active');
             setTimeout(() => {
                loadingScreen.style.display = 'none'; 
                mainContent.classList.remove('hidden'); 
            }, 700); 
            
            recordVisitorEvent("ENTER Butonuna Tıklandı", "Click");
        }, { once: true });
    }
    
    if (downloadButton && currentPage === 'index.html') { // index.html'deki Project linkine tıklama
        downloadButton.addEventListener('click', () => {
            recordVisitorEvent("PROJECT1'e Geçiş Tıklandı", "Click");
        });
    }

    // 3. ADMİN SAYFASI İŞLEMLERİ
    if (currentPage === 'admin.html') {
        // Şifre kontrolü kaldırıldığı için, sayfa yüklendiğinde kayıtları hemen göster
        displayRecords();
        
        const clearButton = document.getElementById('clear-data-button');
        if (clearButton) {
            clearButton.addEventListener('click', handleClearData);
        }
    }
});