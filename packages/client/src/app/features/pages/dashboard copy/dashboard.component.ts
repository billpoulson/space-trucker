// import { HttpClient } from '@angular/common/http'
// import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core'
// import { MatTabChangeEvent } from '@angular/material/tabs'
// import { AuthService } from '@auth0/auth0-angular'
// import { AppMessageQueue } from '../../../core/mq/app-message-queue'
// import { activateSelectedTab } from '../../../core/util/activate-selected-tab'
// import { AccelerationCurveComponent } from '../../components/shared/acceleration-curve/acceleration-curve.component'

// @Component({
//   standalone: false,
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DashboardPageComponent {

//   @ViewChild('statsTabContent', { static: false })
//   statsTabContent!: AccelerationCurveComponent

//   constructor(
//     public authService: AuthService,
//     public mq: AppMessageQueue,
//     private http: HttpClient,
//   ) {
//     (async () => {
//       // try {
//       //   const ollama = new OllamaService("/prompt") // Replace with your Ollama base URL
//       //   const model = "llama2"
//       //   const history: { speaker: string; text: string }[] = [
//       //   ]
//       //   history.push({ speaker: "user", text: "introduce yourself to user XXDD%%66239292393  as a player of the space truck application" })

//       //   console.log("Starting conversation...")
//       //   let bufferx = ''

//       //   await ollama.generateResponse(
//       //     history,
//       //     model,
//       //     (chunk) => { bufferx += chunk },
//       //     async () => {
//       //       console.log("\nResponse completed.")
//       //       // Add the model's response to history
//       //       history.push({ speaker: "model", text: "space trucker" })

//       //       // Continue the conversation
//       //       history.push({ speaker: "user", text: "Tell me more about how to get to stations" })

//       //       let buffer = ''
//       //       // Call generateResponse again with updated history
//       //       await ollama.generateResponse(
//       //         history,
//       //         model,
//       //         (chunk) => { buffer += chunk },
//       //         () => {
//       //           console.log("\nConversation updated.")
//       //         }
//       //       )
//       //       debugger
//       //     }
//       //   )
//       // } catch (error) {
//       //   console.error("Error:", error)
//       // }
//     })()



//     // (async () => {
//     //   try {
//     //     const ollama = new OllamaService2("http://localhost:11434/api") // Replace with your Ollama base URL
//     //     const model = "llama2"

//     //     // Initialize conversation history
//     //     const history: { speaker: string; text: string }[] = [
//     //       { speaker: "user", text: "What is the capital of France?" },
//     //     ]
//     //     // const history: { speaker: string; text: string }[] = [
//     //     //   { speaker: "user", text: "introduce yourself to user XXDD%%66239292393  as a player of the space truck application" },
//     //     // ]

//     //     // Request a completion
//     //     const response = await ollama.generateCompletion(history, model)
//     //     console.log("Model:", response)

//     //     // Add the model's response to history
//     //     history.push({ speaker: "model", text: response })

//     //     // Add a follow-up message from the user
//     //     history.push({ speaker: "user", text: "Tell me more about Paris." })

//     //     // Request another completion
//     //     const followUpResponse = await ollama.generateCompletion(history, model)
//     //     console.log("Model:", followUpResponse)

//     //     // Add the follow-up response to history
//     //     history.push({ speaker: "model", text: followUpResponse })

//     //     console.log("Final Conversation History:", history)
//     //   } catch (error) {
//     //     console.error("Error:", error)
//     //   }
//     // })();

//   }

//   onTabChange(event: MatTabChangeEvent) {
//     activateSelectedTab([, this.statsTabContent], event)
//   }


// }
