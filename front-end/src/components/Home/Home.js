import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ToastContainer, toast } from 'react-toastify'
import { Tooltip } from 'reactstrap'
import {
  sendMessage,
  getMessage,
  getAllNumbers,
  saveUserNumber,
  sendContact,
  setMemberNum,
  newMssage,
} from '../../actions/message.action'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import './Home.css'
import axios from 'axios'
import CONFIG from '../../constants/config'
import sms from '../../asset/media/img/sms.png'
import silhoutte from '../../asset/media/img/silhoutte.png'
import alertSound from '../../asset/media/mp3/drop.mp3'
import openSocket from 'socket.io-client'

const socket = openSocket(CONFIG.socketURL)

const Home = props => {
  const {
    numbers,
    userName,
    messages,
    members,
    getMessage,
    getAllNumbers,
    saveUserNumber,
    sendContact,
    setMemberNum,
    newMssage,
  } = props
  const mainNums = userName.mainNums
  const [values, updateValues] = useState({
    phoneNum: '',
    msgText: '',
  })
  const [contacts, updateContactInfo] = useState({
    toMail: 'joel@tsicloud.com',
    fromMail: '',
    subject: 'VentureTel SMS Suggestion',
    text: '',
  })
  const [toogleSidebar, updateToggleSidebar] = useState(false)
  const [setNumberToogle, updateSetNumber] = useState(false)
  const [contactToogle, updateContactUs] = useState(false)
  const [conversationToogle, updateConversation] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [curPhoneNum, updateSwitchPhoneNum] = useState('')
  const [adminPhoneNum, updateAdminPhoneNum] = useState('')
  const [uploadImgName, updateuploadImgName] = useState('')
  const [userPhoneNum, updatePhoneNum] = useState([])
  const [msgNofications, updateMsgNotifications] = useState([])
  const messagesEndRef = useRef(null)
  const uploadInput = useRef(null)
  const [audio] = useState(new Audio(alertSound))
  const scrollToBottom = () => {
    messagesEndRef.current._container.scrollTop =
      messagesEndRef.current._container.scrollHeight
  }
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen)
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleChange = e => {
    if (e.target.name === 'phoneNum') {
      updateValues({
        ...values,
        [e.target.name]: parseInt(e.target.value)
          ? parseInt(e.target.value)
          : '',
      })
    } else if (e.target.name === 'msgText') {
      if (e.key === 'Enter') {
        sendMessage()
      } else {
        updateValues({ ...values, [e.target.name]: e.target.value })
      }
    }
  }

  const selectPhoneNumber = e => {
    updateSwitchPhoneNum(e.target.id)
  }
  const saveUserPhoneNum = async () => {
    await getAllNumbers(curPhoneNum)
    await saveUserNumber(curPhoneNum, userName.userEmail)
    await getMessage(values.phoneNum, curPhoneNum, numbers.numberList)
    await updateAdminPhoneNum(curPhoneNum)
    await changeSetNumberModal()
  }
  const changeSetNumberModal = () => {
    updateSetNumber(!setNumberToogle)
  }
  const contactUsModal = () => {
    updateContactUs(!contactToogle)
  }

  const changeSidebar = () => {
    updateToggleSidebar(!toogleSidebar)
  }
  const sendMessage = () => {
    if (!adminPhoneNum) {
      changeSetNumberModal()
    } else if (values.phoneNum) {
      props.sendMessage(
        values.phoneNum,
        adminPhoneNum,
        values.msgText,
        userName.fullName,
        uploadImgName,
      )
      uploadInput.current.value = ''
      updateValues({ ...values, msgText: '' })
      updateuploadImgName('')
    }
  }
  const imageUpload = ev => {
    ev.preventDefault()
    const data = new FormData()
    data.append('file', uploadInput.current.files[0])
    axios
      .post(`${CONFIG.serverURL}/fileupload`, data, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(response => {
        updateuploadImgName(response.data.file)
      })
  }
  const setMemNumber = async number => {
    await updateValues({ ...values, msgText: '', phoneNum: number })
    await setMemberNum(number)
    await getMessage(number, adminPhoneNum, numbers.numberList)
  }
  const convertDateTime = time => {
    const date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    hours = hours < 10 ? '0' + hours : hours
    minutes = minutes < 10 ? '0' + minutes : minutes
    let strTime =
      year + '/' + month + '/' + day + '/' + hours + ':' + minutes + ' ' + ampm
    return strTime
  }
  const changeToNumber = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      getMessage(values.phoneNum, adminPhoneNum, numbers.numberList)
    }
  }
  const logout = () => {
    props.history.push('/')
  }
  const inComingMssage = data => {
    if (adminPhoneNum && data.toNumber === adminPhoneNum) {
      getAllNumbers(data.toNumber)
      setTimeout(() => {
        newMssage(data)
      }, 2000)
    }
  }

  const onhandleContacts = e => {
    updateContactInfo({
      ...contacts,
      [e.target.name]: e.target.value,
    })
  }
  const sendContacts = () => {
    if (
      contacts.toMail &&
      contacts.fromMail &&
      contacts.subject &&
      contacts.text
    ) {
      sendContact(contacts)
    }
    contactUsModal()
    updateContactInfo({
      ...contacts,
      toMail: 'joel@tsicloud.com',
      fromMail: '',
      subject: 'VentureTel SMS Suggestion',
      text: '',
    })
  }
  const conversationModal = () => {
    if (!conversationToogle) {
      updateValues({ ...values, phoneNum: '' })
      setMemberNum('')
    }
    updateConversation(!conversationToogle)
  }
  const startConverstaion = async () => {
    if (values.phoneNum) {
      props.sendMessage(
        `+1${values.phoneNum}`,
        adminPhoneNum,
        values.msgText,
        userName.fullName,
        uploadImgName,
      )
      uploadInput.current.value = ''
      await updateValues({
        ...values,
        msgText: '',
        phoneNum: `+1${values.phoneNum}`,
      })
      await setMemberNum(`+1${values.phoneNum}`)
      await updateuploadImgName('')
    }
    conversationModal()
  }

  const phoneNumFormat = number => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      const phoneNumber = phone_number.formatNational()
      return phoneNumber
    } else return number
  }

  useEffect(() => {
    if (numbers && numbers.savedNumber) {
      updateSetNumber(false)
      getAllNumbers(numbers.savedNumber)
      updateSwitchPhoneNum(numbers.savedNumber)
      updateAdminPhoneNum(numbers.savedNumber)
      getMessage(values.phoneNum, numbers.savedNumber, numbers.numberList)
    }
    if (numbers && numbers.numberList) {
      updatePhoneNum(numbers.numberList)
      if (adminPhoneNum) getAllNumbers(adminPhoneNum)
    }
  }, [numbers])

  useEffect(() => {
    if (!numbers.savedNumber || !adminPhoneNum) {
      updateSetNumber(true)
    }
    if (userPhoneNum) {
      socket.on('incomMessage', data => {
        if (data.state === 'success') {
          inComingMssage(data)
        }
      })
    }
  }, [userPhoneNum])

  useEffect(() => {
    if (members && !members.notifies) {
      updateMsgNotifications([])
    } else {
      if (JSON.stringify(members.notifies) !== JSON.stringify(msgNofications)) {
        updateMsgNotifications(members.notifies)
      }
    }
  }, [members.notifies])

  useEffect(() => {
    msgNofications &&
      msgNofications.forEach(notify => {
        toast.success(`New Message from ${notify.number}!`, {
          position: toast.POSITION.TOP_RIGHT,
        })
        audio.play()
      })
  }, [msgNofications])

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-0XVZHXWSXW')
  }, [])

  return (
    <div className="dark">
      <ToastContainer autoClose={8000} />
      <Modal
        isOpen={setNumberToogle}
        toggle={changeSetNumberModal}
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
      >
        <ModalHeader toggle={changeSetNumberModal}>
          <i className="ti-settings"></i> Settings
        </ModalHeader>
        <ModalBody>
          <span className="tab-title">Please select default number.</span>
          <div className="tab-content">
            <div className="tab-pane show active" id="account" role="tabpanel">
              {userPhoneNum &&
                userPhoneNum.map((number, i) => (
                  <div
                    className="form-item custom-control custom-switch"
                    key={i}
                  >
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={number}
                      checked={number === curPhoneNum}
                      onChange={selectPhoneNumber}
                    />
                    <label className="custom-control-label" htmlFor={number}>
                      {phoneNumFormat(number)}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveUserPhoneNum}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={contactToogle}
        toggle={contactUsModal}
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
      >
        <ModalHeader toggle={contactUsModal}>
          <i className="ti-pencil-alt"></i> Feature Request
        </ModalHeader>
        <ModalBody>
          <div className="contact">
            <span>
              We welcome your feedback and suggestions to make this app and your
              business communications better. Please let us know of features or
              suggestions that would help make this product better. We'll do our
              best to make it possible. We're building our services around our
              clients needs, and so your feedback and suggestions are very
              important to us!
            </span>

            <div className="input-group mt-2">
              <div className="input-group mt-2">
                <input
                  type="text"
                  name="fromMail"
                  value={contacts.fromMail}
                  className="form-control"
                  placeholder="Your Mail Address"
                  onChange={onhandleContacts}
                />
              </div>
            </div>
            <div className="input-group mt-2">
              <textarea
                className="form-control"
                id="about-text"
                name="text"
                value={contacts.text}
                placeholder="Text"
                onChange={onhandleContacts}
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={sendContacts}>
            Send
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={conversationToogle}
        toggle={conversationModal}
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
      >
        <ModalHeader toggle={conversationModal}>
          <i className="ti-comment-alt"></i> New Conversation
        </ModalHeader>
        <ModalBody>
          <div className="contact">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Input Recipient's PhoneNumber"
                name="phoneNum"
                pattern="0-9"
                value={values.phoneNum}
                onChange={handleChange}
                onKeyPress={changeToNumber}
              />
            </div>
            <div className="input-group mt-3">
              <textarea
                type="text"
                name="msgText"
                className="form-control"
                placeholder="Message"
                onChange={handleChange}
                value={values.msgText}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={startConverstaion}>
            Start
          </Button>
        </ModalFooter>
      </Modal>
      <div className="layout">
        <nav className="navigation">
          <div className="nav-group">
            <ul>
              <li>
                <span className="logo"></span>
              </li>
              <li className="brackets">
                <span
                  data-navigation-target="chats"
                  onClick={changeSidebar}
                  className={toogleSidebar ? 'active' : ''}
                >
                  <i className="ti-menu-alt"></i>
                </span>
              </li>

              <li>
                <span onClick={contactUsModal}>
                  <i className="ti-pencil-alt"></i>
                </span>
              </li>
              <li>
                <span onClick={changeSetNumberModal}>
                  <i className="ti-settings"></i>
                </span>
              </li>
              <li onClick={logout}>
                <span>
                  <i className="ti-power-off"></i>
                </span>
              </li>
            </ul>
          </div>
        </nav>
        <div className="content">
          <div className={`sidebar-group ${toogleSidebar ? 'open' : ''}`}>
            <div id="chats" className="sidebar active">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={changeSidebar}
              >
                <span aria-hidden="true">×</span>
              </button>
              <header>
                <span>Conversations</span>
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <div
                      className="btn btn-light"
                      id="newConversatoion"
                      onClick={conversationModal}
                    >
                      <i className="ti-comment-alt"></i>
                    </div>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen}
                      autohide={false}
                      target="newConversatoion"
                      toggle={toggleTooltip}
                    >
                      New Conversation
                    </Tooltip>
                  </li>
                </ul>
              </header>
              <PerfectScrollbar>
                <div className="sidebar-body">
                  <ul className="list-group list-group-flush">
                    {members &&
                      members.members &&
                      members.members.map((member, i) => (
                        <li
                          key={i}
                          className={`list-group-item ${
                            member.memberNum === values.phoneNum
                              ? 'open-chat'
                              : ''
                          }`}
                          onClick={() => setMemNumber(member.memberNum)}
                        >
                          <figure className="avatar">
                            <img src={sms} alt="member" />
                          </figure>
                          <div className="users-list-body">
                            <h5>{phoneNumFormat(member.memberNum)}</h5>
                            {members.notifies &&
                              members.notifies.map((notify, i) => {
                                if (notify.number === member.memberNum) {
                                  return (
                                    <div key={i} className="users-list-action">
                                      <div className="new-message-count">
                                        {notify.newMsg}
                                      </div>
                                    </div>
                                  )
                                }
                                return true
                              })}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </PerfectScrollbar>
            </div>
          </div>
          <div className="chat">
            <div className="chat-header">
              <div className="col-md-7">
                <div className="chat-header-user">
                  <figure className="avatar avatar-lg">
                    <img src={silhoutte} alt="img" />
                  </figure>
                  <div>
                    <h5>{userName.fullName}</h5>
                    <small className="text-muted">
                      <i>
                        {adminPhoneNum
                          ? phoneNumFormat(adminPhoneNum)
                          : 'Phone Number'}
                      </i>
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-body">
              <PerfectScrollbar ref={messagesEndRef}>
                <div className="messages">
                  {values.phoneNum &&
                    messages &&
                    messages.map((message, index) => {
                      if (
                        values.phoneNum === message.to_number &&
                        adminPhoneNum === message.from_number &&
                        message.direction === 'out'
                      ) {
                        return (
                          <div
                            key={index}
                            className="message-item outgoing-message"
                          >
                            {mainNums.includes(adminPhoneNum) ||
                            mainNums.includes(values.phoneNum) ? (
                              <div className="message-action">
                                From: {message.sender}
                              </div>
                            ) : (
                              ''
                            )}
                            {message.text ? (
                              <div className="message-content">
                                {message.text}
                              </div>
                            ) : (
                              ''
                            )}
                            {message.media ? (
                              <div className="message-content mt-2">
                                <a href={message.media}>
                                  <img
                                    src={message.media}
                                    className="img-view"
                                    alt="download"
                                  />
                                </a>
                              </div>
                            ) : (
                              ''
                            )}

                            {message.state === '1' ? (
                              <div className="message-action">
                                {convertDateTime(message.createdAt)}
                                <i className="ti-double-check"></i>
                              </div>
                            ) : (
                              <div className="message-action">
                                {convertDateTime(message.createdAt)}
                                <i className="ti-check"></i>
                              </div>
                            )}
                          </div>
                        )
                      } else if (
                        (values.phoneNum === message.from_number &&
                          adminPhoneNum === message.to_number &&
                          message.direction === 'in') ||
                        (message.media &&
                          values.phoneNum === message.from_number &&
                          adminPhoneNum === message.to_number)
                      ) {
                        return (
                          <div key={index} className="message-item">
                            {mainNums.includes(adminPhoneNum) ||
                            mainNums.includes(values.phoneNum) ? (
                              <div className="message-action">
                                To: {phoneNumFormat(message.to_number)}
                              </div>
                            ) : (
                              ''
                            )}
                            {message.text ? (
                              <div className="message-content">
                                {message.text}
                              </div>
                            ) : (
                              ''
                            )}
                            {message.media ? (
                              <div className="message-content mt-2">
                                <a href={message.media}>
                                  <img
                                    src={message.media}
                                    className="img-view"
                                    alt="download"
                                  />
                                </a>
                              </div>
                            ) : (
                              ''
                            )}
                            <div className="message-action">
                              {convertDateTime(message.createdAt)}
                            </div>
                          </div>
                        )
                      }
                      return true
                    })}
                  {!values.phoneNum &&
                    messages &&
                    messages.map(
                      (message, index) =>
                        userPhoneNum &&
                        userPhoneNum.map(userNum => {
                          if (
                            userNum === message.from_number &&
                            message.direction === 'out'
                          ) {
                            return (
                              <div
                                key={index}
                                className="message-item outgoing-message"
                              >
                                <div className="message-action">
                                  From: {phoneNumFormat(message.from_number)}
                                </div>
                                {message.text ? (
                                  <div className="message-content">
                                    {message.text}
                                  </div>
                                ) : (
                                  ''
                                )}
                                {message.media ? (
                                  <div className="message-content mt-2">
                                    <a href={message.media}>
                                      <img
                                        src={message.media}
                                        className="img-view"
                                        alt="download"
                                      />
                                    </a>
                                  </div>
                                ) : (
                                  ''
                                )}

                                {message.state === '1' ? (
                                  <div className="message-action">
                                    {convertDateTime(message.createdAt)}
                                    <i className="ti-double-check"></i>
                                  </div>
                                ) : (
                                  <div className="message-action">
                                    {convertDateTime(message.createdAt)}
                                    <i className="ti-check"></i>
                                  </div>
                                )}
                              </div>
                            )
                          } else if (
                            (userNum === message.to_number &&
                              message.direction === 'in') ||
                            (message.media && userNum === message.to_number)
                          ) {
                            return (
                              <div key={index} className="message-item">
                                <div className="message-action">
                                  To: {phoneNumFormat(message.to_number)}
                                </div>

                                {message.text ? (
                                  <div className="message-content">
                                    {message.text}
                                  </div>
                                ) : (
                                  ''
                                )}
                                {message.media ? (
                                  <div className="message-content mt-2">
                                    <a href={message.media}>
                                      <img
                                        src={message.media}
                                        className="img-view"
                                        alt="download"
                                      />
                                    </a>
                                  </div>
                                ) : (
                                  ''
                                )}
                                <div className="message-action">
                                  {convertDateTime(message.createdAt)}
                                </div>
                              </div>
                            )
                          }
                          return true
                        }),
                    )}
                </div>
              </PerfectScrollbar>
            </div>
            <div className="chat-footer">
              <div className="sender">
                {adminPhoneNum ? (
                  <div>
                    Sending via:{' '}
                    <span onClick={changeSetNumberModal}>
                      {phoneNumFormat(adminPhoneNum)}
                    </span>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="chat-footer-form">
                <div className="chat-image-upload">
                  <label id="#bb">
                    <i className="ti-clip"></i>
                    <input
                      type="file"
                      ref={uploadInput}
                      onChange={imageUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="msgText"
                  className="form-control"
                  placeholder="Message"
                  onChange={handleChange}
                  onKeyPress={handleChange}
                  value={values.msgText}
                />
                <div className="form-buttons">
                  <button
                    className="btn btn-primary btn-floating"
                    onClick={sendMessage}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
              <div className="message-action">{uploadImgName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  numbers: state.message.numbers,
  userName: state.message.userName,
  messages: state.message.messages,
  members: state.message.members,
})
const mapDispatchToProps = dispatch => ({
  sendMessage: (toNumber, fromNumber, msgText, sender, uploadImgName) =>
    dispatch(sendMessage(toNumber, fromNumber, msgText, sender, uploadImgName)),
  getMessage: (toNumber, fromNumber, fromNums) => {
    dispatch(getMessage(toNumber, fromNumber, fromNums))
  },
  saveUserNumber: (fromNumber, email) => {
    dispatch(saveUserNumber(fromNumber, email))
  },
  getAllNumbers: userNumber => {
    dispatch(getAllNumbers(userNumber))
  },
  sendContact: data => {
    dispatch(sendContact(data))
  },
  setMemberNum: num => {
    dispatch(setMemberNum(num))
  },
  newMssage: data => {
    dispatch(newMssage(data))
  },
})
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Home),
)
