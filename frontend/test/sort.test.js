// it('Max should work as expected', () => {
//   expect(Math.max(1, 2)).toBe(2)
// })

// function combinedSort (a, b) {
//   if (!a && !b) {
//     return 0
//   }
//   if (!a) {
//     return -1
//   }
//   if (!b) {
//     return 1
//   }
//   const numRegexp = /\d+/
//   const aNumPart = numRegexp.exec(a)
//   const bNumPart = numRegexp.exec(b)
//   // extract number parts
//   if (a < b) {
//     return -1
//   } else if (a > b) {
//     return 1
//   }
//   // a must be equal to b
//   return 0
// }

// it('should just work', () => {
//   const matches = 'J 1234 regular'.matchAll(/\d+/g)
//   console.log('matches', matches)
//   expect(matches).toBe(true)
// })

// it('should work with matchAll', () => {
//   const regexp = /bar/g
//   const str = 'foobarfoobar'

//   const matches = [...str.matchAll(regexp)]
//   matches.forEach((match) => {
//     console.log('match found at ' + match.index + ' , but unfortunately without end index.')
//   })
// })

// it('should work with regex exec', () => {
//   const regexp = /foo[a-z]*/g
//   const str = 'table football, foosball'
//   let match

//   while ((match = regexp.exec(str)) !== null) {
//     console.log(
//     `Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`
//     )
//   }
// // Found football start=6 end=14.
// // Found foosball start=16 end=24.
// })
