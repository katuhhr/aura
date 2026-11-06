const colorSwatches = {
  black: '#1f1a1a',
  white: '#ffffff',
  cream: '#efe6da',
  beige: '#cdb89f',
  grey: '#9a9a9a',
  gray: '#9a9a9a',
  burgundy: '#6b1a2a',
  navy: '#27324a',
  brown: '#6a4a36',
  'чёрный': '#1f1a1a',
  'черный': '#1f1a1a',
  'белый': '#ffffff',
  'молочный': '#efe6da',
  'бежевый': '#cdb89f',
  'серый': '#9a9a9a',
  'бордовый': '#6b1a2a',
  'тёмно-синий': '#27324a',
  'коричневый': '#6a4a36',
}

export function getColorSwatch(color) {
  const name = color?.trim().toLowerCase() ?? ''
  return Object.hasOwn(colorSwatches, name) ? colorSwatches[name] : name
}
