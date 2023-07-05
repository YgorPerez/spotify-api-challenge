function formatFollowers(input: number) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(input)
}

export default formatFollowers
