import * as React from 'react'
import {Box2, Button, Text, Emoji} from '../../../common-adapters'
import {assertionToDisplay} from '../../../common-adapters/usernames'
import * as Styles from '../../../styles'
import {isMobile} from '../../../constants/platform'
import Flags from '../../../util/feature-flags'

export type InviteProps = {
  openShareSheet: () => void
  openSMS: (phoneNumber: string) => void
  onDismiss: () => void
  usernameToContactName: {[username: string]: string}
  users: Array<string>
}

const BannerBox = (props: {
  children: React.ReactNode
  color: string
  gap?: keyof typeof Styles.globalMargins
}) => (
  <Box2
    direction="vertical"
    fullWidth={true}
    style={Styles.collapseStyles([styles.bannerStyle, {backgroundColor: props.color}])}
    gap={props.gap}
    centerChildren={true}
  >
    {props.children}
  </Box2>
)

const BannerText = props => <Text center={true} type="BodySmallSemibold" negative={true} {...props} />

const InviteBanner = ({users, openSMS, openShareSheet, usernameToContactName, onDismiss}: InviteProps) => {
  const theirName =
    users.length === 1
      ? usernameToContactName[users[0]] || assertionToDisplay(users[0])
      : `these ${users.length} people`
  const mobileClickInstall =
    users.length === 1 && users[0].endsWith('@phone') ? () => openSMS(users[0].slice(0, -6)) : openShareSheet
  const caption = `Last step: summon ${theirName}`!

  if (isMobile) {
    return (
      <BannerBox color={Styles.globalColors.blue} gap="xtiny">
        <BannerText>{caption}</BannerText>
        <Box2 direction="horizontal" gap="tiny">
          <Button
            label={Flags.wonderland ? '🐇 Send install link' : 'Send install link'}
            onClick={mobileClickInstall}
            mode="Secondary"
            small={true}
          />
          <Button label="Dismiss" mode="Secondary" onClick={onDismiss} small={true} backgroundColor="blue" />
        </Box2>
      </BannerBox>
    )
  }

  return (
    <BannerBox color={Styles.globalColors.blue}>
      <BannerText>{caption}</BannerText>
      <BannerText>
        {Flags.wonderland && (
          <>
            <Emoji size={16} emojiName=":rabbit2:" />{' '}
          </>
        )}
        Send them this link:
        <BannerText
          onClickURL="https://keybase.io/app"
          underline={true}
          type="BodySmallPrimaryLink"
          selectable={true}
          style={{marginLeft: Styles.globalMargins.xtiny}}
        >
          https://keybase.io/app
        </BannerText>
      </BannerText>
    </BannerBox>
  )
}

const styles = Styles.styleSheetCreate(() => ({
  bannerStyle: Styles.platformStyles({
    common: {
      ...Styles.globalStyles.flexBoxColumn,
      alignItems: 'center',
      backgroundColor: Styles.globalColors.red,
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingBottom: 8,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 8,
    },
    isElectron: {
      marginBottom: Styles.globalMargins.tiny,
    },
  }),
}))

export {InviteBanner}
