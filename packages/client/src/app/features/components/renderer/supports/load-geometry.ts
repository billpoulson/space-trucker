import { Observable } from 'rxjs'
import { BufferGeometry } from 'three'
import { STLLoader } from './stl-loader'

export function loadGeometry(modelPath: String) {
  return new Observable<BufferGeometry>((observer) => {
    const loader = new STLLoader()

    loader.load(modelPath,
      (geometry: BufferGeometry) => {
        observer.next(geometry)
        observer.complete()
      },
      (progress) => {
        // console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`)
      },
      (error) => {
        console.error('An error occurred while loading the STL file:', error)
        observer.error(error)
      }
    )

    // Cleanup on unsubscribe
    return () => {
    }
  })

}