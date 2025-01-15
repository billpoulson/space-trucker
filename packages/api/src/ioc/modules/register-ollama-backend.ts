import { ChromaDbEmbeddingSettings, OllamaServiceSettings } from '@space-truckers/common'
import { Ollama } from 'ollama'
import { DependencyContainer } from 'tsyringe'


export function registerOllamaBackendForRoot(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(OllamaServiceSettings)
        .register(OllamaServiceSettings, { useValue: new OllamaServiceSettings(process.env['OLLAMA_BASEURL']!) })
        .registerSingleton(ChromaDbEmbeddingSettings)
        .register(ChromaDbEmbeddingSettings, { useValue: new ChromaDbEmbeddingSettings(500) })
        .registerSingleton(Ollama)
        .register(Ollama, {
            useFactory: (deps) => {
                const { baseUrl } = deps.resolve(OllamaServiceSettings)
                return new Ollama({
                    host: baseUrl
                })
            }
        })
}
