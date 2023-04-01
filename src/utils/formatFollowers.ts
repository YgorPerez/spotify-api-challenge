function formatFollowers(input: number) {
  const ranges = [
    {
      divider: 1e3,
      suffix: 'K',
    },
    {
      divider: 1e6,
      suffix: 'M',
    },
    {
      divider: 1e9,
      suffix: 'B',
    },
  ]

  for (let index = ranges.length - 1; index >= 0; index--) {
    // @ts-ignore
    if (ranges[index]?.divider && input > ranges[index]?.divider) {
      // @ts-ignore
      let quotient = input / ranges[index].divider

      if (quotient < 10) {
        quotient = Math.floor(quotient * 10) / 10
      } else {
        quotient = Math.floor(quotient)
      }

      return quotient.toString() + ranges[index]?.suffix
    }
  }

  return input.toString()
}

export default formatFollowers
