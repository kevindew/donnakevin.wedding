import './style.css'

const pageNavTrigger = document.querySelector('.page-nav__trigger')

if (pageNavTrigger) {
  pageNavTrigger.addEventListener('click', (event) => {
    event.preventDefault()
  })
}
