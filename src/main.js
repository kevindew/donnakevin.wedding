// CSS needs to be here for some webpack reason
import './style.css'

// polyfills for IE11
import 'core-js/features/promise'
import 'core-js/features/symbol'
import 'core-js/features/symbol/iterator'
import 'element-closest/browser'
import 'formdata-polyfill'
import 'url-search-params-polyfill'
import 'whatwg-fetch'

import './menu'
import './rsvp'
import './gifts'
