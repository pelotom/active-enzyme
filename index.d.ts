/// <reference types="cheerio" />

import {
  shallow as enzymeShallow,
  mount as enzymeMount,
  render as enzymeRender,
  CommonWrapper,
  ShallowWrapper,
  ReactWrapper,
} from 'enzyme'

import {
  ComponentClass,
  StatelessComponent,
  ReactElement,
  HTMLAttributes,
} from 'react'

// TODO type parameter for state?
export type ActiveWrapper<W> = W & { classes: { [name: string]: ActiveWrapper<W> } }

export interface Options<P> {
  defaultProps?: any // TODO use keyof P
  transform?: (props: P) => P
  classNames?: { [name: string]: string }
  enzymeOptions?: any
}

export const shallow: typeof enzymeShallow
export const mount: typeof enzymeMount
export const render: typeof enzymeRender

export function makeRenderer<P, W extends CommonWrapper<P, any>>(
  component: StatelessComponent<P> | ComponentClass<P>,
  options: Options<P> & { method: (node: ReactElement<P>, enzymeOptions?: any) => W },
): (props?: any /* TODO use keyof P */) => W

export type ActiveShallowWrapper = ActiveWrapper<ShallowWrapper<any, any>>
export type ActiveReactWrapper = ActiveWrapper<ReactWrapper<any, any>>
export type ActiveCheerioWrapper = ActiveWrapper<Cheerio>

export function makeShallowRenderer<P>(
  component: StatelessComponent<P> | ComponentClass<P>,
  options: Options<P>,
): (props?: any /* TODO use keyof P */) => ActiveShallowWrapper

export function makeFullRenderer<P>(
  component: StatelessComponent<P> | ComponentClass<P>,
  options: Options<P>,
): (props?: any /* TODO use keyof P */) => ActiveReactWrapper

export function makeStaticRenderer<P>(
  component: StatelessComponent<P> | ComponentClass<P>,
  options: Options<P>,
): (props?: any /* TODO use keyof P */) => ActiveCheerioWrapper