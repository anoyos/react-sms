import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Notification from 'react-web-notification'
import alertIcon from '../../asset/media/img/VentureTel-SMS-Logo.png'
import alertAudio from '../../asset/media/mp3/drop.mp3'
import './Home.css'

const Notifications = props => {
  const { notification } = props
  const { state, fromNumber } = notification
  // const [ignore, updateIgnore] = useState(true)
  const [title, updateTitle] = useState('')
  const [options, updateOptions] = useState({})
  const [audio] = useState(new Audio(alertAudio))

  const handleNotificationOnClick = (e, tag) => {
    window.open('https://venturetel.app/home')
  }

  const handleNotificationOnError = (e, tag) => {
    console.log(e, 'Notification error tag:' + tag)
  }

  const handleNotificationOnClose = (e, tag) => {
    console.log(e, 'Notification closed tag:' + tag)
  }

  const handleNotificationOnShow = (e, tag) => {
    audio.play()
    console.log(e, 'Notification shown tag:' + tag)
  }

  const handleButtonClick = () => {
    const title = 'SMS Desktop Alert'
    const body = 'New Message from ' + fromNumber
    const icon = alertIcon

    const options = {
      body: body,
      icon: icon,
      lang: 'en',
      sound: alertAudio,
    }
    updateTitle(title)
    updateOptions(options)
  }

  useEffect(() => {
    if (state) {
      handleButtonClick()
      audio.play()
    }
  }, [notification])
  return (
    <div>
      <Notification
        onShow={handleNotificationOnShow}
        onClick={handleNotificationOnClick}
        onClose={handleNotificationOnClose}
        onError={handleNotificationOnError}
        timeout={20000}
        title={title}
        options={options}
      />
    </div>
  )
}
const mapStateToProps = state => ({
  notification: state.message.notification,
})

export default connect(mapStateToProps)(Notifications)
