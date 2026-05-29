/**
 * Seed Script — Başlangıç verilerini veritabanına ekler
 * Çalıştır: node src/seed.js
 *
 * Mevcut kayıtları SİLMEZ, sadece olmayan kayıtları ekler (findOrCreate).
 */

require('dotenv').config();
const { connectDB } = require('./config/database');
const {
  Partner, Page, Task, MarketItem, StreamConfig,
  WinEntry, SpecialOdd, Tournament, Event, HeroSlide, PointCode,
} = require('./models');

async function seed() {
  await connectDB();
  console.log('🌱 Seed başlıyor...\n');

  // ─────────────── STREAM CONFIG ───────────────
  const [, streamCreated] = await StreamConfig.findOrCreate({
    where: { id: 1 },
    defaults: { platform: 'kick', channelName: '', embedUrl: '', isLive: false },
  });
  console.log(streamCreated ? '✅ StreamConfig oluşturuldu' : '⏭  StreamConfig zaten var');

  // ─────────────── CMS SAYFALARI ───────────────
  const pages = [
    { slug: 'home', title: 'Ana Sayfa', content: '<p>Hoş geldiniz! Bu alan admin panelinden düzenlenebilir.</p>', isPublished: true },
    { slug: 'vip', title: 'VIP Programı', content: '<h2>VIP Seviyeleri</h2><p>Puan biriktirerek VIP seviyenizi yükseltin ve ayrıcalıklı avantajlardan yararlanın.</p>', isPublished: true },
    { slug: 'gorevler', title: 'Görevler', content: '', isPublished: true },
  ];
  for (const p of pages) {
    const [, created] = await Page.findOrCreate({ where: { slug: p.slug }, defaults: p });
    console.log(created ? `✅ Sayfa: ${p.slug}` : `⏭  Sayfa zaten var: ${p.slug}`);
  }

  // ─────────────── PARTNERLER ───────────────
  const partners = [
    { name: 'Betturkey', websiteUrl: 'https://example.com', bonusInfo: '%100 Hoş Geldin Bonusu', order: 1 },
    { name: 'Casinomax', websiteUrl: 'https://example.com', bonusInfo: '200 TL Freespin', order: 2 },
    { name: 'Superbetin', websiteUrl: 'https://example.com', bonusInfo: '%50 Yeniden Yükleme', order: 3 },
  ];
  for (const p of partners) {
    const [, created] = await Partner.findOrCreate({ where: { name: p.name }, defaults: p });
    console.log(created ? `✅ Partner: ${p.name}` : `⏭  Partner zaten var: ${p.name}`);
  }

  // ─────────────── GÖREVLER ───────────────
  const tasks = [
    { title: 'Günlük Giriş', description: 'Her gün siteye giriş yap', reward: 10, type: 'daily', isActive: true },
    { title: 'Sohbete Katıl', description: "Chat'e en az 1 mesaj gönder", reward: 5, type: 'daily', isActive: true },
    { title: 'İlk Kayıt', description: 'Hesabını oluştur', reward: 50, type: 'one-time', isActive: true },
    { title: 'Haftalık Aktiflik', description: "7 günün 5'inde aktif ol", reward: 100, type: 'weekly', isActive: true },
  ];
  for (const t of tasks) {
    const [, created] = await Task.findOrCreate({ where: { title: t.title }, defaults: t });
    console.log(created ? `✅ Görev: ${t.title}` : `⏭  Görev zaten var: ${t.title}`);
  }

  // ─────────────── MARKET ───────────────
  const marketItems = [
    { name: 'VIP Rozeti (1 Ay)', description: '1 aylık VIP statüsü', pointCost: 500, stock: -1, isActive: true },
    { name: 'Özel Profil Rengi', description: "Chat'te özel renk", pointCost: 200, stock: -1, isActive: true },
    { name: 'Emote Paketi', description: '10 özel emote', pointCost: 300, stock: -1, isActive: true },
  ];
  for (const item of marketItems) {
    const [, created] = await MarketItem.findOrCreate({ where: { name: item.name }, defaults: item });
    console.log(created ? `✅ Market: ${item.name}` : `⏭  Market zaten var: ${item.name}`);
  }

  // ─────────────── KAZANANLAR (ÖRNEK) ───────────────
  const winsCount = await WinEntry.count();
  if (winsCount === 0) {
    await WinEntry.bulkCreate([
      { username: 'Ahmet_K', gameName: 'Sweet Bonanza', multiplier: 250, winAmount: 12500, currency: 'TRY' },
      { username: 'Mehmet_Y', gameName: 'Gates of Olympus', multiplier: 500, winAmount: 25000, currency: 'TRY' },
      { username: 'Ayşe_D', gameName: 'Big Bass Bonanza', multiplier: 180, winAmount: 9000, currency: 'TRY' },
      { username: 'Fatih_S', gameName: 'Wanted Dead or a Wild', multiplier: 320, winAmount: 16000, currency: 'TRY' },
      { username: 'Zeynep_A', gameName: 'Dog House Megaways', multiplier: 750, winAmount: 37500, currency: 'TRY' },
    ]);
    console.log('✅ 5 örnek kazanç oluşturuldu');
  } else {
    console.log('⏭  Kazanç kayıtları zaten var');
  }

  // ─────────────── ÖZEL ORANLAR (ÖRNEK) ───────────────
  const oddsCount = await SpecialOdd.count();
  if (oddsCount === 0) {
    await SpecialOdd.bulkCreate([
      { title: 'Galatasaray Galibiyeti', match: 'Galatasaray vs Fenerbahçe', odds: 2.10, sport: 'Futbol', bookmaker: 'Betturkey', isActive: true },
      { title: 'Man City Galibiyeti', match: 'Manchester City vs Arsenal', odds: 1.80, sport: 'Futbol', bookmaker: 'Casinomax', isActive: true },
    ]);
    console.log('✅ Örnek özel oranlar oluşturuldu');
  } else {
    console.log('⏭  Özel oranlar zaten var');
  }

  // ─────────────── TURNUVA (ÖRNEK) ───────────────
  const tourCount = await Tournament.count();
  if (tourCount === 0) {
    await Tournament.create({
      name: 'Spartans Çevrim Turnuvası',
      description: 'Aylık büyük turnuva — en çok çevrim yapan kazanır!',
      prizePool: '50.000 TRY',
      status: 'upcoming',
    });
    console.log('✅ Örnek turnuva oluşturuldu');
  } else {
    console.log('⏭  Turnuva zaten var');
  }

  // ─────────────── ETKİNLİK (ÖRNEK) ───────────────
  const evCount = await Event.count();
  if (evCount === 0) {
    await Event.create({
      title: 'Hafta Sonu Çift Puan',
      description: 'Bu hafta sonu tüm görevlerden 2x puan kazanın!',
      isActive: true,
    });
    console.log('✅ Örnek etkinlik oluşturuldu');
  } else {
    console.log('⏭  Etkinlik zaten var');
  }

  // ─────────────── HERO SLIDES ───────────────
  const heroCount = await HeroSlide.count();
  if (heroCount === 0) {
    await HeroSlide.bulkCreate([
      {
        title: 'Jackpot Brothers\'a Hoş Geldiniz',
        subtitle: 'Türkiye\'nin en güvenilir casino topluluğu. Kazanmak için doğru yerdesiniz!',
        imageUrl: '/uploads/logos.png',
        buttonText: 'Hemen Katıl',
        buttonLink: '/gorevler',
        order: 1,
        isActive: true,
      },
      {
        title: 'VIP Avantajları Keşfet',
        subtitle: 'Puan biriktir, VIP seviyeni yükselt ve özel ayrıcalıklara ulaş.',
        imageUrl: '/uploads/logos.png',
        buttonText: 'VIP Programı',
        buttonLink: '/vip',
        order: 2,
        isActive: true,
      },
      {
        title: 'Bonus Hunt Başlıyor!',
        subtitle: 'Canlı bonus hunt seanslarını takip et, kazananlarla birlikte heyecanı yaşa.',
        imageUrl: '/uploads/logos.png',
        buttonText: 'Yayını İzle',
        buttonLink: '/yayin',
        order: 3,
        isActive: true,
      },
    ]);
    console.log('✅ 3 hero slayt oluşturuldu');
  } else {
    console.log('⏭  Hero slaytlar zaten var');
  }

  // ─────────────── PUAN KODLARI ───────────────
  const [, codeCreated] = await PointCode.findOrCreate({
    where: { code: 'HOSGELDIN' },
    defaults: { code: 'HOSGELDIN', points: 50, maxUses: null, isActive: true },
  });
  if (codeCreated) console.log('✅ Hoş geldin kodu oluşturuldu: HOSGELDIN (50 puan)');
  else console.log('⏭  Puan kodları zaten var');

  console.log('\n✨ Seed tamamlandı!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed hatası:', err);
  process.exit(1);
});
