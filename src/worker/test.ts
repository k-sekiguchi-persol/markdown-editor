const worker: Worker = self as any

worker.addEventListener('message', (event) => {
  console.log('Worker Received:', event.data)

  let count: number = 1
  while (count < 1_000_000_000) { // 最初から大きな値を入れないでください！
    count++
  }

  worker.postMessage({ result: event.data })
})
