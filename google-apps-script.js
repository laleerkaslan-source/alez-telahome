/**
 * TELA HOME - Sipariş Yönetim Scripti
 * =====================================
 * Bu kodu Google Sheets > Uzantılar > Apps Script'e yapıştırın.
 *
 * KURULUM:
 * 1. Google Drive'da "Tela Home Siparisler" adında yeni bir Google Sheet oluşturun
 * 2. İlk satıra şu başlıkları yazın:
 *    Tarih | Ad | Soyad | Telefon | Adres | E-posta | Ürün | Ebat | Adet | Fiyat | Kampanya Onay | Durum
 * 3. Uzantılar > Apps Script'e tıklayın
 * 4. Bu kodu yapıştırın ve kaydedin
 * 5. Dağıt > Yeni dağıtım > Web uygulaması seçin
 *    - Şu kullanıcı olarak çalıştır: Ben
 *    - Erişimi olan kişiler: Herkes
 * 6. URL'yi kopyalayın ve index.html'deki APPS_SCRIPT_URL değişkenine yapıştırın
 */

var ADMIN_PASSWORD = 'telahome2026'; // Admin panel şifresi - değiştirin!

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var now = new Date();
    var tarih = Utilities.formatDate(now, 'Europe/Istanbul', 'dd.MM.yyyy HH:mm');

    sheet.appendRow([
      tarih,
      data.ad || '',
      data.soyad || '',
      data.telefon || '',
      data.adres || '',
      data.eposta || '',
      data.urun || 'Sıvı Geçirmez Alez',
      data.ebat || '',
      data.adet || 1,
      data.fiyat || 0,
      data.kampanya ? 'Evet' : 'Hayır',
      'Yeni'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var params = e.parameter;

  // Şifre kontrolü
  if (params.password !== ADMIN_PASSWORD) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Yetkisiz erişim' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var orders = [];

    for (var i = 1; i < data.length; i++) {
      var order = {};
      for (var j = 0; j < headers.length; j++) {
        order[headers[j]] = data[i][j];
      }
      orders.push(order);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, orders: orders }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
