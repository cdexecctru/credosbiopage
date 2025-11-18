// Sunucusuz Fonksiyon: check-password.js
// Projenizdeki netlify/functions klasörüne kaydedin.
// Bu kod Netlify'da çalışır ve şifreyi Ortam Değişkeni'nden alır.

exports.handler = async (event) => {
    // Netlify Ayarlarında (SHIELD_PASSWORD) saklanan gizli şifreyi al
    const CORRECT_PASSWORD = process.env.SHIELD_PASSWORD; 

    // Sadece POST isteklerini kabul et (Güvenlik için)
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) 
        };
    }
    
    try {
        // İstemciden (script.js) gelen şifreyi al
        const body = JSON.parse(event.body);
        const enteredPassword = body.password;

        // Şifreleri karşılaştır
        if (enteredPassword === CORRECT_PASSWORD) {
            return {
                statusCode: 200, // Başarılı yanıt
                body: JSON.stringify({ success: true })
            };
        } else {
            return {
                statusCode: 200, // Başarısız olsa da 200 dönmek daha güvenlidir
                body: JSON.stringify({ success: false })
            };
        }
    } catch (e) {
        // JSON ayrıştırma hatası veya diğer sunucu hataları
        return { 
            statusCode: 500, 
            body: JSON.stringify({ success: false, error: 'Sunucu Hatası' }) 
        };
    }
};