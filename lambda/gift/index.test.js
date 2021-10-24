/* eslint-env jest */
const mockSession = { url: 'https://stripe/checkout' }
const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn(() => mockSession)
    }
  }
}

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe)
})

const { handler } = require('./index')
const querystring = require('querystring')

test('creates a stripe session and redirects to it', async () => {
  const query = querystring.stringify({
    amount: '123.45',
    name: 'Joe Bloggs',
    message: 'Happy wedding'
  })
  const response = await handler({ body: query })

  expect(response).toMatchObject({ statusCode: 303, headers: { Location: mockSession.url } })
})

test('it creates a stripe session with the normalised parameters', async () => {
  const query = querystring.stringify({
    amount: '123.456789.123',
    name: '  Joe  ',
    message: '  Happy wedding  '
  })

  await handler({ body: query })

  expect(mockStripe.checkout.sessions.create).toHaveBeenLastCalledWith(expect.objectContaining({
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: 'Wedding Gift',
          description: 'Happy wedding - Joe',
          metadata: {
            from: 'Joe',
            message: 'Happy wedding'
          }
        },
        unit_amount: 12346
      },
      quantity: 1
    }]
  }))
})

test('it rejects an invalid amount', async () => {
  const query = querystring.stringify({
    amount: 'blah',
    name: 'Steve'
  })
  const response = await handler({ body: query })

  expect(response).toMatchObject({ statusCode: 303, headers: { Location: 'https://donnakevin.wedding/?amount=0&name=Steve&message=#gifts-form' } })
})

test('it rejects an amount less than 1', async () => {
  const query = querystring.stringify({
    amount: '0.55',
    name: 'Steve'
  })
  const response = await handler({ body: query })

  expect(response).toMatchObject({ statusCode: 303, headers: { Location: 'https://donnakevin.wedding/?amount=0.55&name=Steve&message=#gifts-form' } })
})

test('it rejects an empty name', async () => {
  const query = querystring.stringify({
    amount: '12',
    name: '  '
  })
  const response = await handler({ body: query })

  expect(response).toMatchObject({ statusCode: 303, headers: { Location: 'https://donnakevin.wedding/?amount=12&name=&message=#gifts-form' } })
})
