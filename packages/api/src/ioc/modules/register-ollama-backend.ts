import { ChromaDbEmbeddingSettings, OllamaServiceSettings } from '@space-truckers/common'
import { DependencyContainer } from 'tsyringe'


export function registerOllamaBackend(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(OllamaServiceSettings)
        .register(OllamaServiceSettings, { useValue: new OllamaServiceSettings(process.env['OLLAMA_BASEURL']!) })
        .registerSingleton(ChromaDbEmbeddingSettings)
        .register(ChromaDbEmbeddingSettings, { useValue: new ChromaDbEmbeddingSettings() })
}
