const querystring = require('querystring')
const SES = require('aws-sdk/clients/ses')

exports.handler = async (event) => {
  let name, attend, guests, dietary, comment

  // in my testing I've experienced different header casings for different contexts :-(
  const json = event.headers['Content-Type'] === 'application/json' ||
    event.headers['content-type'] === 'application/json'

  if (json) {
    ({ name, attend, guests, dietary, comment } = JSON.parse(event.body))
  } else {
    ({ name, attend, guests, dietary, comment } = querystring.parse(event.body))
  }

  const message =
`
Name:
${name}

Attend:
${attend}

Guests:
${guests}

Dietary:
${dietary}

Comment:
${comment}
`
  const sesParams = {
    Destination: {
      ToAddresses: ['kevindew@me.com', 'donna.carter72@yahoo.com']
    },
    Message: {
      Body: {
        Text: {
          Data: message
        }
      },
      Subject: {
        Data: `RSVP received from ${name}`
      }
    },
    Source: 'rsvp@donnakevin.wedding'
  }

  const ses = new SES()
  await ses.sendEmail(sesParams).promise()

  if (json) {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
      }
    }
  } else {
    return {
      statusCode: 303,
      headers: {
        Location: 'https://donnakevin.wedding/#rsvp-thanks'
      }
    }
  }
}
