const formatText = (text: string, lenght: number) => {
  if (text && text.length > lenght) return `${text.substring(0, lenght - 3)}...`
  return text
}

export default formatText
