import cs from 'classnames'
import isNull from 'lodash/isNull'
import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'
import { z } from 'zod'

import Button from 'ui/Button'
import Icon from 'ui/Icon'

const LOCAL_STORE_ROOT_KEY = 'dismissed-top-banners' as const

const variants = {
  default: {
    icon: 'exclamationCircle',
    iconColor: '',
    symbol: 0,
    bgColor: 'bg-ds-gray-primary',
  },
  excitement: {
    icon: '',
    iconColor: '',
    symbol: 127881,
    bgColor: 'bg-ds-gray-primary',
  },
  warning: {
    icon: 'exclamationTriangle',
    symbol: 0,
    iconColor: 'text-ds-primary-yellow',
    bgColor: 'bg-orange-100',
  },
} as const

type Variants = keyof typeof variants

const topBannerContext = z.object({
  variant: z.union([
    z.literal('default'),
    z.literal('warning'),
    z.literal('excitement'),
  ]),
  localStorageKey: z.string(),
  setHideBanner: z.function().args(z.boolean()).returns(z.void()),
})

type TopBannerContextValue = z.infer<typeof topBannerContext>

const TopBannerContext = createContext<TopBannerContextValue | null>(null)

/*
 * WARNING: not for use outside of this hook, only exported for testing purposes
 */
export const useTopBannerContext = () => {
  const rawContext = useContext(TopBannerContext)

  const context = topBannerContext.safeParse(rawContext)

  if (!context.success) {
    throw new Error(
      'useTopBannerContext has to be used within `<TopBannerContext.Provider>`'
    )
  }

  return context.data
}

const DismissButton: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { localStorageKey, setHideBanner } = useTopBannerContext()

  return (
    <>
      {/* @ts-ignore */}
      <Button
        variant="plain"
        hook={`dismiss-${localStorageKey}`}
        onClick={() => {
          const currentStore = localStorage.getItem(LOCAL_STORE_ROOT_KEY)

          if (isNull(currentStore)) {
            localStorage.setItem(
              LOCAL_STORE_ROOT_KEY,
              JSON.stringify({ [localStorageKey]: 'true' })
            )
          } else {
            localStorage.setItem(
              LOCAL_STORE_ROOT_KEY,
              JSON.stringify({
                ...JSON.parse(currentStore),
                [localStorageKey]: 'true',
              })
            )
          }

          setHideBanner(true)
        }}
      >
        {children}
      </Button>
    </>
  )
}

const End: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-1 items-center justify-end gap-2">{children}</div>
  )
}

const Start: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { variant } = useTopBannerContext()
  return (
    <div className="flex grow-0 items-center gap-1 pb-2 md:pb-0">
      <span
        className={cs(
          'pr-2 md:pr-0',
          variants[variant]?.iconColor ?? variants[variant].iconColor
        )}
      >
        {variants[variant]?.icon ? (
          <Icon name={variants[variant].icon} size="md" variant="outline" />
        ) : (
          <span className="text-xl">
            {String.fromCodePoint(variants[variant]?.symbol)}
          </span>
        )}
      </span>
      <span>{children}</span>
    </div>
  )
}

interface TopBannerProps {
  variant?: Variants
  localStorageKey: string
}

const TopBannerRoot: React.FC<React.PropsWithChildren<TopBannerProps>> = ({
  variant = 'default',
  localStorageKey,
  children,
}) => {
  const [hideBanner, setHideBanner] = useState(() => {
    const rawStore = localStorage.getItem(LOCAL_STORE_ROOT_KEY)
    if (rawStore) {
      const store = JSON.parse(rawStore)
      if (store[localStorageKey] === 'true') {
        return true
      }
    }

    return false
  })

  if (hideBanner) {
    return null
  }

  return (
    <TopBannerContext.Provider
      value={{ variant, localStorageKey, setHideBanner }}
    >
      <div
        data-testid="top-banner-root"
        className={cs(
          'h-fit w-full px-4 py-2 lg:inline-flex lg:min-h-[38px]',
          variants[variant].bgColor
        )}
      >
        {children}
      </div>
    </TopBannerContext.Provider>
  )
}

TopBannerRoot.propTypes = {
  variant: PropTypes.oneOf(['default', 'warning', 'excitement']),
  localStorageKey: PropTypes.string.isRequired,
}

export const TopBanner = Object.assign(TopBannerRoot, {
  DismissButton,
  Start,
  End,
})
