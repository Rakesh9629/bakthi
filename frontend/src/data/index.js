// Demo data — replace with real API calls once backend is connected

export const CATEGORIES = [
  { id: 1, slug: 'lord-ganesha', name: 'Lord Ganesha', icon: '🐘', count: 24, description: 'Auspicious Ganesha frames for home and office' },
  { id: 2, slug: 'lord-krishna', name: 'Lord Krishna', icon: '🦚', count: 31, description: 'Divine Krishna frames in premium acrylic' },
  { id: 3, slug: 'radha-krishna', name: 'Radha Krishna', icon: '💛', count: 18, description: 'Eternal love of Radha and Krishna' },
  { id: 4, slug: 'lord-shiva', name: 'Lord Shiva', icon: '🔱', count: 27, description: 'Mahadev frames for pooja rooms' },
  { id: 5, slug: 'lord-murugan', name: 'Lord Murugan', icon: '⚡', count: 15, description: 'Vel Murugan frames for Tamil devotees' },
  { id: 6, slug: 'lord-hanuman', name: 'Lord Hanuman', icon: '🙏', count: 20, description: 'Bajrangbali frames for strength and devotion' },
  { id: 7, slug: 'lord-rama', name: 'Lord Rama & Ram Darbar', icon: '🏹', count: 16, description: 'Ram Darbar and Sita Ram frames' },
  { id: 8, slug: 'goddess-lakshmi', name: 'Goddess Lakshmi', icon: '🪷', count: 22, description: 'Mahalakshmi frames for prosperity' },
  { id: 9, slug: 'goddess-saraswati', name: 'Goddess Saraswati', icon: '🎵', count: 12, description: 'Saraswati frames for knowledge and arts' },
  { id: 10, slug: 'lord-venkateswara', name: 'Lord Venkateswara', icon: '⭐', count: 19, description: 'Tirupati Balaji frames for blessings' },
  { id: 11, slug: 'durga-amman', name: 'Durga Amman', icon: '🌺', count: 14, description: 'Durga and Amman frames for protection' },
  { id: 12, slug: 'other-devotional', name: 'Other Devotional', icon: '🕉️', count: 30, description: 'All other devotional frames' },
]

export const SHOP_BY = {
  room: [
    { label: 'Pooja Room', value: 'pooja-room', icon: '🪔' },
    { label: 'Living Room', value: 'living-room', icon: '🛋️' },
    { label: 'Bedroom', value: 'bedroom', icon: '🛏️' },
    { label: 'Office / Study', value: 'office', icon: '💼' },
    { label: 'Entrance / Foyer', value: 'entrance', icon: '🚪' },
    { label: 'Kitchen', value: 'kitchen', icon: '🍳' },
  ],
  shape: [
    { label: 'Vertical', value: 'vertical', icon: '▯' },
    { label: 'Horizontal', value: 'horizontal', icon: '▭' },
    { label: 'Square', value: 'square', icon: '□' },
    { label: 'Round', value: 'round', icon: '○' },
  ],
  size: [
    { label: 'Small (6×8 in)', value: 'small' },
    { label: 'Medium (12×16 in)', value: 'medium' },
    { label: 'Large (18×24 in)', value: 'large' },
    { label: 'Extra Large (24×36 in)', value: 'xlarge' },
  ],
  price: [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 – ₹1000', value: '500-1000' },
    { label: '₹1000 – ₹2000', value: '1000-2000' },
    { label: 'Above ₹2000', value: '2000-99999' },
  ],
}

const makeProduct = (id, name, deity, slug, category, price, mrp, images, tags = []) => ({
  id,
  name,
  deity,
  slug,
  category,
  price,
  mrp,
  discount: Math.round(((mrp - price) / mrp) * 100),
  images,
  thumbnail: images[0],
  rating: +(3.8 + Math.random() * 1.2).toFixed(1),
  reviewCount: Math.floor(20 + Math.random() * 180),
  sku: `BKT-${String(id).padStart(4, '0')}`,
  stock: Math.floor(5 + Math.random() * 50),
  sizes: [
    { label: '6×8 in', value: '6x8', price: price },
    { label: '12×16 in', value: '12x16', price: price + 200 },
    { label: '18×24 in', value: '18x24', price: price + 500 },
    { label: '24×36 in', value: '24x36', price: price + 1000 },
  ],
  shapes: ['vertical', 'horizontal', 'square'],
  material: 'Premium Acrylic',
  thickness: '5mm',
  finish: 'Glossy UV Print',
  isFeatured: tags.includes('featured'),
  isBestseller: tags.includes('bestseller'),
  isNewArrival: tags.includes('new'),
  isActive: true,
  description: `This premium ${name} acrylic frame is crafted with high-quality 5mm acrylic glass and UV-resistant printing technology. Perfect for your pooja room, living room or as a thoughtful gift. The vibrant colors and sharp details make this a divine addition to any space.`,
  features: ['5mm Premium Acrylic', 'UV Resistant Print', 'Ready to Hang', 'Scratch Resistant', 'Waterproof'],
  seoTitle: `${name} Acrylic Frame | Premium Devotional Wall Art | Bakthi`,
  seoDescription: `Buy premium ${name} acrylic photo frame online. High quality UV print, 5mm acrylic, ready to hang. Free shipping above ₹999.`,
  room: ['pooja-room', 'living-room'],
  shape: 'vertical',
})

// Using picsum for placeholder images (realistic product-like images)
const img = (seed, w = 400, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const PRODUCTS = [
  makeProduct(1, 'Lord Ganesha Blessing', 'Lord Ganesha', 'lord-ganesha-blessing', 'lord-ganesha', 799, 1299, [img('ganesha1'), img('ganesha2'), img('ganesha3')], ['featured', 'bestseller']),
  makeProduct(2, 'Ganesha Chaturthi Special', 'Lord Ganesha', 'ganesha-chaturthi-special', 'lord-ganesha', 999, 1599, [img('ganesha4'), img('ganesha5')], ['new']),
  makeProduct(3, 'Lord Krishna Flute', 'Lord Krishna', 'lord-krishna-flute', 'lord-krishna', 849, 1399, [img('krishna1'), img('krishna2'), img('krishna3')], ['featured', 'bestseller']),
  makeProduct(4, 'Bal Krishna', 'Lord Krishna', 'bal-krishna', 'lord-krishna', 699, 999, [img('krishna3'), img('krishna4')], ['new']),
  makeProduct(5, 'Radha Krishna Divine Love', 'Radha Krishna', 'radha-krishna-divine-love', 'radha-krishna', 1099, 1799, [img('radha1'), img('radha2'), img('radha3')], ['featured', 'bestseller']),
  makeProduct(6, 'Radha Krishna Vrindavan', 'Radha Krishna', 'radha-krishna-vrindavan', 'radha-krishna', 899, 1299, [img('radha3'), img('radha4')], []),
  makeProduct(7, 'Lord Shiva Meditation', 'Lord Shiva', 'lord-shiva-meditation', 'lord-shiva', 799, 1199, [img('shiva1'), img('shiva2'), img('shiva3')], ['featured']),
  makeProduct(8, 'Mahadev Trishul', 'Lord Shiva', 'mahadev-trishul', 'lord-shiva', 949, 1499, [img('shiva3'), img('shiva4')], ['bestseller']),
  makeProduct(9, 'Lord Murugan Vel', 'Lord Murugan', 'lord-murugan-vel', 'lord-murugan', 749, 1099, [img('murugan1'), img('murugan2')], ['new']),
  makeProduct(10, 'Bajrangbali Hanuman', 'Lord Hanuman', 'bajrangbali-hanuman', 'lord-hanuman', 799, 1199, [img('hanuman1'), img('hanuman2'), img('hanuman3')], ['bestseller']),
  makeProduct(11, 'Ram Darbar', 'Lord Rama', 'ram-darbar', 'lord-rama', 1199, 1999, [img('rama1'), img('rama2'), img('rama3')], ['featured', 'bestseller']),
  makeProduct(12, 'Sita Ram', 'Lord Rama', 'sita-ram', 'lord-rama', 899, 1299, [img('rama3'), img('rama4')], []),
  makeProduct(13, 'Mahalakshmi Prosperity', 'Goddess Lakshmi', 'mahalakshmi-prosperity', 'goddess-lakshmi', 849, 1299, [img('lakshmi1'), img('lakshmi2'), img('lakshmi3')], ['featured', 'bestseller']),
  makeProduct(14, 'Lakshmi Diwali Special', 'Goddess Lakshmi', 'lakshmi-diwali-special', 'goddess-lakshmi', 999, 1599, [img('lakshmi3'), img('lakshmi4')], ['new']),
  makeProduct(15, 'Goddess Saraswati', 'Goddess Saraswati', 'goddess-saraswati', 'goddess-saraswati', 749, 1099, [img('saraswati1'), img('saraswati2')], []),
  makeProduct(16, 'Lord Venkateswara', 'Lord Venkateswara', 'lord-venkateswara', 'lord-venkateswara', 899, 1399, [img('venkat1'), img('venkat2'), img('venkat3')], ['featured', 'bestseller']),
  makeProduct(17, 'Tirupati Balaji Gold', 'Lord Venkateswara', 'tirupati-balaji-gold', 'lord-venkateswara', 1299, 1999, [img('venkat3'), img('venkat4')], ['new']),
  makeProduct(18, 'Durga Amman Power', 'Durga Amman', 'durga-amman-power', 'durga-amman', 849, 1299, [img('durga1'), img('durga2'), img('durga3')], ['bestseller']),
  makeProduct(19, 'Navratri Durga Special', 'Durga Amman', 'navratri-durga-special', 'durga-amman', 999, 1599, [img('durga3'), img('durga4')], ['new']),
  makeProduct(20, 'Ayyappa Swami', 'Lord Ayyappa', 'ayyappa-swami', 'other-devotional', 749, 1099, [img('ayyappa1'), img('ayyappa2')], []),
  makeProduct(21, 'Sai Baba Blessing', 'Sai Baba', 'sai-baba-blessing', 'other-devotional', 799, 1199, [img('saibaba1'), img('saibaba2'), img('saibaba3')], ['bestseller']),
  makeProduct(22, 'Combo: Ganesha + Lakshmi', 'Multiple', 'combo-ganesha-lakshmi', 'other-devotional', 1499, 2499, [img('combo1'), img('combo2')], ['featured', 'new']),
  makeProduct(23, 'Ganesha Round Frame', 'Lord Ganesha', 'ganesha-round-frame', 'lord-ganesha', 899, 1399, [img('ganesha6'), img('ganesha7')], ['new']),
  makeProduct(24, 'Krishna Horizontal Art', 'Lord Krishna', 'krishna-horizontal-art', 'lord-krishna', 1099, 1699, [img('krishna5'), img('krishna6')], ['featured']),
]

export const BANNERS = [
  {
    id: 1,
    title: 'Divine Acrylic Frames',
    subtitle: 'Premium quality devotional wall art for your sacred space',
    cta: 'Shop Now',
    ctaLink: '/shop',
    badge: 'New Collection',
    bg: 'from-amber-900 to-orange-800',
    image: img('banner1', 1200, 500),
  },
  {
    id: 2,
    title: 'Diwali Special Collection',
    subtitle: 'Celebrate the festival of lights with our exclusive frames',
    cta: 'Explore Collection',
    ctaLink: '/shop?tag=new',
    badge: 'Limited Edition',
    bg: 'from-red-900 to-amber-800',
    image: img('banner2', 1200, 500),
  },
  {
    id: 3,
    title: 'Free Shipping Above ₹999',
    subtitle: 'Pan India delivery | 100% satisfaction guaranteed',
    cta: 'Browse All Frames',
    ctaLink: '/shop',
    badge: 'Special Offer',
    bg: 'from-stone-800 to-amber-900',
    image: img('banner3', 1200, 500),
  },
]

export const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', city: 'Chennai', rating: 5, text: 'Absolutely beautiful quality! The Radha Krishna frame I ordered looks stunning in my pooja room. Colors are vibrant and the acrylic is thick and premium.', product: 'Radha Krishna Divine Love', verified: true },
  { id: 2, name: 'Rajesh Kumar', city: 'Bangalore', rating: 5, text: 'Ordered the Ram Darbar frame for my parents. They were overjoyed. Packaging was excellent and delivery was fast. Will definitely order again!', product: 'Ram Darbar', verified: true },
  { id: 3, name: 'Meena Iyer', city: 'Coimbatore', rating: 5, text: 'The Lord Murugan frame is exactly as shown. The UV print quality is outstanding. Highly recommend Bakthi for devotional frames.', product: 'Lord Murugan Vel', verified: true },
  { id: 4, name: 'Suresh Patel', city: 'Ahmedabad', rating: 4, text: 'Good quality product. The Ganesha frame looks great in our living room. Slight delay in delivery but worth the wait.', product: 'Lord Ganesha Blessing', verified: true },
  { id: 5, name: 'Anitha Reddy', city: 'Hyderabad', rating: 5, text: 'Gifted the Lakshmi frame to my sister for her housewarming. She loved it! The packaging was very professional and the frame quality is top-notch.', product: 'Mahalakshmi Prosperity', verified: true },
  { id: 6, name: 'Karthik Nair', city: 'Kochi', rating: 5, text: 'Best devotional frames I have found online. The acrylic thickness and print clarity are unmatched. My entire family has ordered from Bakthi now.', product: 'Lord Venkateswara', verified: true },
]

export const FAQS = [
  { q: 'What material are the frames made of?', a: 'All our frames are made from premium 5mm thick acrylic glass with UV-resistant printing technology. This ensures vibrant colors that last for years without fading.' },
  { q: 'What sizes are available?', a: 'We offer four standard sizes: Small (6×8 inches), Medium (12×16 inches), Large (18×24 inches), and Extra Large (24×36 inches). Custom sizes are available on request.' },
  { q: 'How do I hang the frame?', a: 'Each frame comes with pre-installed hanging hardware. Simply use the included wall hook or nail. The frames are lightweight and easy to install.' },
  { q: 'Do you offer customization?', a: 'Yes! We offer personalized frames with custom photos, names, and dates. Contact us via WhatsApp or email for custom orders.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy for damaged or defective products. Please contact us within 7 days of delivery with photos of the damage.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5-7 business days across India. Express delivery (2-3 days) is available for select pin codes at an additional charge.' },
  { q: 'Do you ship pan India?', a: 'Yes, we ship to all states and union territories across India. Free shipping is available on orders above ₹999.' },
  { q: 'Can I track my order?', a: 'Yes, once your order is shipped, you will receive a tracking number via SMS and email. You can track your order on our website or the courier partner\'s website.' },
]

export const DEMO_ORDERS = [
  { id: 'BKT-2026-001', date: '2026-02-15', status: 'delivered', paymentStatus: 'paid', total: 1798, items: [{ ...PRODUCTS[0], qty: 1, selectedSize: '12×16 in' }, { ...PRODUCTS[12], qty: 1, selectedSize: '6×8 in' }], tracking: { courier: 'Delhivery', trackingNo: 'DL123456789IN', status: 'Delivered', updatedAt: '2026-02-20' }, address: { name: 'Devotee Customer', line1: '21 North Street', city: 'Vadamamandur', state: 'Tamil Nadu', pincode: '605702', phone: '7373646180' } },
  { id: 'BKT-2026-002', date: '2026-03-01', status: 'shipped', paymentStatus: 'paid', total: 1099, items: [{ ...PRODUCTS[4], qty: 1, selectedSize: '12×16 in' }], tracking: { courier: 'BlueDart', trackingNo: 'BD987654321IN', status: 'In Transit', updatedAt: '2026-03-03' }, address: { name: 'Srinivasan R', line1: 'Temple Road', city: 'Salem', state: 'Tamil Nadu', pincode: '636001', phone: '7373646180' } },
  { id: 'BKT-2026-003', date: '2026-03-10', status: 'processing', paymentStatus: 'paid', total: 849, items: [{ ...PRODUCTS[7], qty: 1, selectedSize: '6×8 in' }], tracking: null, address: { name: 'Karthik N', line1: 'Devotional Street', city: 'Kallakurichi', state: 'Tamil Nadu', pincode: '605702', phone: '7373646180' } },
]

export const COUPONS = [
  { code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 500, description: '10% off on your first order' },
  { code: 'DIWALI20', discount: 20, type: 'percent', minOrder: 1000, description: '20% off on Diwali collection' },
  { code: 'FLAT100', discount: 100, type: 'flat', minOrder: 799, description: '₹100 off on orders above ₹799' },
]
