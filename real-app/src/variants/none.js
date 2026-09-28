// Baseline: the same app with no markdown library (React + app shell only).
import {jsx} from 'react/jsx-runtime'
export const name = 'none'
export const Markdown = ({children}) => jsx('pre', {children})
export const remarkPlugins = []
export const rehypePlugins = []
