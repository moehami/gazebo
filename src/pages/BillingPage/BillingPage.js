import { useParams } from 'react-router-dom'

import { useOwner } from 'services/user'

import Header from './Header'
import Tabs from './Tabs'

function BillingPage() {
  const { owner } = useParams()
  const { data: ownerData } = useOwner({ username: owner })

  return (
    <div className="flex flex-col gap-4">
      <Header owner={ownerData} />
      <div>{ownerData?.isCurrentUserPartOfOrg && <Tabs />}</div>
    </div>
  )
}

export default BillingPage
