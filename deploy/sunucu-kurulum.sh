#!/usr/bin/env bash
# TUSA Sanal Anjiyo — DigitalOcean droplet ilk kurulum
# Ubuntu 24.04 LTS üzerinde root olarak bir kez çalıştırılır:
#   bash sunucu-kurulum.sh
set -euo pipefail

ALAN_ADI="sanalanjiyo.tusahastanesi.com"
UYGULAMA_DIZINI="/var/www/sanalanjiyo"
VERI_DIZINI="/var/www/sanalanjiyo-data"
KULLANICI="deploy"

echo "==> Sistem güncelleniyor"
apt-get update -qq
apt-get upgrade -y -qq

echo "==> Temel paketler"
apt-get install -y -qq curl git nginx ufw fail2ban unattended-upgrades

echo "==> Node.js 22"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi
node --version

echo "==> Deploy kullanıcısı"
if ! id "$KULLANICI" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$KULLANICI"
  mkdir -p "/home/$KULLANICI/.ssh"
  chmod 700 "/home/$KULLANICI/.ssh"
  touch "/home/$KULLANICI/.ssh/authorized_keys"
  chmod 600 "/home/$KULLANICI/.ssh/authorized_keys"
  chown -R "$KULLANICI:$KULLANICI" "/home/$KULLANICI/.ssh"
fi

echo "==> Dizinler"
# Uygulama dizini: her deploy'da güncellenir.
# Veri dizini: içerik, ayarlar, talepler ve yüklenen görseller —
# deploy dizininin DIŞINDA olmalı ki deploy'lar panel içeriğini silmesin.
mkdir -p "$UYGULAMA_DIZINI" "$VERI_DIZINI/uploads" /var/log/sanalanjiyo
chown -R "$KULLANICI:$KULLANICI" "$UYGULAMA_DIZINI" "$VERI_DIZINI" /var/log/sanalanjiyo

echo "==> Ortam değişkenleri"
if [ ! -f "$UYGULAMA_DIZINI/.env.local" ]; then
  SECRET="$(openssl rand -hex 32)"
  PANEL_SIFRE="$(openssl rand -base64 12 | tr -d '+/=' | cut -c1-14)"

  cat > "$UYGULAMA_DIZINI/.env.local" <<ENV
ADMIN_USERNAME=tusa
ADMIN_PASSWORD=$PANEL_SIFRE
ADMIN_SESSION_SECRET=$SECRET
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact
NEXT_PUBLIC_SITE_URL=https://$ALAN_ADI
CONTENT_DIR=$VERI_DIZINI
ENV

  chown "$KULLANICI:$KULLANICI" "$UYGULAMA_DIZINI/.env.local"
  chmod 600 "$UYGULAMA_DIZINI/.env.local"

  echo
  echo "   ---------------------------------------------"
  echo "   PANEL GIRISI  kullanici: tusa"
  echo "                 sifre    : $PANEL_SIFRE"
  echo "   Bu sifreyi kaydedin, panelden degistirebilirsiniz."
  echo "   ---------------------------------------------"
  echo
fi

echo "==> Güvenlik duvarı"
ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable

echo "==> Posta sunucusuna erişim sınanıyor (mail.tusahastanesi.com:587)"
if timeout 8 bash -c "cat < /dev/null > /dev/tcp/mail.tusahastanesi.com/587" 2>/dev/null; then
  echo "    erişim var"
else
  echo "    UYARI: erişilemedi — e-posta bildirimleri çalışmaz."
fi

echo "==> Otomatik güvenlik güncellemeleri"
dpkg-reconfigure -f noninteractive unattended-upgrades

cat <<SON

Kurulum tamam. Sıradaki adımlar:

 1) DeployHQ'nun SSH anahtarını ekleyin:
    /home/$KULLANICI/.ssh/authorized_keys

 2) İlk deploy'u DeployHQ'dan çalıştırın.

 3) Servisi tanımlayın:
    cp $UYGULAMA_DIZINI/deploy/sanalanjiyo.service /etc/systemd/system/
    systemctl daemon-reload && systemctl enable --now sanalanjiyo

 4) Nginx:
    cp $UYGULAMA_DIZINI/deploy/nginx.conf /etc/nginx/sites-available/sanalanjiyo
    ln -sf /etc/nginx/sites-available/sanalanjiyo /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

 5) Sertifika (Cloudflare proxy'si KAPALIYKEN / gri bulut):
    apt-get install -y certbot python3-certbot-nginx
    certbot --nginx -d $ALAN_ADI
    Sonra Cloudflare'de proxy'yi açın, SSL modunu "Full (strict)" yapın.

 6) Panel: https://$ALAN_ADI/admin

SON
