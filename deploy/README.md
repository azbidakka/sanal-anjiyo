# Yayına alma

`sanalanjiyo.tusahastanesi.com` · DigitalOcean + Cloudflare + DeployHQ

## 1. Droplet

| | |
|---|---|
| İmaj | Ubuntu 24.04 LTS |
| Boyut | **Basic / Regular · 2 GB RAM · 1 vCPU · 50 GB SSD** |
| Bölge | Frankfurt (`fra1`) — Türkiye'ye en düşük gecikme |
| Kimlik | SSH anahtarı (parola girişi kapalı) |

2 GB önerilir: `next build` sırasında derleyici 1 GB'ı zorlar. Tek vCPU
yeterlidir, sayfa statik üretiliyor.

Droplet açıldıktan sonra root olarak:

```bash
git clone https://github.com/azbidakka/sanal-anjiyo.git /tmp/kurulum
bash /tmp/kurulum/deploy/sunucu-kurulum.sh
```

Script; Node 22, nginx, ufw, fail2ban kurar, `deploy` kullanıcısını ve
dizinleri oluşturur, `.env.local` dosyasını rastgele bir oturum anahtarı ve
panel şifresiyle yazar, posta sunucusuna erişimi sınar. **Ekrana basılan panel
şifresini kaydedin.**

## 2. Cloudflare DNS

| Tip | Ad | İçerik | Proxy |
|---|---|---|---|
| A | `sanalanjiyo` | droplet IP | **başta kapalı (gri bulut)** |

Sertifika alınana kadar proxy kapalı kalmalı; Let's Encrypt doğrulaması
doğrudan sunucuya ulaşmalı.

Sertifika alındıktan sonra:

1. Proxy'yi açın (turuncu bulut)
2. **SSL/TLS → Overview → Full (strict)** seçin
   *Flexible seçilirse sonsuz yönlendirme döngüsü oluşur.*
3. **SSL/TLS → Edge Certificates → Always Use HTTPS** açın
4. Yalnızca `sanalanjiyo` kaydını yönetin — `tusahastanesi.com` kök kaydına
   ve MX kayıtlarına dokunmayın, posta akışı bozulur.

## 3. Sertifika

Cloudflare proxy'si **kapalıyken**:

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d sanalanjiyo.tusahastanesi.com
```

Yenileme otomatiktir (`certbot.timer`). Proxy açıkken de çalışır çünkü
Cloudflare 80 portunu sunucuya iletir.

## 4. DeployHQ

**Proje → Repository:** GitHub, `azbidakka/sanal-anjiyo`, dal `main`.
Private depo olduğu için DeployHQ'nun verdiği deploy anahtarını GitHub'da
**Settings → Deploy keys** bölümüne ekleyin (yazma yetkisi gerekmez).

**Sunucu (Server) ayarları**

| Alan | Değer |
|---|---|
| Protocol | SSH/SFTP |
| Hostname | droplet IP |
| Username | `deploy` |
| Port | 22 |
| Deployment path | `/var/www/sanalanjiyo` |
| Authentication | DeployHQ'nun genel anahtarı |

DeployHQ'nun SSH anahtarını sunucuda
`/home/deploy/.ssh/authorized_keys` dosyasına ekleyin.

**Excluded files** — bu yollar deploy'da dokunulmamalı:

```
.env.local
content/settings.json
content/submissions.json
content/uploads/**
node_modules/**
.next/**
```

**SSH Commands → After changes are deployed:**

```bash
cd /var/www/sanalanjiyo && npm ci && npm run build && sudo systemctl restart sanalanjiyo
```

`deploy` kullanıcısının parolasız servis yeniden başlatabilmesi için:

```bash
echo 'deploy ALL=(root) NOPASSWD: /bin/systemctl restart sanalanjiyo' \
  > /etc/sudoers.d/sanalanjiyo
chmod 440 /etc/sudoers.d/sanalanjiyo
```

## 5. İlk deploy sonrası

```bash
cp /var/www/sanalanjiyo/deploy/sanalanjiyo.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now sanalanjiyo

cp /var/www/sanalanjiyo/deploy/nginx.conf /etc/nginx/sites-available/sanalanjiyo
ln -sf /etc/nginx/sites-available/sanalanjiyo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 6. Panel kurulumu

`https://sanalanjiyo.tusahastanesi.com/admin`

1. Kurulum scriptinin verdiği şifreyle girin
2. **Ayarlar → Panel hesabı**: şifreyi değiştirin
3. **Ayarlar → E-posta**: posta kutusu şifresini girin
   - Kullanıcı adı: `info@gisbirhastanesi.local`
   - *Yerel `content/settings.json` dosyasını sunucuya kopyalamayın —
     şifreleme anahtarı sunucuda farklıdır, çözülemez.*
4. **Test e-postası gönder** ile doğrulayın
5. İletişim formundan bir talep gönderip uçtan uca kontrol edin

## 7. Yedekleme

İçerik, ayarlar ve talepler `/var/www/sanalanjiyo-data` altındadır.
Günlük yedek için:

```bash
cat > /etc/cron.daily/sanalanjiyo-yedek <<'CRON'
#!/bin/sh
mkdir -p /var/backups/sanalanjiyo
tar czf "/var/backups/sanalanjiyo/$(date +%F).tar.gz" -C /var/www sanalanjiyo-data
find /var/backups/sanalanjiyo -name '*.tar.gz' -mtime +30 -delete
CRON
chmod +x /etc/cron.daily/sanalanjiyo-yedek
```

Panelden de **Ayarlar → İçerik yedeği → Yedeği indir** ile tek dosya
alınabilir.

## Sorun giderme

| Belirti | Neden |
|---|---|
| Panele giriş yapılamıyor, hata yok | Site HTTP üzerinden açılıyor. Oturum çerezi üretimde `secure` işaretli; HTTPS şart. |
| Sonsuz yönlendirme döngüsü | Cloudflare SSL modu *Flexible*. **Full (strict)** yapın. |
| Deploy sonrası panel içeriği eskiye döndü | `CONTENT_DIR` tanımlı değil ya da `content/` klasörü deploy'da üzerine yazılıyor. |
| E-posta gitmiyor | `systemctl status sanalanjiyo` ve `/var/log/sanalanjiyo/app.log` içinde `[iletisim]` satırlarına bakın. |
| `535` kimlik doğrulama hatası | Kullanıcı adı e-posta adresi değil, AD oturum açma adı olmalı: `info@gisbirhastanesi.local` |
