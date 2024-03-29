const querystring = require('querystring')
const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_API_KEY)

exports.handler = async (event) => {
  const query = querystring.parse(event.body)
  const amount = parseFloat(query.amount) || 0
  const name = (query.name || '').trim()
  const message = (query.message || '').trim()

  const cancelQuery = querystring.stringify({ amount, name, message })
  const cancelUrl = `https://donnakevin.wedding/?${cancelQuery}#gifts-form`

  if (amount < 1 || name.trim() === '') {
    return { statusCode: 303, headers: { Location: cancelUrl } }
  }

  const description = [message.trim(), name.trim()].filter(p => p !== '').join(' - ')

  const session = await stripe.checkout.sessions.create({
    success_url: 'https://donnakevin.wedding/#gifts-thanks',
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
          metadata: { from: name, message: message }
        },
        unit_amount: Math.round(amount * 100)
      },
      quantity: 1
    }]
  })

  return { statusCode: 303, headers: { Location: session.url } }
}
