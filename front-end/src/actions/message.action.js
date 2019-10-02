import axios from 'axios'
import CONFIG from '../constants/config'
import * as CONSTS from '../constants/const'

axios.defaults.headers.post['Content-Type'] = 'application/json'
export const sendMessage = (toNumber, fromNumber, text, mainNums) => {
  return async dispatch => {
    const URL = `${CONFIG.corsURL}${CONFIG.Mssgae_URL}/users/${CONFIG.accountId}/messages`
    await axios({
      url: URL,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      auth: {
        username: CONFIG.apiToken,
        password: CONFIG.apiSecret,
      },
      data: {
        to: [toNumber],
        from: fromNumber,
        text: text,
        applicationId: CONFIG.applicationId,
        tag: 'test message',
      },
    })
      .then(res => {
        if (res && res.statusText === 'Accepted' && res.status === 202) {
          const sendMsgData = {
            from_number: fromNumber,
            to_number: toNumber,
            text: text,
            direction: 'out',
            message_id: res.data.id,
          }
          axios
            .post(`${CONFIG.serverURL}/api/sendmessage`, {
              sendMsgData,
            })
            .then(res1 => {
              dispatch(getAllNumbers(fromNumber, mainNums))
              dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res1.data })
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
export const getMessage = (toNumber, fromNumber, state) => {
  return async dispatch => {
    const msgData = {
      from_number: fromNumber,
      to_number: toNumber,
      state: state,
    }
    await axios
      .post(`${CONFIG.serverURL}/api/getmessages`, {
        msgData,
      })
      .then(res => {
        dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
      })
  }
}
export const getAllNumbers = (fromNumber, mainNums) => {
  return async dispatch => {
    await axios
      .post(`${CONFIG.serverURL}/api/getnumbers`, {
        fromNumber: fromNumber,
        mainNums: mainNums,
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
