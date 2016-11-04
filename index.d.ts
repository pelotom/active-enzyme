import {
  shallow as enzymeShallow,
  mount as enzymeMount,
  render as enzymeRender,
  CommonWrapper,
} from 'enzyme'

import {
  ComponentClass,
  StatelessComponent,
  ReactElement,
  HTMLAttributes,
} from 'react'

// TODO type parameter for state?
export type ActiveWrapper<P> = CommonWrapper<P, any> & { classes: ClassWrappers }
export type ClassWrapper = ActiveWrapper<HTMLAttributes<{}>>
export type ClassWrappers = { [name: string]: ClassWrapper }

export interface Options<P> {
  method?: (node: ReactElement<P>, enzymeOptions?: any) => CommonWrapper<P, any>
  defaultProps?: any // TODO use keyof P
  transform?: (props: P) => P
  classNames?: { [name: string]: string }
  enzymeOptions?: any
}

export const shallow: typeof enzymeShallow
export const mount: typeof enzymeMount
export const render: typeof enzymeRender

export function makeRenderer<P>(
  component: StatelessComponent<P> | ComponentClass<P>,
  options: Options<P>,
): (props?: any /* TODO use keyof P */) => ActiveWrapper<P>