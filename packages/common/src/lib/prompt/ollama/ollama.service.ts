import axios, { AxiosInstance } from 'axios'
import { injectable } from 'tsyringe'
import { processStream } from '../../http/process-stream'
import { OllamaServiceSettings } from './ollama.service.settings'
type ConversationHistoryEntry = { role: string, content: string }

@injectable()
export class OllamaService {
  api: AxiosInstance
  history: Array<ConversationHistoryEntry> = []

  constructor({ baseUrl }: OllamaServiceSettings) {
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setHistory(
    history: { role: string; content: string }[],
  ) {
    this.history = history
  }

  // Generate a response while maintaining conversation history
  async chat(
    model: string,
    onData: (response: string) => void,
    onDone?: () => void
  ) {
    if (this.history.length > 100) { this.history.shift() }

    const response =
      await this.api.post('/chat',
        {
          model,
          messages: this.history,
        },
        {
          responseType: 'stream',
        }
      )

    await processStream(response.data, onData, onDone)
  }

  // Generate a simple response
  async generate(
    prompt: string,
    model: string,
    onData: (response: string) => void,
    onDone?: () => void
  ) {
    const response = await this.api.post(
      '/generate',
      {
        model,
        prompt,
      },
      {
        responseType: 'stream',
      }
    )

    await processStream(response.data, onData, onDone)
  }

  // Fetch a generic stream
  async fetchStream(url: string) {
    const response = await axios.get(url, {
      responseType: 'stream',
    })

    await processStream(response.data, (chunk) => {
      console.log('Received chunk:', chunk)
    })
  }

}
