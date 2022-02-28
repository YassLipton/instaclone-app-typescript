import React, { FunctionComponent, ReactElement, ReactNode, RefObject, useEffect, useState } from 'react'
import { View as DefaultView, Text as DefaultText, TouchableOpacity as DefaultTouchableOpacity, StyleSheetProperties, ViewStyle, TextStyle, ColorValue, TextProps, ViewProps, NativeTouchEvent } from 'react-native'
import ThemeContext from '../context/theme-context'

export const View = (props: {
  children?: ReactNode,
  isBackgrounded?: boolean,
  isPrimary?: boolean,
  isSecondary?: boolean,
  isWhite?: boolean,
  isCard?: boolean,
  style?: ViewStyle,
  ref?: () => RefObject<DefaultView>
}) => {
  const {setMode, mode, theme} = React.useContext(ThemeContext)
  const {primary, secondary, card, background} = theme.colors
  const {
    children,
    isBackgrounded,
    isPrimary,
    isSecondary,
    isWhite,
    isCard,
    style,
    ...rest
  } = props
  let backgroundColor

  if (isBackgrounded) {
    backgroundColor = background
  }

  if (isPrimary) {
    backgroundColor = primary
  }

  if (isSecondary) {
    backgroundColor = secondary
  }

  if (isWhite) {
    backgroundColor = 'white'
  }

  if (isCard) {
    backgroundColor = card
  }

  return (
    <DefaultView
      {...rest}
      style={[
        {
          backgroundColor
        },
        style,
      ]}>
      {children}
    </DefaultView>
  )
}

export const TouchableOpacity = (props: {
  children?: ReactNode,
  isBackgrounded?: boolean,
  isPrimary?: boolean,
  isSecondary?: boolean,
  isWhite?: boolean,
  isCard?: boolean,
  style?: ViewStyle,
  onPress?: (props: { nativeEvent: NativeTouchEvent }) => void,
  disabled?: boolean
}) => {
  const {setMode, mode, theme} = React.useContext(ThemeContext)
  const {primary, secondary, card, background} = theme.colors
  const [backgroundColor, setBackgroundColor] = useState<string>()
  const {
    children,
    isBackgrounded,
    isPrimary,
    isSecondary,
    isWhite,
    isCard,
    style,
    ...rest
  } = props

  if (isBackgrounded) {
    setBackgroundColor(background)
  }

  if (isPrimary) {
    setBackgroundColor(primary)
  }

  if (isSecondary) {
    setBackgroundColor(secondary)
  }

  if (isWhite) {
    setBackgroundColor('white')
  }

  if (isCard) {
    setBackgroundColor(card)
  }

  return (
    <DefaultTouchableOpacity
      {...rest}
      style={[
        {
          backgroundColor
        },
        style,
      ]}>
      {children}
    </DefaultTouchableOpacity>
  )
}

export const Text = (props: {
  children?: string | ReactNode,
  isPrimary?: boolean,
  isSecondary?: boolean,
  isWhite?: boolean,
  isBlack?: boolean,
  isBold?: boolean,
  isHeadingTitle?: boolean,
  isCenter?: boolean,
  hasMargin?: boolean,
  style?: TextStyle,
  numberOfLines?: number,
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
  onPress?: (props: { nativeEvent: NativeTouchEvent }) => void
}) => {
  const {setMode, mode, theme} = React.useContext(ThemeContext)
  const {primary, secondary, text} = theme.colors
  // const [color, setColor] = useState<string>(text)
  const [fontSize, setFontSize] = useState<number>(14)
  const [textAlign, setTextAlign] = useState<"auto" | "left" | "right" | "center" | "justify" | undefined>()
  const [marginTop, setMarginTop] = useState<number>(0)

  const {
    children,
    isPrimary,
    isSecondary,
    isWhite,
    isBlack,
    isBold,
    isHeadingTitle,
    isCenter,
    hasMargin,
    style,
    ...rest
  } = props

  let color = text

  const fontWeight = isBold ? 'bold' : 'normal'

  if (isSecondary) {
    color = secondary
  }

  if (isHeadingTitle) {
    setFontSize(20)
  }

  if (isPrimary) {
    color = primary
  }

  if (isWhite) {
    color = 'white'
  }

  if (isBlack) {
    color = 'black'
  }

  if (isCenter) {
    setTextAlign('center')
  }

  if (hasMargin) {
    setMarginTop(10)
  }

  return (
    <DefaultText
      {...rest}
      style={[
        {
          color,
          fontWeight,
          fontSize,
          marginTop,
          textAlign,
        },
        style,
      ]}>
      {children}
    </DefaultText>
  )
}