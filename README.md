<p align="center">
  <a href="https://github.com/bbrain-io/actions.get_latest"><img alt="typescript-action status" src="https://github.com/bbrain-io/actions.get_latest/workflows/build-test/badge.svg"></a>
</p>

# actions.get_latest

## Usage

```yaml
- uses: bbrain-io/actions.get_release@v1
  id: release
  with:
    owner: actions
    repo: setup-node
    by_tag: true

- name: Print results
  run: |
    echo "${{ steps.release.outputs.raw }}" # v1.1.5-rc1
    echo "${{ steps.release.outputs.clean }}" # 1.1.5-rc1
    echo "${{ steps.release.outputs.no_release }}" # v1.1.5
    echo "${{ steps.release.outputs.clean_no_release }}" # 1.1.5
```