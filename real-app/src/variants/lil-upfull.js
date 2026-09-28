// The port as a drop-in: the npm remark-gfm, remark-math and rehype-katex a user already has.
import 'katex/dist/katex.min.css'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
export {default as Markdown} from '@itslil/react-markdown'
export const name = 'lil-upfull'
export const remarkPlugins = [remarkGfm, remarkMath]
export const rehypePlugins = [rehypeKatex]
