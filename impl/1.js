function Honor (fn) {
  let state = 'PENDING'
  let value
  const handlers = []

  const onFulfill = (handler) => {
    if (state === 'PENDING') {
      handlers.push(handler)
    } else {
      handler(state, value)
    }
  }

  const fulfill = (newState, newValue) => {
    state = newState
    value = newValue
    handlers.forEach((handler) => handler(state, value))
  }

  const resolve = (value) => fulfill('RESOLVED', value)
  const reject = (reason) => fulfill('REJECTED', reason)

  setImmediate(() => {
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  })

  return {
    then (handler) {
      return Honor((resolve, reject) => {
        onFulfill((state, value) => {
          // Parent promise already reject. Reject too to let a catch handle this
          if (state === 'REJECTED') {
            reject(value)

            return
          }

          try {
            // Run the handler
            const res = handler(value)
            // If returns another promise, wait for this new promise to resolve/reject
            if (res?.then) {
              res.then(resolve).catch(reject)
            } else {
              // If returns a value. Resolve!
              resolve(res)
            }
          } catch (e) {
            // Something went wrong. Reject!
            reject(e)
          }
        })
      })
    },

    catch (handler) {
      return Honor((resolve, reject) => {
        onFulfill((state, value) => {
          if (state === 'RESOLVED') {
            resolve(value)
            return
          }
          try {
            const res = handler(value)
            if (res?.then) {
              res.then(resolve).catch(reject)
            } else {
              resolve(res)
            }
          } catch (e) {
            reject(e)
          }
        })
      })
    }
  }
}

const logAndAdd = (value) => {
  console.log(`The value is: ${value}`)
  if (typeof value === 'number') {
    return value + 1
  } else {
    return -5
  }
}

const logAndThrow = (value) => {
  console.log(`The value is: ${value}`)
  throw new Error('Something happened.')
}

const yeet = Honor((resolve, reject) => {
  setTimeout(() => {
    console.log('Hello, Honor!')
    resolve(1)
  }, 1000)
})
  .then(logAndAdd)
  .then(logAndAdd)
  .then(logAndThrow)
  .catch(logAndAdd)
  .then(logAndAdd)
