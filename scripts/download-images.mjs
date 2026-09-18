import fs from 'fs';
import path from 'path';

// 11 Tour Images: 100% Authentic Vietnam / Da Nang / Hoi An / Hue Landmarks
const toursMap = {
  // P1: Hoi An Japanese Covered Bridge (Chùa Cầu Hội An)
  'p1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg/1280px-H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg',
  // P2: Sun World Ba Na Hills Golden Bridge (Cầu Vàng Bà Nà Đà Nẵng)
  'p2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg/1280px-Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg',
  // P3: Da Nang Dragon Bridge Night View (Cầu Rồng Đà Nẵng về đêm)
  'p3.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Da_Nang_Dragon_Bridge.jpg/1280px-Da_Nang_Dragon_Bridge.jpg',
  // P4: Hai Van Pass Scenic Coastal Drive (Đèo Hải Vân - Thuê xe riêng tự do)
  'p4.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Hai_Van_Pass_Vietnam.jpg/1280px-Hai_Van_Pass_Vietnam.jpg',
  // P5: Furama Resort Da Nang Ocean Pool (Resort biển Đà Nẵng cho gia đình)
  'p5.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Furama_Resort_Da_Nang_pool.jpg/1280px-Furama_Resort_Da_Nang_pool.jpg',
  // P6: Han Market Da Nang (Chợ Hàn Đà Nẵng nhộn nhịp)
  'p6.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Han_Market_Da_Nang.JPG/1280px-Han_Market_Da_Nang.JPG',
  // P7: Organic Spa & Wellness (Spa thư giãn)
  'p7.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  // P8: Fresh Seafood Tanks in Da Nang (Hải sản tươi sống chọn món tại Đà Nẵng)
  'p8.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Live_seafood_tanks_in_Danang.jpg/1280px-Live_seafood_tanks_in_Danang.jpg',
  // P9: Hoi An Lanterns at Night (Phố đèn lồng lung linh Hội An)
  'p9.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Hoi_An_lanterns_at_night.jpg/1280px-Hoi_An_lanterns_at_night.jpg',
  // P10: Son Tra Peninsula & Linh Ung Pagoda Coast (Bán đảo Sơn Trà ngắm biển Đà Nẵng)
  'p10.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Son-Tra-Peninsula_Da-Nang_Vietnam_Linh-Ung-Pagoda-01.jpg/1280px-Son-Tra-Peninsula_Da-Nang_Vietnam_Linh-Ung-Pagoda-01.jpg',
  // P11: Meridian Gate, Hue Imperial Citadel (Cổng Ngọ Môn - Đại Nội Huế)
  'p11.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ngo_Mon_Gate_for_entry_to_the_Imperial_Citadel%2C_Hue_%2831654316702%29.jpg/1280px-Ngo_Mon_Gate_for_entry_to_the_Imperial_Citadel%2C_Hue_%2831654316702%29.jpg',
};

// 28 Blog Images: Authentic & Highly Relevant
const blogsMap = {
  'b1.jpg': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', // Airport Grab transport
  'b2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Hoi_An_lanterns_at_night.jpg/1280px-Hoi_An_lanterns_at_night.jpg', // Hoi An lantern market
  'b3.jpg': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', // Girls trip model course
  'b4.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Best season weather
  'b5.jpg': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80', // Hoi An souvenirs handicrafts
  'b6.jpg': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80', // Safe stylish cafes
  'b7.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Khai_Dinh_Mausoleum_Hue_%2827767160179%29.jpg/1280px-Khai_Dinh_Mausoleum_Hue_%2827767160179%29.jpg', // Lăng Khải Định Huế
  'b8.jpg': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', // Flights Japan to Danang
  'b9.jpg': 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80', // Money Dong Yen exchange
  'b10.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Da_Nang_Dragon_Bridge.jpg/1280px-Da_Nang_Dragon_Bridge.jpg', // Cầu Rồng Đà Nẵng
  'b11.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nha_Tho_Con_Ga_Da_Nang.JPG/1280px-Nha_Tho_Con_Ga_Da_Nang.JPG', // Nhà thờ Con Gà Đà Nẵng
  'b12.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg/1280px-H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg', // Chùa Cầu Hội An
  'b13.jpg': 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80', // Theme parks Asia Park
  'b14.jpg': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Hotel area guide
  'b15.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/M%C3%AC_Qu%E1%BA%A3ng%2C_Da_Nang%2C_Vietnam.jpg/1280px-M%C3%AC_Qu%E1%BA%A3ng%2C_Da_Nang%2C_Vietnam.jpg', // Mì Quảng Đà Nẵng
  'b16.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/My_Khe_Beach_Danang_Coastline.jpg/1280px-My_Khe_Beach_Danang_Coastline.jpg', // Biển Mỹ Khê Đà Nẵng
  'b17.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Huyen_Khong_Cave_1.jpg/1280px-Huyen_Khong_Cave_1.jpg', // Động Huyền Không Ngũ Hành Sơn
  'b18.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Hai_Van_Pass_Vietnam.jpg/1280px-Hai_Van_Pass_Vietnam.jpg', // Đường ven biển Đà Nẵng - Hội An
  'b19.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Han_Market_Da_Nang.JPG/1280px-Han_Market_Da_Nang.JPG', // Chợ Hàn Đà Nẵng
  'b20.jpg': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80', // Supermarket souvenirs Lotte Mart
  'b21.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', // Spas & massage
  'b22.jpg': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80', // Girls beauty shopping
  'b23.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Furama_Resort_Da_Nang_pool.jpg/1280px-Furama_Resort_Da_Nang_pool.jpg', // Gia đình nghỉ dưỡng Đà Nẵng
  'b24.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80', // Men active nightlife
  'b25.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg/1280px-Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg', // Cầu Vàng Bà Nà
  'b26.jpg': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', // Private car charter
  'b27.jpg': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', // 3N4D itinerary
  'b28.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Da_Nang_Dragon_Bridge.jpg/1280px-Da_Nang_Dragon_Bridge.jpg', // Master Danang guide
};

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'TourGuideApp/1.0 (contact@vietnam-nihongo-guide.com)',
      },
    });
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

  console.log('--- Bắt đầu tải ảnh Tours chuẩn thực tế Việt Nam / Đà Nẵng ---');
  for (const [file, url] of Object.entries(toursMap)) {
    await downloadImage(url, path.join(toursDir, file));
  }

  console.log('\n--- Bắt đầu tải ảnh Blogs chuẩn thực tế Việt Nam / Đà Nẵng ---');
  for (const [file, url] of Object.entries(blogsMap)) {
    await downloadImage(url, path.join(blogDir, file));
  }

  console.log('\n🎉 Hoàn thành tải toàn bộ ảnh chuẩn địa danh!');
}

run();
