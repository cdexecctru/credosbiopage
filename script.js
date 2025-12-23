// music.credos.qzz.io - Koruma Scripti

// Sağ Tık Engelleme
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, false);

// Klavye Kısayolları Engelleme (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
document.addEventListener('keydown', function(e) {
    if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || 
        (e.ctrlKey && e.key === "u")
    ) {
        e.preventDefault();
        return false;
    }
}, false);

console.log("Credos Security Active.");