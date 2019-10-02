import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  sendMessage,
  getMessage,
  getAllNumbers,
  saveUserNumber,
} from '../../actions/message.action'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import openSocket from 'socket.io-client'
import './Home.css'

const socket = openSocket('http://157.245.235.132:8000')
const Home = props => {
  const {
    numbers,
    userName,
    messages,
    members,
    getMessage,
    getAllNumbers,
    saveUserNumber,
  } = props
  const mainNums = userName.mainNums

  const [values, updateValues] = useState({
    phoneNum: '',
    msgText: '',
  })

  const [toogleSidebar, updateToggleSidebar] = useState(false)
  const [setNumberToogle, updateSetNumber] = useState(false)
  const [curPhoneNum, updateSwitchPhoneNum] = useState('')
  const [adminPhoneNum, updateAdminPhoneNum] = useState('')
  const [userPhoneNum, updatePhoneNum] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleChange = e => {
    if (e.target.name === 'phoneNum') {
      updateValues({
        ...values,
        [e.target.name]: parseInt(e.target.value)
          ? `+${parseInt(e.target.value)}`
          : '',
      })
    } else updateValues({ ...values, [e.target.name]: e.target.value })
  }
  const selectPhoneNumber = e => {
    updateSwitchPhoneNum(e.target.id)
  }
  const saveUserPhoneNum = () => {
    updateAdminPhoneNum(curPhoneNum)
    getAllNumbers(curPhoneNum, mainNums)
    saveUserNumber(curPhoneNum, userName.userEmail)
    changeSetNumberModal()
  }
  const changeSetNumberModal = () => {
    updateSetNumber(!setNumberToogle)
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
        mainNums,
      )
      updateValues({ ...values, msgText: '' })
    }
  }
  const setMemNumber = number => {
    updateValues({ ...values, phoneNum: number })
    if (mainNums.includes(number)) {
      getMessage(number, adminPhoneNum, true)
    } else {
      getMessage(number, adminPhoneNum, false)
    }
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
      if (mainNums.includes(values.phoneNum))
        getMessage(values.phoneNum, adminPhoneNum, true)
      else {
        getMessage(values.phoneNum, adminPhoneNum, false)
      }
    }
  }

  useEffect(() => {
    updatePhoneNum(numbers.numberList)
  }, [numbers.numberList])

  useEffect(() => {
    if (numbers.savedNumber) {
      updateSetNumber(false)
      updateSwitchPhoneNum(numbers.savedNumber)
      updateAdminPhoneNum(numbers.savedNumber)
      getAllNumbers(numbers.savedNumber, mainNums)
    }
  }, [numbers.savedNumber])

  socket.on('incomMessage', data => {
    if (data.state === 'success') {
      getAllNumbers(data.fromNumber, mainNums)
      if (data.toNumber === values.phoneNum) {
        if (mainNums.includes(data.toNumber)) {
          getMessage(data.toNumber, data.fromNumber, true)
        } else {
          getMessage(data.toNumber, data.fromNumber, false)
        }
      }
    }
  })
  useEffect(() => {
    if (!numbers.savedNumber || !adminPhoneNum) {
      changeSetNumberModal()
    }
  }, [])

  return (
    <div className="dark">
      <Modal
        isOpen={setNumberToogle}
        toggle={changeSetNumberModal}
        className="modal-dialog modal-dialog-centered modal-dialog-zoom"
      >
        <ModalHeader toggle={changeSetNumberModal}>
          <i className="ti-settings"></i> Settings
        </ModalHeader>
        <ModalBody>
          <span className="tab-title">Please select your Phone Number.</span>
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
                      {number}
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
      <div className="layout">
        <nav className="navigation">
          <div className="nav-group">
            <ul>
              <li>
                <span className="logo">
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="33.004px"
                    height="33.003px"
                    viewBox="0 0 33.004 33.003"
                    style={{ enableBackground: 'new 0 0 33.004 33.003' }}
                  >
                    <g>
                      <path
                        d="M4.393,4.788c-5.857,5.857-5.858,15.354,0,21.213c4.875,4.875,12.271,5.688,17.994,2.447l10.617,4.161l-4.857-9.998
                                        c3.133-5.697,2.289-12.996-2.539-17.824C19.748-1.072,10.25-1.07,4.393,4.788z M25.317,22.149l0.261,0.512l1.092,2.142l0.006,0.01
                                        l1.717,3.536l-3.748-1.47l-0.037-0.015l-2.352-0.883l-0.582-0.219c-4.773,3.076-11.221,2.526-15.394-1.646
                                        C1.469,19.305,1.469,11.481,6.277,6.672c4.81-4.809,12.634-4.809,17.443,0.001C27.919,10.872,28.451,17.368,25.317,22.149z"
                      />
                      <g>
                        <circle cx="9.835" cy="16.043" r="1.833" />
                        <circle cx="15.502" cy="16.043" r="1.833" />
                        <circle cx="21.168" cy="16.043" r="1.833" />
                      </g>
                    </g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                </span>
              </li>
              <li>
                <span
                  data-navigation-target="chats"
                  onClick={changeSidebar}
                  className={toogleSidebar ? 'active' : ''}
                >
                  <i className="ti-comment-alt"></i>
                </span>
              </li>
              <li className="brackets">
                <span onClick={changeSetNumberModal}>
                  <i className="ti-settings"></i>
                </span>
              </li>
              <li>
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
              <header>
                <span>Message</span>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={changeSidebar}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </header>

              <div className="sidebar-form">
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
              <div className="sidebar-body">
                <ul className="list-group list-group-flush">
                  {members &&
                    members.map((member, i) => (
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
                          <img
                            src="https://via.placeholder.com/150"
                            className="rounded-circle"
                            alt="member"
                          />
                        </figure>
                        <div className="users-list-body">
                          <h5>{member.memberNum}</h5>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="chat">
            <div className="chat-header">
              <div className="col-md-7">
                <div className="chat-header-user">
                  <figure className="avatar avatar-lg">
                    <img
                      src="https://via.placeholder.com/150"
                      className="rounded-circle"
                      alt="img"
                    />
                  </figure>
                  <div>
                    <h5>{userName.fullName}</h5>
                    <small className="text-muted">
                      <i>{adminPhoneNum ? adminPhoneNum : 'Phone Number'}</i>
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-5 chat-header-user">
                <h5>
                  Recipient :
                  {values.phoneNum ? ` ${values.phoneNum}` : ' Phone Number'}
                </h5>
              </div>
            </div>
            <div className="chat-body" ref={messagesEndRef}>
              <div className="messages">
                {messages &&
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
                          <div className="message-content">{message.text}</div>
                          <div className="message-action">
                            {convertDateTime(message.createdAt)}
                            <i className="ti-double-check"></i>
                          </div>
                        </div>
                      )
                    }
                    if (
                      values.phoneNum === message.from_number &&
                      adminPhoneNum === message.to_number &&
                      message.direction === 'in'
                    ) {
                      return (
                        <div key={index} className="message-item">
                          <div className="message-content">{message.text}</div>
                          <div className="message-action">
                            {convertDateTime(message.createdAt)}
                          </div>
                        </div>
                      )
                    }
                    return true
                  })}
              </div>
            </div>
            <div className="chat-footer">
              <div className="chat-footer-form">
                <input
                  type="text"
                  name="msgText"
                  className="form-control"
                  placeholder="Message"
                  onChange={handleChange}
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
  sendMessage: (toNumber, fromNumber, msgText, mainNums) =>
    dispatch(sendMessage(toNumber, fromNumber, msgText, mainNums)),
  getMessage: (toNumber, fromNumber, state) => {
    dispatch(getMessage(toNumber, fromNumber, state))
  },
  saveUserNumber: (fromNumber, email) => {
    dispatch(saveUserNumber(fromNumber, email))
  },
  getAllNumbers: (fromNumber, mainNums) => {
    dispatch(getAllNumbers(fromNumber, mainNums))
  },
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
