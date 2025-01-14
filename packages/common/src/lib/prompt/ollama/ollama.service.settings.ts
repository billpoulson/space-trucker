import { injectable } from 'tsyringe'


@injectable()
export class OllamaServiceSettings {
  constructor(
    public baseUrl: string 
  ) {
  }
}
