import axios from 'axios'
import CONFIG from '../constants/config'
import * as CONSTS from '../constants/const'

axios.defaults.headers.post['Content-Type'] = 'application/json'
export const sendMessage = (
  toNumber,
  fromNumber,
  text,
  sender,
  uploadImgName,
) => {
  return async dispatch => {
    const URL = `${CONFIG.corsURL}${CONFIG.Mssgae_URL}/users/${CONFIG.accountId}/messages`
    let data = null
    if (uploadImgName) {
      data = {
        to: [toNumber],
        from: fromNumber,
        text: text,
        applicationId: CONFIG.applicationId,
        media: [`${CONFIG.serverURL}/mms_images/${uploadImgName}`],
        tag: 'test message',
      }
    } else {
      data = {
        to: [toNumber],
        from: fromNumber,
        text: text,
        applicationId: CONFIG.applicationId,
        tag: 'test message',
      }
    }

    await axios({
      url: URL,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      auth: {
        username: CONFIG.apiToken,
        password: CONFIG.apiSecret,
      },
      data: data,
    })
      .then(res => {
        if (res && res.statusText === 'Accepted' && res.status === 202) {
          let sendMsgData = null
          if (res.data.media) {
            sendMsgData = {
              from_number: fromNumber,
              to_number: toNumber,
              text: text,
              direction: 'out',
              message_id: res.data.id,
              sender: sender,
              media: res.data.media[0],
            }
          } else {
            sendMsgData = {
              from_number: fromNumber,
              to_number: toNumber,
              text: text,
              direction: 'out',
              message_id: res.data.id,
              sender: sender,
            }
          }

          axios
            .post(`${CONFIG.serverURL}/api/sendmessage`, {
              sendMsgData,
            })
            .then(res1 => {
              dispatch(getAllNumbers(fromNumber))
              dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res1.data })
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
export const getMessage = (toNumber, fromNumber) => {
  return async dispatch => {
    const msgData = {
      fromNumber: fromNumber,
      toNumber: toNumber,
    }
    await axios
      .post(`${CONFIG.serverURL}/api/getmessages`, {
        msgData,
      })
      .then(res => {
        dispatch(getAllNumbers(fromNumber))
        dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
      })
  }
}
export const getAllNumbers = fromNumber => {
  return async dispatch => {
    await axios
      .post(`${CONFIG.serverURL}/api/getnumbers`, {
        fromNumber: fromNumber,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_USERS, payload: res.data })
      })
  }
}
export const saveUserNumber = (userNumber, userEmail) => {
  return async dispatch => {
    await axios
      .post(`${CONFIG.serverURL}/api/saveusernumber`, {
        phoneNumber: userNumber,
        email: userEmail,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_USERS, payload: res.data })
      })
  }
}