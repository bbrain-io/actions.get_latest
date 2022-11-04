import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import * as semver from 'semver'


async function getLatestReleaseByDate(client: InstanceType<typeof GitHub>, owner: string, repo: string) {
  let release = await client.rest.repos.getLatestRelease({
    owner: owner,
    repo: repo
  })
  return release.data.tag_name
}

async function getLatestReleaseBySort(client: InstanceType<typeof GitHub>, owner: string, repo: string) {
  var releases = await client.rest.repos.listReleases({
    owner: owner,
    repo: repo,
    per_page: 100
  });

  var tags = []
  for (const release of releases.data) {
    let tag = release.tag_name
    if (!semver.valid(tag)) {
      continue
    }
    tags.push(tag)
  }
  tags.sort(semver.rcompare)
  return tags[0]
}

function stringToBool(string: string): Boolean {
  if (string.toLowerCase() === "true") {
    return true
  } else if (string.toLowerCase() === "false") {
    return false
  }
  throw new Error("boolean type accepts the following values : [Ff]alse, [Tt]rue")
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', {required: true})
    const repo: string = core.getInput('repo')
    const owner: string = core.getInput('owner')
    const by_date: Boolean = stringToBool(core.getInput('by_date'))

    const github = getOctokit(token)

    if (by_date) {
      var tag = await getLatestReleaseByDate(github, owner, repo)
    } else {
      var tag = await getLatestReleaseBySort(github, owner, repo)
    }

    core.setOutput('raw', tag)
    core.setOutput('clean', semver.clean(tag))
    core.setOutput('no_release', tag.split("-")[0])
    core.setOutput('clean_no_release', semver.clean(tag)?.split("-")[0])
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
