import {defaultUrlTransform} from '@itslil/react-markdown'
document.body.textContent = defaultUrlTransform('javascript:alert(1)') + '|' + defaultUrlTransform('https://a.b/')
