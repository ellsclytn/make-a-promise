function Promise (handler) {
  let state = 'PENDING'
  let value
  let fulfillmentHandler

  const fulfill = (newState, newValue) => {
    state = newState
    value = newValue
    fulfillmentHandler && fulfillmentHandler(value)
  }

  const onFulfillment = (newFulfillmentHandler) => {
    if (state === 'PENDING') {
      fulfillmentHandler = newFulfillmentHandler
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
  .then((r) => {
    console.log(r)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('oh noes'))
      }, 1000)
    })
  })
  .then(console.log)
  .catch(console.error)
