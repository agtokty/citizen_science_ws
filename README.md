## citizen_science_ws

sensör verilerini saklamak amaçlı basit bir web api projesidir.

---
### rest api

* POST /observation

tek bir ölçüm göndermek için

* POST /observation/bulk

birden fazla ölçüm göndermek için

---
### veritabanı
* tables.sql script dosyası ile postgresql üzerinde oluşturulabilir
* ölçüm sonuçlarını saklamak için sadece observation tablosu bulunmaktadır.

 
---
### kurulum

* npm install
* node index.js [--port 1234]