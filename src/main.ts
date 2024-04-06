import * as core from '@actions/core'
import { run as gh } from './gh-ops'
import { release, Version } from './release'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  try {
    const version = core.getInput('version') as Version
    const base: string = core.getInput('base')
    const workspace: string = core.getInput('workspace')
    const assets: string = core.getInput('assets')

    await gh({ base, workspace })
    await release({ version, assets })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
