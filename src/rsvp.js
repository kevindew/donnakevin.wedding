const form = document.querySelector('#rsvp-form')

const commentLabel = form.querySelector('#comment-label')
commentLabel.dataset.canAttend = commentLabel.innerHTML

for (const attendRadio of form.querySelectorAll('[name=attend]')) {
  attendRadio.addEventListener('change', event => {
    const canAttend = form.querySelector('#can-attend')

    if (event.target.value === 'no') {
      canAttend.style.display = 'none'
      commentLabel.innerHTML = commentLabel.dataset.cantAttend
    } else {
      canAttend.style.display = 'block'
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
    button.textContent = 'Sending...'
    button.disabled = true
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
