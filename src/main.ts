import * as core from '@actions/core'
import { run as gh } from './gh-ops'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  try {
    // const version = process.env.VERSION as Version
    const base: string = process.env.BASE || 'develop'
    const workspace: string = process.env.WORKSPACE || ''

    await gh({ base, workspace })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
