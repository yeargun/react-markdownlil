import 'katex/dist/katex.min.css'
import remarkGfm from '@itslil/remark-gfm'
import remarkMath from '@itslil/remark-math'
import rehypeKatex from '@itslil/rehype-katex'
export {default as Markdown} from '@itslil/react-markdown'
export const name = 'lil-full'
export const remarkPlugins = [remarkGfm, remarkMath]
export const rehypePlugins = [rehypeKatex]
