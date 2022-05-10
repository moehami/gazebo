import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { usePullQuery } from 'generated'

export function getPullDataForCompareSummary({ head, base, compareWithBase }) {
  return {
    headCoverage: head?.totals?.coverage,
    patchCoverage: compareWithBase?.patchTotals?.coverage * 100,
    changeCoverage: compareWithBase?.changeWithParent,
    headCommit: head?.commitid,
    baseCommit: base?.commitid,
  }
}

export function usePullForCompareSummary() {
  const { provider, owner, repo, pullId } = useParams()
  const { data } = usePullQuery({
    provider,
    owner,
    repo,
    pullId: parseInt(pullId, 10),
  })

  const pull = data.owner?.repository?.pull
  const head = pull?.head
  const base = pull?.comparedTo
  const compareWithBase = pull?.compareWithBase

  return useMemo(
    () => getPullDataForCompareSummary({ head, base, compareWithBase }),
    [head, base, compareWithBase]
  )
}
