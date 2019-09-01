import './style.css'

const pageNavLinks = [
  document.querySelector('.page-nav__trigger'),
  ...document.querySelectorAll('.page-nav__link')
]

const pageNav = document.querySelector('.page-nav')

for (const navLink of pageNavLinks) {
  navLink.addEventListener('focus', (event) => {
    pageNav.classList.add('page-nav--open')
  })

  navLink.addEventListener('click', (event) => {
    if (event.currentTarget.classList.contains('page-nav__trigger')) {
      event.preventDefault()
    }

    pageNav.classList.toggle('page-nav--open')
  })
}

const bodyHandler = (event) => {
  if (pageNav.classList.contains('page-nav--open')) {
    if (!event.target || !pageNav.contains(event.target)) {
      pageNav.classList.remove('page-nav--open')
    }
  }
}

document.querySelector('body').addEventListener('click', bodyHandler)
document.querySelector('body').addEventListener('focusin', bodyHandler)
