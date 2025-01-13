// Utility function for handling stream data
export const processStream = async (
  stream: any,
  onData: (data: any) => void,
  onDone?: () => void
): Promise<void> => {
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => {
      buffer += decoder.decode(chunk, { stream: true })

      let boundary = buffer.lastIndexOf('\n')
      if (boundary !== -1) {
        const lines = buffer.slice(0, boundary).split('\n')
        buffer = buffer.slice(boundary + 1)

        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            if (json.done) {
              onDone && onDone()
              resolve()
              return
            }
            onData(json.message?.content || json.response || json)
          } catch (error) {
            console.error('Error parsing JSON:', error, line)
          }
        }
      }
    })

    stream.on('end', () => {
      resolve()
    })

    stream.on('error', (error: any) => {
      console.error('Error in stream:', error)
      reject(error)
    })
  })
}
