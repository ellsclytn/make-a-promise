function Promise (handler) {
  debugger
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
      onFulfillment((value) => {
        if (state === 'RESOLVED') {
          thenHandler(value)
        }
      })
    },
    catch: () => {
      // TODO: Implement
    }
  }
}

const myPromise = Promise((resolve) => {
  setTimeout(() => {
    resolve('Hello, world!')
  }, 1000)
})

myPromise.then((r) => {
  console.log(`r is ${r}`)
})
