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
            .post(`${CONFIG.serverURL}/sendmessage`, {
              sendMsgData,
            })
            .then(res1 => {
              dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res1.data })
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
export const getMessage = (toNumber, fromNumber, fromNums) => {
  return async dispatch => {
    const msgData = {
      fromNumber: fromNumber,
      toNumber: toNumber,
      fromNums: fromNums,
    }
    await axios
      .post(`${CONFIG.serverURL}/getmessages`, {
        msgData,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
        dispatch(getAllNumbers(fromNumber))
      })
  }
}
export const getAllNumbers = userNumber => {
  return async dispatch => {
    await axios
      .post(`${CONFIG.serverURL}/getnumbers`, {
        userNumber: userNumber,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_USERS, payload: res.data })
      })
  }
}
export const saveUserNumber = (userNumber, userEmail) => {
  return async dispatch => {
    await axios
      .post(`${CONFIG.serverURL}/saveusernumber`, {
        phoneNumber: userNumber,
        email: userEmail,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_USERS, payload: res.data })
      })
  }
}
export const sendContact = data => {
  return async dispatch => {
    await axios.post(`${CONFIG.serverURL}/sendcontact`, data).then(res => {
      console.log(res)
    })
  }
}

export const setMemberNum = data => {
  return async dispatch => {
    dispatch({ type: CONSTS.SET_MEM_NUMBER, payload: data })
  }
}
export const newMssage = data => {
  return (dispatch, getState) => {
    const { message } = getState()
    const { mem_number, numbers } = message
    if (data.fromNumber === mem_number) {
      dispatch(getMessage(data.fromNumber, data.toNumber, numbers.numberList))
    }
  }
}
