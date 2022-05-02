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

  const valid = validateRsvp()

  if (valid) {
    const button = form.querySelector('button[type=submit]')
    button.dataset.original = button.textContent
    button.textContent = 'Sending...'
    button.disabled = true
    const oldWrapper = form.closest('.wrapper')
    const rsvpOver = document.querySelector('#rsvp-over')
    const newWrapper = rsvpOver.querySelector('.wrapper')
    oldWrapper.parentNode.replaceChild(newWrapper, oldWrapper)
    rsvpOver.parentNode.removeChild(rsvpOver)
    newWrapper.scrollIntoView({ behavior: 'smooth' })
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
    nameError.textContent = 'Please fill in this field'
    name.parentNode.appendChild(nameError)

    valid = false
  } else {
    nameFieldset.classList.remove('form__fieldset--error')
  }

  return valid
}
