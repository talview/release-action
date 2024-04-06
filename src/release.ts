import * as core from '@actions/core'

// @ts-expect-error types-def-unavailable
import rlt from 'release-it'

export type Version = 'minor' | 'major' | 'patch'

export async function release({
  version,
  assets
}: {
  version: Version
  assets: string
}): Promise<void> {
  core.debug(version)
  const options = {
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
  const output = await rlt(options)
  core.info(output.message)
  return Promise.resolve()
}

export default release
