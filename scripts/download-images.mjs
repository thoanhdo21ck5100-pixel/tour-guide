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
  // b1: Da Nang Airport Arrival & Transport (Terminal baggage claim with "Welcome to Da Nang" sign)
  'b1.jpg': 'https://images.unsplash.com/photo-1788927732141-d5791fce1b9a?auto=format&fit=crop&w=1200&q=80',
  // b2: Hoi An night market & glowing lanterns
  'b2.jpg': 'https://images.unsplash.com/photo-1755709986407-f72e45084ff2?auto=format&fit=crop&w=1200&q=80',
  // b3: Girls trip / couples 2N3D model course (Female travelers enjoying wooden boat in Hoi An)
  'b3.jpg': 'https://images.unsplash.com/flagged/photo-1549874613-8ea0adee1a82?auto=format&fit=crop&w=1200&q=80',
  // b4: Da Nang My Khe Beach sunny & turquoise water
  'b4.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  // b5: Hoi An souvenirs, silk lanterns & boutique shopping
  'b5.jpg': 'https://images.unsplash.com/photo-1776813191035-f66d5bb21a25?auto=format&fit=crop&w=1200&q=80',
  // b6: Da Nang stylish cafe & Vietnamese Phin drip coffee
  'b6.jpg': 'https://images.unsplash.com/photo-1745210358756-e7f7ff40e506?auto=format&fit=crop&w=1200&q=80',
  // b7: Da Nang to Hue day trip (Lăng Khải Định Huế)
  'b7.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Khai_Dinh_Mausoleum_Hue_%2827767160179%29.jpg/1280px-Khai_Dinh_Mausoleum_Hue_%2827767160179%29.jpg',
  // b8: Flights Japan to Da Nang
  'b8.jpg': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
  // b9: Real polymer Vietnamese Dong (500,000 VND banknotes)
  'b9.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Several_500%2C000-dong_banknotes_fanned_out_on_the_reverse_sides_and_stacked_to_form_a_circle-like_shape.jpg/1280px-Several_500%2C000-dong_banknotes_fanned_out_on_the_reverse_sides_and_stacked_to_form_a_circle-like_shape.jpg',
  // b10: Da Nang Night Tourism Guide (Illuminated Dragon Bridge glowing orange at night)
  'b10.jpg': 'https://images.unsplash.com/photo-1788927793309-a1e53e23ca00?auto=format&fit=crop&w=1200&q=80',
  // b11: Da Nang Cathedral (Pink Church) in bright daylight & clear sky
  'b11.jpg': 'https://images.unsplash.com/photo-1699177247360-3540d424e739?auto=format&fit=crop&w=1200&q=80',
  // b12: Hoi An Japanese Bridge (Chùa Cầu Hội An)
  'b12.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg/1280px-H%E1%BB%99i_An%2C_Ch%C3%B9a_C%E1%BA%A7u%2C_2020-01_CN-01.jpg',
  // b13: Theme parks (Sun World Ba Na Hills French Village aerial view at sunset)
  'b13.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Sun_World_Ba_Na_Hills_aerial_overview_sunset_Da_Nang_Vietnam.jpg/1280px-Sun_World_Ba_Na_Hills_aerial_overview_sunset_Da_Nang_Vietnam.jpg',
  // b14: Da Nang luxury beach resort pool villa
  'b14.jpg': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  // b15: Mì Quảng Đà Nẵng đặc sản
  'b15.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/M%C3%AC_Qu%E1%BA%A3ng%2C_Da_Nang%2C_Vietnam.jpg/1280px-M%C3%AC_Qu%E1%BA%A3ng%2C_Da_Nang%2C_Vietnam.jpg',
  // b16: Biển Mỹ Khê Đà Nẵng
  'b16.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/My_Khe_Beach_Danang_Coastline.jpg/1280px-My_Khe_Beach_Danang_Coastline.jpg',
  // b17: Động Huyền Không Ngũ Hành Sơn
  'b17.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Huyen_Khong_Cave_1.jpg/1280px-Huyen_Khong_Cave_1.jpg',
  // b18: Đường ven biển Đà Nẵng - Hội An rợp bóng dừa
  'b18.jpg': 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1200&q=80',
  // b19: Chợ Hàn Đà Nẵng mua sắm
  'b19.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Han_Market_Da_Nang.JPG/1280px-Han_Market_Da_Nang.JPG',
  // b20: Supermarket souvenirs (Cà phê phin & đặc sản Việt Nam)
  'b20.jpg': 'https://images.unsplash.com/photo-1741271398754-266cb8b2ac8a?auto=format&fit=crop&w=1200&q=80',
  // b21: Luxurious spa & massage (Herbal therapy, hot stones & relaxing ambiance)
  'b21.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
  // b22: Girls trip Ao Dai photoshoot in Hoi An ancient town with lanterns & non la
  'b22.jpg': 'https://images.unsplash.com/photo-1768017093198-4290d98d4335?auto=format&fit=crop&w=1200&q=80',
  // b23: Gia đình nghỉ dưỡng resort Đà Nẵng
  'b23.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Furama_Resort_Da_Nang_pool.jpg/1280px-Furama_Resort_Da_Nang_pool.jpg',
  // b24: Da Nang guys trip (Outdoor craft beer cheers with friends)
  'b24.jpg': 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1200&q=80',
  // b25: Cầu Vàng Bà Nà Sun World Ba Na Hills
  'b25.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg/1280px-Da_Nang_Golden_Bridge%2C_Sun_World_Ba_Na_Hills.jpg',
  // b26: Xe riêng du lịch tiện nghi có tài xế
  'b26.jpg': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  // b27: Toàn cảnh phố cổ Hội An bên sông Hoài
  'b27.jpg': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  // b28: Postcard view of Da Nang Han River & bridges skyline
  'b28.jpg': 'https://images.unsplash.com/photo-178892775408-e4d82fbe092c?auto=format&fit=crop&w=1200&q=80'
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
