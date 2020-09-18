function Honour (handler) {
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

const myHonour = Honour((resolve) => {
  setTimeout(() => {
    resolve(5)
  }, 1000)
})

myHonour.then((r) => {
  console.log(`r is ${r}`)
})
