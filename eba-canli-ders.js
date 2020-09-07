/*
EBA canlı dersleri Zoom kullanıyor.
Bağlantı için kendi uygulamalarını kullanıyorlar, fakat Linux, Mac, Pardus vs. için destekleri yok.
Çok basit bir şekilde Zoom uygulamasını başlatmak yerine kendi logoları olan Zoom uygulamalarına yönlendirip,
ordan Zoom'u başlatıyorlar. Bunun yerine id ve token'i alıp direk Zoom'u başlatan bir script yazdım
ki Linux ve Mac kullanıcıları da bundan yararlanabilsin.
1- Zoom uygulamasını cihazınıza kurun.
2- https://ders.eba.gov.tr/ders/ adresine gidin, gerekli girişleri yapın, Canlı Dersler sayfasına gelin
3- F12 tuşuna basın, Console sekmesine geçin
4- Bu kodu kopyalayıp yapıştırın, enter'a basın. (Firefox'da kopyala yapıştır uyarısı verebilir, gerekenleri yapın)
5- Ders adları listelenecek. İstediğiniz dersin numarasını girin.
    Zoom linkine yönlendirilip, derse bağlanacaksınız. Bu kadar.
Bu kod EBA'dan bağımsızdır, herhangi bir hak sahipliği yoktur, kendi sorumluluğunuzda kullanınız.
Herhangi bir credit vermeden istediğiniz şekilde değiştirip kullanabilirsiniz
iletişim
E-Posta: deniz@denizemekli.com.tr
Discord: Deniz#1000
Instagram: deniz_emekli
*/

$.ajax({
  url : "https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//studytime/getstudentstudytime",
  method : "POST",
  headers : {
    "Content-Type" : "application/x-www-form-urlencoded",
    "Accept" : "json"
  },
  data : "status=1&type=2&pagesize=25&pagenumber=0",
  withCredentials : true,
  crossDomain : true,
  xhrFields : {
    withCredentials : true
  },
  dataType : "json",
  success : function(resp) {
    var result = resp.studyTimeList;
    var dersler = [];
    var dersText = "";
    var id = 1;
    for (var i in result) {
      if ((new Date).getTime() + 18000000 > result[i].startdate) {
        dersler.push(result[i]);
        dersText = dersText + (id.toString() + ") " + result[i].title + " (" + result[i].ownerName + ")\n");
        id = id + 1;
      }
    }
    if (dersler.length == 0) {
      alert("aktif ders yok");
      return;
    }
    var selectedDers = prompt("Seçim yapınız (sadece rakam girin):\n\n" + dersText);
    var ders = dersler[parseInt(selectedDers) - 1];
    $.ajax({
      url : "https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//livelesson/instudytime/start",
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Accept" : "json"
      },
      data : {
        "studytimeid" : ders.id,
        "tokentype" : "asdasd"
      },
      withCredentials : true,
      crossDomain : true,
      xhrFields : {
        withCredentials : true
      },
      dataType : "json",
      success : function(resp2) {
        window.location = resp2.meeting.url + "?tk=" + resp2.meeting.token;
      }
    });
  }
});
