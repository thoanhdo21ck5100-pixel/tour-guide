import fs from 'fs';
import path from 'path';

const toursMap = {
  'p1.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80', // Hoi An classic
  'p2.jpg': 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=1200&q=80', // Ba Na Hills
  'p3.jpg': 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?auto=format&fit=crop&w=1200&q=80', // Danang night food
  'p4.jpg': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', // Private car charter
  'p5.jpg': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', // Family resort
  'p6.jpg': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80', // Han market cafe
  'p7.jpg': 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80', // Spa beauty
  'p8.jpg': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', // Men seafood bar
  'p9.jpg': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', // Hoi An Ao Dai
  'p10.jpg': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80', // Jeep adventure
  'p11.jpg': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // Hue Imperial City
};

const blogsMap = {
  'b1.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', // Airport Grab transport
  'b2.jpg': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Hoi An lantern market
  'b3.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', // Girls trip model course
  'b4.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Best season weather
  'b5.jpg': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80', // Hoi An souvenirs handicrafts
  'b6.jpg': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80', // Safe stylish cafes
  'b7.jpg': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', // Hue day trip
  'b8.jpg': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', // Flights Japan to Danang
  'b9.jpg': 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80', // Money Dong Yen exchange
  'b10.jpg': 'https://images.unsplash.com/photo-1558588942-930faae5a389?auto=format&fit=crop&w=1200&q=80', // Dragon bridge night market
  'b11.jpg': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', // Danang Cathedral architecture
  'b12.jpg': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', // Danang Hoi An travel
  'b13.jpg': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80', // Theme parks Asia Park
  'b14.jpg': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Hotel area guide
  'b15.jpg': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80', // Local food gourmet
  'b16.jpg': 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // My Khe Beach
  'b17.jpg': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', // Marble Mountains
  'b18.jpg': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Danang to Hoi An drive
  'b19.jpg': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80', // Han Market Con Market
  'b20.jpg': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80', // Supermarket souvenirs Lotte Mart
  'b21.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', // Spas & massage
  'b22.jpg': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80', // Girls beauty shopping
  'b23.jpg': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Family senior travel
  'b24.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80', // Men active nightlife
  'b25.jpg': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80', // Ba Na Hills Golden Bridge
  'b26.jpg': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', // Private car charter
  'b27.jpg': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', // 3N4D itinerary
  'b28.jpg': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Master Danang guide
};

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`✓ Đã tải: ${destPath} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (err) {
    console.error(`✗ Lỗi tải ${destPath}:`, err.message);
  }
}

async function run() {
  const toursDir = path.resolve('public/images/tours');
  const blogDir = path.resolve('public/images/blog');

  fs.mkdirSync(toursDir, { recursive: true });
  fs.mkdirSync(blogDir, { recursive: true });

  console.log('--- Bắt đầu tải 11 ảnh Tours ---');
  for (const [file, url] of Object.entries(toursMap)) {
    await downloadImage(url, path.join(toursDir, file));
  }

  console.log('\n--- Bắt đầu tải 28 ảnh Blogs ---');
  for (const [file, url] of Object.entries(blogsMap)) {
    await downloadImage(url, path.join(blogDir, file));
  }

  console.log('\n🎉 Hoàn thành tải toàn bộ 39 ảnh không trùng lặp!');
}

run();
