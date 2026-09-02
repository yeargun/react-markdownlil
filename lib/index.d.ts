import type {Element, Parents} from "hast"
import type {ComponentType, JSX, ReactElement, ReactNode} from "react"
import type {Options as RemarkRehypeOptions} from "remark-rehype"
import type {PluggableList} from "unified"

/**
 * Component to render markdown.
 *
 * This is a synchronous component.
 * When using async plugins, see `MarkdownAsync` or `MarkdownHooks`.
 */
export function Markdown(options: Readonly<Options>): ReactElement

/**
 * Component to render markdown with support for async plugins through
 * async/await.
 */
export function MarkdownAsync(options: Readonly<Options>): Promise<ReactElement>

/** Component to render markdown with support for async plugins through hooks. */
export function MarkdownHooks(options: Readonly<HooksOptions>): ReactNode

/** Make a URL safe. */
export function defaultUrlTransform(value: string): string

/** Filter elements. */
export type AllowElement = (
  element: Readonly<Element>,
  index: number,
  parent: Readonly<Parents> | undefined,
) => boolean | null | undefined

/** Extra fields passed to components. */
export type ExtraProps = {
  node?: Element | undefined
}

/** Map tag names to components. */
export type Components = {
  [Key in keyof JSX.IntrinsicElements]?:
    | ComponentType<JSX.IntrinsicElements[Key] & ExtraProps>
    | keyof JSX.IntrinsicElements
}

/** Deprecation metadata. */
export type Deprecation = {
  from: string
  id: string
  to?: keyof Options
}

/** Configuration. */
export type Options = {
  allowElement?: AllowElement | null | undefined
  allowedElements?: ReadonlyArray<string> | null | undefined
  children?: string | null | undefined
  components?: Components | null | undefined
  disallowedElements?: ReadonlyArray<string> | null | undefined
  rehypePlugins?: PluggableList | null | undefined
  remarkPlugins?: PluggableList | null | undefined
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions> | null | undefined
  skipHtml?: boolean | null | undefined
  unwrapDisallowed?: boolean | null | undefined
  urlTransform?: UrlTransform | null | undefined
}

/** Configuration specifically for `MarkdownHooks`. */
export type HooksOptionsOnly = {
  fallback?: ReactNode | null | undefined
}

/** Configuration for `MarkdownHooks`. */
export type HooksOptions = Options & HooksOptionsOnly

/** Transform all URLs. */
export type UrlTransform = (
  url: string,
  key: string,
  node: Readonly<Element>,
) => string | null | undefined
