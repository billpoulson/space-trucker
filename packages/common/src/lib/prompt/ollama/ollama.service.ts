import axios, { AxiosInstance } from 'axios'
import ollama from 'ollama'
import { injectable } from 'tsyringe'
import { OllamaServiceSettings } from './ollama.service.settings'
type ConversationHistoryEntry = { role: string, content: string }
@injectable()
export class OllamaService {
  api: AxiosInstance
  history: Array<ConversationHistoryEntry> = []
  settings: OllamaServiceSettings

  constructor(
    settings: OllamaServiceSettings
  ) {
    const { baseUrl } = settings
    this.settings = settings
    this.api = axios.create({
      baseURL: baseUrl,
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
  async chat() {
    if (this.history.length > 100) { this.history.shift() }
    return ollama.chat({
      model: this.settings.completionModel,
      messages: this.history,
    })
  }

  // Generate a simple response
  async generate(
    prompt: string
  ) {
    const responsxe = await ollama.generate({
      model: this.settings.completionModel,
      prompt,
    })
    return responsxe.response
  }

  // Generate embeddings from a prompt
  async embed(
    input: string
  ) {
    const response = await ollama.embed({
      model: this.settings.embeddingModel,
      input,
    })
    return response
  }

}
