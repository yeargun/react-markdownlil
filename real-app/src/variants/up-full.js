import 'katex/dist/katex.min.css'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
export {default as Markdown} from 'react-markdown'
export const name = 'up-full'
export const remarkPlugins = [remarkGfm, remarkMath]
export const rehypePlugins = [rehypeKatex]
