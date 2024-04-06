import * as core from '@actions/core'
// @ts-ignore
import release from 'release-it'
import { run as gh } from './gh-ops'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    const base: string = core.getInput('base')
    const workspace: string = core.getInput('workspace')
    const assets: string = core.getInput('assets')

    await gh({ base, workspace })
    await publish({ version, assets })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export async function publish({ version, assets }: any) {
  core.debug(version)
  const options = {
    src: {
      commitArgs: '-S'
    },
    hooks: {
      'after:bump': 'auto-changelog -t keepachangelog -p -u'
    },
    github: {
      releaseName: 'Release: ${version}',
      release: true,
      autoGenerate: true,
      assets: [assets],
      comments: {
        submit: true
      }
    },
    git: {
      commit: false,
      tag: false,
      push: false
    },
    npm: {
      publish: false
    }
  }
  const output = await release(options)
  core.info(output.message)
}
