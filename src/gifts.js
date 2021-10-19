const gifts = document.querySelector('#gifts')
const blurb = document.querySelector('.gifts-blurb')
const form = document.querySelector('.gifts-form')

function showForm (event) {
  if (event) event.preventDefault()

  blurb.style.display = 'none'
  blurb.setAttribute('hidden', '')
  blurb.setAttribute('aria-hidden', 'true')

  form.style.display = 'block'
  form.removeAttribute('hidden')
  form.setAttribute('aria-hidden', 'false')
}

function showBlurb (event) {
  if (event) event.preventDefault()

  form.style.display = 'none'
  form.setAttribute('hidden', '')
  form.setAttribute('aria-hidden', 'true')

  blurb.style.display = 'block'
  blurb.removeAttribute('hidden')
  blurb.setAttribute('aria-hidden', 'false')

  gifts.scrollIntoView({ behavior: 'smooth' })
}

function formSubmit (event) {
  const valid = validateForm()
  if (!valid) event.preventDefault()
}

function assumePreviousSubmission (params) {
  showForm()

  const amount = parseFloat(params.get('amount'))
  if (amount > 0) form.elements.amount.value = amount
  const name = params.get('name').trim()
  if (name !== '') form.elements.name.value = name
  const message = params.get('message').trim()
  if (message !== '') form.elements.message.value = message

  validateForm()
}

function validateForm () {
  const amountField = form.elements.amount
  const nameField = form.elements.name
  const invalidFields = []

  for (const error of form.querySelectorAll('.form__error')) {
    error.parentNode.removeChild(error)
  }

  if (amountField.value.trim() === '' || parseFloat(amountField.value) < 1) {
    amountField.closest('fieldset').classList.add('form__fieldset--error')

    const amountError = document.createElement('label')
    amountError.setAttribute('for', amountField.id)
    amountError.classList.add('form__error')
    amountError.textContent = amountField.value.trim() === '' ? 'Please fill in this field' : 'Please enter a number greater than 1'
    amountField.parentNode.appendChild(amountError)

    invalidFields.push(amountField)
  } else {
    amountField.closest('fieldset').classList.remove('form__fieldset--error')
  }

  if (nameField.value.trim() === '') {
    nameField.closest('fieldset').classList.add('form__fieldset--error')

    const nameError = document.createElement('label')
    nameError.setAttribute('for', amountField.id)
    nameError.classList.add('form__error')
    nameError.textContent = 'Please fill in this field'
    nameField.parentNode.appendChild(nameError)

    invalidFields.push(nameField)
  } else {
    nameField.closest('fieldset').classList.remove('form__fieldset--error')
  }

  if (invalidFields.length > 0) {
    invalidFields[0].focus()
  }

  return invalidFields.length === 0
}

const blurbTrigger = document.querySelector('.gifts-blurb__trigger')
if (blurbTrigger) blurbTrigger.addEventListener('click', showForm)

const cancelTrigger = document.querySelector('.gifts-form__cancel')
if (cancelTrigger) cancelTrigger.addEventListener('click', showBlurb)

if (form) form.addEventListener('submit', formSubmit)

const params = new URLSearchParams(window.location.search)
if (params.has('amount')) assumePreviousSubmission(params)
