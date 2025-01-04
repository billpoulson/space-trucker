export const unixTimestamp = () => ({ timestamp: +new Date() })
export const emptyString = ''
export const trimWhitespace = (value: string) => value.trim()
export const hasContent = ({ length }) => length > 0
