import { injectable } from 'tsyringe'


@injectable()
export class OllamaServiceSettings {
  public embeddingModel = 'mxbai-embed-large'
  public completionModel = 'llama2'
  constructor(
    public baseUrl: string
  ) {
  }
}

@injectable()
export class ChromaDbEmbeddingSettings {
  constructor(
    public documentChunkSize: number = 500
  ) {
  }
}