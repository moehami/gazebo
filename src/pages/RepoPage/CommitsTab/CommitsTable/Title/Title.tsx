import PropTypes from 'prop-types'
import { z } from 'zod'

import {
  BadgeTierSchema,
  GamificationMetricSchema,
} from 'services/commits/useCommits'
import { formatTimeToNow } from 'shared/utils/dates'
import A from 'ui/A'
import Avatar, { DefaultAuthor } from 'ui/Avatar'

import AuthorBadges from './AuthorBadges'

const BadgeEnum = z.object({
  name: GamificationMetricSchema,
  tier: BadgeTierSchema,
})

type BadgeProps = z.infer<typeof BadgeEnum>
interface TitleProps {
  message?: string | null
  author?: {
    username?: string | null
    avatarUrl?: string | null
  } | null
  commitid?: string
  createdAt?: string
  badges?: BadgeProps[]
  flags?: string[]
}
const Title = ({
  message,
  author,
  commitid,
  createdAt,
  flags = [],
  badges,
}: TitleProps) => {
  const user = {
    avatarUrl: author?.avatarUrl || DefaultAuthor.AVATAR_URL,
    username: author?.username || DefaultAuthor.USERNAME,
  }

  const commitMessage = () => {
    if (!message) return 'commit message unavailable'
    const msg =
      message?.length < 50
        ? message?.slice(0, 50)
        : message?.slice(0, 50) + '...'
    return msg
  }

  return (
    <div className="flex flex-1 flex-row items-center gap-4 lg:w-auto">
      <Avatar user={user} border="light" />
      <div className="flex flex-col">
        {/* @ts-ignore */}
        <A to={{ pageName: 'commit', options: { commit: commitid, flags } }}>
          <h2 className="text-sm font-semibold text-black">
            {commitMessage()}
          </h2>
        </A>
        <p className="flex gap-1 text-xs">
          {/* @ts-ignore */}
          <A to={{ pageName: 'owner' }}>
            <span className="text-black">{author?.username}</span>
          </A>
          {createdAt && (
            <span className="text-ds-gray-quinary">
              {' '}
              opened {formatTimeToNow(createdAt)}
            </span>
          )}
          <AuthorBadges badges={badges || []} />
        </p>
      </div>
    </div>
  )
}

Title.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  commitid: PropTypes.string,
  message: PropTypes.string,
  createdAt: PropTypes.string,
  flags: PropTypes.arrayOf(PropTypes.string),
}

export default Title
