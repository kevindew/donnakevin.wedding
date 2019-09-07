const pageNav = document.querySelector('.page-nav')

document.querySelector('.page-nav__trigger').addEventListener('click', (event) => {
  event.preventDefault()
  pageNav.classList.toggle('page-nav--open')
})

for (const navLink of document.querySelectorAll('.page-nav__link')) {
  navLink.addEventListener('focus', (event) => {
    pageNav.classList.add('page-nav--open')
  })

  navLink.addEventListener('click', (event) => {
    pageNav.classList.remove('page-nav--open')
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
document.querySelector('body').addEventListener('touchstart', bodyHandler)
