import type {ReactElement, ReactNode} from "react"

export type AllowElement = (
  element: unknown,
  index: number,
  parent: unknown,
) => boolean | null | undefined

export type UrlTransform = (
  url: string,
  key: string,
  node: unknown,
) => string | null | undefined

export interface Options {
  allowElement?: AllowElement | null
  allowedElements?: ReadonlyArray<string> | null
  children?: string | null
  components?: Record<string, unknown> | null
  disallowedElements?: ReadonlyArray<string> | null
  rehypePlugins?: unknown[] | null
  remarkPlugins?: unknown[] | null
  remarkRehypeOptions?: Record<string, unknown> | null
  skipHtml?: boolean | null
  unwrapDisallowed?: boolean | null
  urlTransform?: UrlTransform | null
}

export interface HooksOptions extends Options {
  fallback?: ReactNode | null
}

export function Markdown(options: Options): ReactElement
export function MarkdownAsync(options: Options): Promise<ReactElement>
export function MarkdownHooks(options: HooksOptions): ReactNode
export function defaultUrlTransform(value: string): string
export default Markdown
