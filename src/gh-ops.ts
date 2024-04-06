import * as github from '@actions/github'

import { GetResponseTypeFromEndpointMethod } from '@octokit/types'
// @ts-expect-error types-def-unavailable
import rlt from 'release-it'

import fs from 'fs'

type Mode = '100644' | '100755' | '040000' | '160000' | '120000' | undefined

export async function createTree(workspace: string): Promise<string> {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  const files = [
    {
      path: 'package.json',
      mode: '100644' as Mode, // File mode
      content: fs.readFileSync(`${workspace}/package.json`).toString()
    },
    {
      path: 'CHANGELOG.md',
      mode: '100644' as Mode, // File mode
      content: fs.readFileSync(`${workspace}/CHANGELOG.md`).toString()
    }
  ]
  const tree = await octokit.rest.git.createTree({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tree: files,
    base_tree: github.context.sha
  })
  return tree.data.sha
}

export async function commit({
  base,
  workspace
}: {
  base: string
  workspace: string
}): Promise<string> {
  const tree = await createTree(workspace)
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  type CommitType = GetResponseTypeFromEndpointMethod<
    typeof octokit.rest.git.createCommit
  >
  const data = JSON.parse(
    fs.readFileSync(`${workspace}/package.json`).toString()
  )
  const c: CommitType = await octokit.rest.git.createCommit({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    message: `Release :${data.version}`,
    base_commit: github.context.sha,
    tree
  })

  // updating current branch
  await octokit.rest.git.updateRef({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: github.context.ref,
    sha: c.data.sha
  })
  // reverse merge to base branch
  await octokit.rest.git.updateRef({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: base,
    sha: c.data.sha
  })
  return c.data.sha
}

export async function update(): Promise<void> {
  // only update changelog and bump version here
  const options = {
    hooks: {
      'after:bump': 'auto-changelog -t keepachangelog -p -u'
    },
    github: {
      release: false
    },
    npm: {
      publish: false
    },
    git: {
      commit: false,
      tag: false,
      push: false
    }
  }
  return rlt(options)
}

export async function run({
  base,
  workspace
}: {
  base: string
  workspace: string
}): Promise<void> {
  await update()
  await commit({ base, workspace })
}
export default run
