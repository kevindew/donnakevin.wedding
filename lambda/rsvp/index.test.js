/* eslint-env jest */
const mockSes = {
  sendEmail: jest.fn().mockReturnThis(),
  promise: jest.fn()
}

jest.mock('aws-sdk/clients/ses', () => {
  return jest.fn().mockImplementation(() => mockSes)
})

const querystring = require('querystring')
const { handler } = require('./index')

const submission = {
  name: 'Joe',
  attend: 'Yes',
  guests: 'None',
  dietary: 'Vegan',
  comment: "Let's party"
}

const sesParams = {
  Destination: {
    ToAddresses: ['kevindew@me.com', 'donna.carter72@yahoo.com']
  },
  Message: {
    Body: {
      Text: {
        Data: '\nName:\nJoe\n' +
          '\nAttend:\nYes\n' +
          '\nGuests:\nNone\n' +
          '\nDietary:\nVegan\n' +
          '\nComment:\nLet\'s party\n'
      }
    },
    Subject: {
      Data: 'RSVP received from Joe'
    }
  },
  Source: 'rsvp@donnakevin.wedding'
}

test('sends an email and returns a 204 for a JSON request', async () => {
  const response = await handler({
    body: JSON.stringify(submission),
    headers: { 'Content-Type': 'application/json' }
  })

  expect(mockSes.sendEmail).toHaveBeenCalledWith(sesParams)
  expect(response).toMatchObject({ statusCode: 204 })
})

test('sends an email and returns a redirect for a form submission', async () => {
  const response = await handler({
    body: querystring.stringify(submission),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  expect(mockSes.sendEmail).toHaveBeenCalledWith(sesParams)
  expect(response).toMatchObject({
    statusCode: 303,
    headers: { Location: 'https://donnakevin.wedding/#rsvp-thanks' }
  })
})
