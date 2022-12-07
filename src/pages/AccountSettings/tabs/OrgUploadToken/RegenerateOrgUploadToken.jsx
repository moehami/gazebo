import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useIsCurrentUserAnAdmin } from 'services/user'
import A from 'ui/A'
import Button from 'ui/Button'
import Icon from 'ui/Icon'
import TokenWrapper from 'ui/TokenWrapper'

import RegenerateTokenModal from './RegenrateTokenModal'
import useGenerateOrgUploadToken from './useGenerateOrgUploadToken'

const TokenFormatEnum = Object.freeze({
  FIRST_FORMAT: 'codecov: \n token: ',
  SECOND_FORMAT: 'CODECOV_TOKEN=',
})

const UploadToken = ({ token, format }) => {
  const [hideClipboard, setHideClipboard] = useState(true)
  const encodedToken = hideClipboard && format + token.replace(/[^w-]|/g, 'x')

  return (
    <div className="flex gap-2 items-center">
      <TokenWrapper token={format + token} encodedToken={encodedToken} />
      <div
        className="flex gap-0.5 text-ds-blue-darker hover:cursor-pointer"
        onClick={() => setHideClipboard(!hideClipboard)}
        data-testid="hide-token"
      >
        <Icon
          name={hideClipboard ? 'eye' : 'eye-off'}
          size="sm"
          variant="solid"
        />
        <span className="text-xs font-semibold">
          {hideClipboard ? 'Show' : 'Hide'}
        </span>
      </div>
    </div>
  )
}

UploadToken.propTypes = {
  token: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
}

function RegenerateOrgUploadToken({ orgUploadToken }) {
  const { owner } = useParams()
  const { regenerateToken, isLoading } = useGenerateOrgUploadToken()
  const [showModal, setShowModal] = useState(false)
  const isAdmin = useIsCurrentUserAnAdmin({ owner })

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col gap-4">
        <p>Add this token to your codecov.yml</p>
        <p className="text-xs">
          <span className="font-semibold">Note:</span> Token not required for
          public repositories uploading from Travis, CircleCI, AppVeyor, Azure
          Pipelines or{' '}
          <A
            href="https://github.com/codecov/codecov-action#usage"
            isExternal
            hook="gh-actions"
          >
            GitHub Actions
          </A>
          .
        </p>
        <UploadToken
          token={orgUploadToken}
          format={TokenFormatEnum.FIRST_FORMAT}
        />
        <span className="font-semibold ">OR</span>
        <UploadToken
          token={orgUploadToken}
          format={TokenFormatEnum.SECOND_FORMAT}
        />
        {!isAdmin && (
          <div className="flex gap-1">
            <Icon name="information-circle" size="sm" />
            Only organization admins can regenerate this token.
          </div>
        )}
      </div>
      <div>
        <Button
          hook="show-modal"
          onClick={() => setShowModal(true)}
          disabled={isLoading || !isAdmin}
        >
          Regenerate
        </Button>
        {showModal && (
          <RegenerateTokenModal
            closeModal={() => setShowModal(false)}
            regenerateToken={regenerateToken}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

RegenerateOrgUploadToken.propTypes = {
  orgUploadToken: PropTypes.string.isRequired,
}

export default RegenerateOrgUploadToken
