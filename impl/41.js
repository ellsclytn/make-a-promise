function Promise (handler) {
  let state = 'PENDING'
  let value
  const fulfillmentHandlers = []

  const fulfill = (newState, newValue) => {
    state = newState
    value = newValue
    fulfillmentHandlers.forEach((fh) => fh(value))
  }

  const onFulfillment = (newFulfillmentHandler) => {
    if (state === 'PENDING') {
      fulfillmentHandlers.push(newFulfillmentHandler)
    } else {
      newFulfillmentHandler(value)
    }
  }

  const resolve = (newValue) => fulfill('RESOLVED', newValue)
  const reject = (newValue) => fulfill('REJECTED', newValue)

  handler(resolve, reject)

  return {
    then: (thenHandler) => {
      return new Promise((resolve, reject) => {
        onFulfillment((value) => {
          if (state === 'REJECTED') {
            reject(value)

            return
          }

          const result = thenHandler(value)

          if (typeof result?.then === 'function') {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        })
      })
    },
    catch: (catchHandler) => {
      return new Promise((resolve, reject) => {
        onFulfillment((value) => {
          if (state === 'RESOLVED') {
            resolve(value)

            return
          }

          const result = catchHandler(value)

          if (typeof result?.then === 'function') {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        })
      })
    }
  }
}

const myPromise = Promise((resolve) => {
  setTimeout(() => {
    resolve('Hello, world!')
  }, 1000)
})

myPromise
  .then((r) => {
    console.log(`r is ${r}`)
    return 5
  })
  .then(console.log)

myPromise
  .then((r) => {
    console.log(`r is ${r}`)
    return 'oh hi'
  })
  .then(console.log)