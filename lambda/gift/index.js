const querystring = require('querystring')
const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_API_KEY)

exports.handler = async (event) => {
  const query = querystring.parse(event.body)
  const amount = parseFloat(query.amount) || 0
  const name = query.name || ''
  const message = query.message || ''

  const cancelQuery = querystring.stringify({ name, amount, message })
  const cancelUrl = `http://localhost:8080/?${cancelQuery}#gifts-form`

  if (amount < 1 || name.trim() === '') {
    return { statusCode: 303, headers: { Location: cancelUrl } }
  }

  const description = [message.trim(), name.trim()].filter(p => p !== '').join(' - ')

  const session = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:8080/#gifts-thanks',
    cancel_url: cancelUrl,
    payment_method_types: ['card'],
    mode: 'payment',
    submit_type: 'donate',
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: 'Wedding Gift',
          description: description,
          metadata: {
            from: name.trim(),
            message: message.trim()
          }
        },
        unit_amount: Math.round(amount * 100)
      },
      quantity: 1
    }]
  })

  return { statusCode: 303, headers: { Location: session.url } }
}
