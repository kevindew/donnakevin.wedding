const form = document.querySelector('#rsvp-form')

const commentLabel = form.querySelector('#comment-label')
commentLabel.dataset.canAttend = commentLabel.innerHTML

for (const attendRadio of form.querySelectorAll('[name=attend]')) {
  attendRadio.addEventListener('change', event => {
    const canAttend = form.querySelector('#can-attend')
    const commentHint = form.querySelector('#comment-hint')

    if (event.target.value === 'no') {
      canAttend.style.display = 'none'
      commentHint.style.display = 'none'
      commentLabel.innerHTML = commentLabel.dataset.cantAttend
    } else {
      canAttend.style.display = 'block'
      commentHint.style.display = 'block'
      commentLabel.innerHTML = commentLabel.dataset.canAttend
    }
  })
}

let formSubmitting = false
form.addEventListener('submit', event => {
  if (formSubmitting) {
    event.preventDefault()
    return
  }
  formSubmitting = true

  hideFormFailed()
  const valid = validateRsvp()

  if (valid) {
    const button = form.querySelector('button[type=submit]')
    button.dataset.original = button.textContent
    button.textContent = 'Sending...'
    button.disabled = true
    sendFormData()
      .then(response => {
        if (response.ok) {
          return response
        }

        throw new Error(response)
      })
      .then(() => {
        const oldWrapper = form.closest('.wrapper')
        const rsvpThanks = document.querySelector('#rsvp-thanks')
        const newWrapper = rsvpThanks.querySelector('.wrapper')
        oldWrapper.parentNode.replaceChild(newWrapper, oldWrapper)
        rsvpThanks.parentNode.removeChild(rsvpThanks)
        newWrapper.scrollIntoView({ behavior: 'smooth' })
      })
      .catch(error => {
        console.error(error)
        showFormFailed()
        button.textContent = button.dataset.original
        button.disabled = false
        formSubmitting = false
      })
  } else {
    formSubmitting = false
  }

  event.preventDefault()
})

function validateRsvp () {
  let valid = true
  const name = form.querySelector('input[name=name]')
  const nameFieldset = name.closest('.form__fieldset')

  for (const error of form.querySelectorAll('.form__error')) {
    error.parentNode.removeChild(error)
  }

  if (name.value.trim() === '') {
    nameFieldset.classList.add('form__fieldset--error')
    name.focus()

    const nameError = document.createElement('label')
    nameError.setAttribute('for', name.id)
    nameError.classList.add('form__error')
    nameError.textContent = 'Plese fill in this field'
    name.parentNode.appendChild(nameError)

    valid = false
  } else {
    nameFieldset.classList.remove('form__fieldset--error')
  }

  return valid
}

function showFormFailed () {
  const el = document.createElement('div')
  el.id = 'rsvp-failed'
  el.setAttribute('role', 'alert')
  el.tabIndex = -1
  el.classList.add('rsvp-failed')
  el.innerHTML = `
    <h3 class="f3 tc mv3">Oops, something went wrong</h3>
    <p class="section-copy tc mv3">
      We didn't receive your response, please try again or
      email us at
      <a href="mailto:help@donnakevin.wedding?subject=Wedding%20RSVP"
         class="link link--error">help@donnakevin.wedding</a>
      </a>
    </p>
  `

  form.parentNode.insertBefore(el, form)
  el.focus()
}

function hideFormFailed () {
  const wrapper = form.parentNode
  const formFailed = wrapper.querySelector('#rsvp-failed')
  if (formFailed) {
    wrapper.removeChild(formFailed)
  }
}

function sendFormData () {
  const data = {}
  const formData = new window.FormData(form)
  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  return window.fetch(form.action, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}
