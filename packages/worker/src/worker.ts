import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { clearNodes } from './clearNodes'
import { normalizeNodes } from './normalizeNodes'
import { startPollingPull } from './pollingPull'
import { pollingPushToCloud } from './pollingPushToCloud'
import { pollingPushToGithub } from './pollingPushToGithub'
import { runAgentSSE } from './runAgentSSE'

self.addEventListener('message', async (event) => {
  if (event.data === WorkerEvents.START_POLLING) {
    console.log('===========start polling......')
    await db.database.connect()

    // pollingPushToCloud()
    // startPollingPull()
    pollingPushToGithub()

    // runAgentSSE()

    clearNodes()
    // normalizeNodes()
  }
})
