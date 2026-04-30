const https = require('https')

const BASE_URL = 'mammas-backend-production.up.railway.app'

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null
    const options = {
      hostname: BASE_URL,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(body && { 'Content-Length': Buffer.byteLength(body) })
      }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function main() {
  console.log('Logging in...')
  const auth = await request('POST', '/auth/token/emailpass', {
    email: 'admin@mammasmaternity.in',
    password: 'Mammas@2026'
  })
  
  if (!auth.token) {
    console.log('Login failed:', auth)
    return
  }
  
  console.log('Login successful!')
  const token = auth.token

  const products = [
    {
      title: 'Nursing Kurti — Lavender Bloom',
      description: 'Soft and comfortable nursing kurti perfect for new mammas. Features discreet feeding access with beautiful lavender print.',
      status: 'published',
      options: [{ title: 'Size', values: ['XS','S','M','L','XL','XXL'] }],
      variants: [
        { title: 'XS', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'XS' }, inventory_quantity: 10 },
        { title: 'S', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 15 },
        { title: 'M', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 20 },
        { title: 'L', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 15 },
        { title: 'XL', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 10 },
        { title: 'XXL', prices: [{ amount: 129900, currency_code: 'inr' }], options: { Size: 'XXL' }, inventory_quantity: 8 }
      ]
    },
    {
      title: 'Maternity Wrap Dress — Blush Pink',
      description: 'Elegant wrap dress designed for expecting mammas. Adjustable tie waist grows with your bump beautifully.',
      status: 'published',
      options: [{ title: 'Size', values: ['XS','S','M','L','XL'] }],
      variants: [
        { title: 'XS', prices: [{ amount: 179900, currency_code: 'inr' }], options: { Size: 'XS' }, inventory_quantity: 8 },
        { title: 'S', prices: [{ amount: 179900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 12 },
        { title: 'M', prices: [{ amount: 179900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 15 },
        { title: 'L', prices: [{ amount: 179900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 12 },
        { title: 'XL', prices: [{ amount: 179900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 8 }
      ]
    },
    {
      title: 'Comfort Leggings — Cloud Soft',
      description: 'Ultra soft maternity leggings with full belly support panel. Perfect for all day comfort during pregnancy.',
      status: 'published',
      options: [{ title: 'Size', values: ['XS','S','M','L','XL','XXL'] }],
      variants: [
        { title: 'XS', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'XS' }, inventory_quantity: 20 },
        { title: 'S', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 25 },
        { title: 'M', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 30 },
        { title: 'L', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 25 },
        { title: 'XL', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 20 },
        { title: 'XXL', prices: [{ amount: 79900, currency_code: 'inr' }], options: { Size: 'XXL' }, inventory_quantity: 15 }
      ]
    },
    {
      title: 'Feeding Bra — Gentle Hold',
      description: 'Supportive nursing bra with easy one-hand clip access. Soft fabric gentle on sensitive skin.',
      status: 'published',
      options: [{ title: 'Size', values: ['32B','34B','36B','34C','36C','38C'] }],
      variants: [
        { title: '32B', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '32B' }, inventory_quantity: 15 },
        { title: '34B', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '34B' }, inventory_quantity: 20 },
        { title: '36B', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '36B' }, inventory_quantity: 18 },
        { title: '34C', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '34C' }, inventory_quantity: 15 },
        { title: '36C', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '36C' }, inventory_quantity: 12 },
        { title: '38C', prices: [{ amount: 64900, currency_code: 'inr' }], options: { Size: '38C' }, inventory_quantity: 10 }
      ]
    },
    {
      title: 'Belly Support Panty — Soft Touch',
      description: 'Full coverage maternity panty with gentle belly support. Breathable cotton blend for all day comfort.',
      status: 'published',
      options: [{ title: 'Size', values: ['S','M','L','XL','XXL'] }],
      variants: [
        { title: 'S', prices: [{ amount: 54900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 25 },
        { title: 'M', prices: [{ amount: 54900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 30 },
        { title: 'L', prices: [{ amount: 54900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 25 },
        { title: 'XL', prices: [{ amount: 54900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 20 },
        { title: 'XXL', prices: [{ amount: 54900, currency_code: 'inr' }], options: { Size: 'XXL' }, inventory_quantity: 15 }
      ]
    },
    {
      title: 'Maternity Kurti — Sage Bloom',
      description: 'Breathable cotton kurti in beautiful sage green. Side slits for easy nursing access post delivery.',
      status: 'published',
      options: [{ title: 'Size', values: ['XS','S','M','L','XL','XXL'] }],
      variants: [
        { title: 'XS', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'XS' }, inventory_quantity: 10 },
        { title: 'S', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 15 },
        { title: 'M', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 20 },
        { title: 'L', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 15 },
        { title: 'XL', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 10 },
        { title: 'XXL', prices: [{ amount: 119900, currency_code: 'inr' }], options: { Size: 'XXL' }, inventory_quantity: 8 }
      ]
    },
    {
      title: 'Nursing Dress — Pearl White',
      description: 'Elegant nursing dress perfect for special occasions. Hidden zip nursing access keeps it stylish and functional.',
      status: 'published',
      options: [{ title: 'Size', values: ['XS','S','M','L','XL'] }],
      variants: [
        { title: 'XS', prices: [{ amount: 189900, currency_code: 'inr' }], options: { Size: 'XS' }, inventory_quantity: 8 },
        { title: 'S', prices: [{ amount: 189900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 10 },
        { title: 'M', prices: [{ amount: 189900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 12 },
        { title: 'L', prices: [{ amount: 189900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 10 },
        { title: 'XL', prices: [{ amount: 189900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 8 }
      ]
    },
    {
      title: 'Maternity Palazzo Set — Dusty Sage',
      description: 'Comfortable palazzo pants with matching top. Elastic waistband adjusts throughout pregnancy.',
      status: 'published',
      options: [{ title: 'Size', values: ['S','M','L','XL','XXL'] }],
      variants: [
        { title: 'S', prices: [{ amount: 149900, currency_code: 'inr' }], options: { Size: 'S' }, inventory_quantity: 12 },
        { title: 'M', prices: [{ amount: 149900, currency_code: 'inr' }], options: { Size: 'M' }, inventory_quantity: 15 },
        { title: 'L', prices: [{ amount: 149900, currency_code: 'inr' }], options: { Size: 'L' }, inventory_quantity: 12 },
        { title: 'XL', prices: [{ amount: 149900, currency_code: 'inr' }], options: { Size: 'XL' }, inventory_quantity: 10 },
        { title: 'XXL', prices: [{ amount: 149900, currency_code: 'inr' }], options: { Size: 'XXL' }, inventory_quantity: 8 }
      ]
    }
  ]

  for (const product of products) {
    console.log(`Creating: ${product.title}...`)
    const result = await request('POST', '/admin/products', product, token)
    if (result.product) {
      console.log(`✓ Created: ${result.product.title} (${result.product.id})`)
    } else {
      console.log(`✗ Failed:`, result)
    }
    await new Promise(r => setTimeout(r, 500))
  }
  
  console.log('\nAll products created!')
}

main().catch(console.error)
