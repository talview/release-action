import * as github from '@actions/github'
import fs from 'fs'
import path from 'path'

export async function createTree(octokit: any) {
  const files = [
    {
      path: 'package.json',
      mode: '100644', // File mode
      content: `${github.context.repo}`
    }
  ]

  const blobs = await Promise.all(
    files.map(async file => {
      const blob = await octokit.git.createBlob({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        content: file.content,
        encoding: 'utf-8'
      })
      return {
        path: file.path,
        mode: file.mode,
        type: 'blob',
        sha: blob.data.sha
      }
    })
  )

  const tree = await octokit.git.createTree({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    base_tree: '',
    tree: blobs
  })

  return tree.data.sha
}
export async function run({ base }: any) {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
}
