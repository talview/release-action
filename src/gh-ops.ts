import * as github from '@actions/github'
import * as core from '@actions/core'

import { GetResponseTypeFromEndpointMethod } from '@octokit/types'
import { get } from 'lodash'
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
export async function createRelease(version: string): Promise<void> {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')

  await octokit.rest.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: `${process.env.VERSION_PREFIX || ''}${version}`,
    name: `${process.env.VERSION_PREFIX || ''}${version}`,
    generate_release_notes: true
  })
}
export async function commit({ base, workspace }: { base: string; workspace: string }): Promise<string> {
  const tree = await createTree(workspace)
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  type CommitType = GetResponseTypeFromEndpointMethod<typeof octokit.rest.git.createCommit>
  const data = JSON.parse(fs.readFileSync(`${workspace}/package.json`).toString())
  const c: CommitType = await octokit.rest.git.createCommit({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    message: `Release: ${data.version}`,
    parents: [github.context.sha],
    tree
  })
  await ref(`tags/${process.env.VERSION_PREFIX || ''}${data.version}`, c.data.sha)
  await createRelease(data.version)
  await ref(`${get(github.context.ref.match(new RegExp('(heads)/([a-z]+)')), '0')}`, c.data.sha)
  await raisePullRequest(data.version, base)

  return c.data.sha
}
export async function raisePullRequest(version: string, base?: string): Promise<string | void> {
  if (!base) return
  const current = get(github.context.ref.match(new RegExp('(heads)/([a-z]+)')), '2')
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  await octokit.rest.pulls.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    title: `Release: ${process.env.VERSION_PREFIX || ''}${version}`,
    head: base,
    body: `Rebase Changelog and version bump`,
    base: `${current}`
  })
  return base
}

export async function ref(r: string, sha: string): Promise<string> {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  let res
  let ret
  core.info(r)
  try {
    res = await octokit.rest.git.getRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: r
    })
  } catch {
    // empty
  }
  if (res?.data?.url) {
    ret = await octokit.rest.git.updateRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: r,
      sha
    })
  } else {
    ret = await octokit.rest.git.createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/${r}`,
      sha
    })
  }

  return ret.data.ref
}

export async function run({ base, workspace }: { base: string; workspace: string }): Promise<void> {
  await commit({ base, workspace })
}
export default run
