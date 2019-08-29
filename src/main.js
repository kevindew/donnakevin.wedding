import './style.css'
// polyfill for IE Element.prototype.closest
import 'element-closest'

const pageNavLinks = [
  document.querySelector('.page-nav__trigger'),
  ...document.querySelectorAll('.page-nav__link')
]

for (const navLink of pageNavLinks) {
  navLink.addEventListener('click', (event) => {
    if (event.currentTarget.classList.contains('page-nav__trigger')) {
      event.preventDefault()
    }

    const nav = event.currentTarget.closest('.page-nav')
    if (nav) {
      nav.classList.toggle('page-nav--open')
    }
  })
}
