import React, { useState, useEffect } from 'react'
import {
  sendContact,
  saveUserNumber,
  saveStyleMode,
} from '../../actions/message.action'
import { getUserData } from '../../actions/auth.action'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import '../Home/Home.css'

const Dialog = props => {
  const {
    numbers,
    getUserData,
    styleMode,
    saveUserNumber,
    saveStyleMode,
    userName,
    setNumberToogle,
    changeSetNumberModal,
    contactUsModal,
    contactToogle,
  } = props

  const [contacts, updateContactInfo] = useState({
    toMail: 'joel@tsicloud.com',
    fromMail: '',
    subject: 'VentureTel SMS Suggestion',
    text: '',
  })

  const [settingTab, setSettingTab] = useState('settingTab1')
  const [curPhoneNum, updateSwitchPhoneNum] = useState('')
  const [userPhoneNum, updatePhoneNum] = useState([])
  const [curStyleMode, setCurStyleMode] = useState('')

  const settingTabToggole = tab => {
    if (settingTab !== tab) setSettingTab(tab)
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
  const selectPhoneNumber = e => {
    updateSwitchPhoneNum(e.target.id)
  }

  const changeStyleNode = e => {
    setCurStyleMode(e.target.id)
  }

  const phoneNumFormat = number => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      const phoneNumber = phone_number.formatNational()
      return phoneNumber
    } else return number
  }
  const saveUserPhoneNum = () => {
    saveUserNumber(curPhoneNum, userName.userEmail)
    changeSetNumberModal()
  }
  const saveUserStyleMode = () => {
    saveStyleMode(curStyleMode, userName.userEmail)
    changeSetNumberModal()
  }

  useEffect(() => {
    if (numbers && numbers.savedNumber) {
      updateSwitchPhoneNum(numbers.savedNumber)
    }
    if (numbers && numbers.numberList) {
      updatePhoneNum(numbers.numberList)
    }
    setCurStyleMode(styleMode)
  }, [numbers])

  useEffect(() => {
    getUserData()
  }, [])
  return (
    <div>
      <Modal
        isOpen={setNumberToogle}
        toggle={changeSetNumberModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={changeSetNumberModal}>
          <i className="ti-settings"></i> Settings
        </ModalHeader>
        <ModalBody>
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab1',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab1')
                  }}
                >
                  User PhoneNumber
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab2',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab2')
                  }}
                >
                  User Setting
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={settingTab}>
              <TabPane tabId="settingTab1">
                <span className="tab-title">Please select default number.</span>
                <div className="tab-content">
                  <div
                    className="tab-pane show active"
                    id="account"
                    role="tabpanel"
                  >
                    {userPhoneNum &&
                      userPhoneNum.map((num, i) => (
                        <div
                          className="form-item custom-control custom-switch"
                          key={i}
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={num.number}
                            checked={num.number === curPhoneNum}
                            onChange={selectPhoneNumber}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={num.number}
                          >
                            {phoneNumFormat(num.number)}
                          </label>
                          {num.msgCount > 0 && (
                            <div className="unread-message-count ml-5">
                              {num.msgCount}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="text-right">
                  <Button color="primary" onClick={saveUserPhoneNum}>
                    Save
                  </Button>
                </div>
              </TabPane>
              <TabPane tabId="settingTab2">
                <div className="form-item custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={curStyleMode === 'dark'}
                    id="dark"
                    onChange={changeStyleNode}
                  />
                  <label className="custom-control-label" htmlFor="dark">
                    Dark Mode
                  </label>
                </div>
                <div className="form-item custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="light"
                    checked={curStyleMode === 'light'}
                    onChange={changeStyleNode}
                  />
                  <label className="custom-control-label" htmlFor="light">
                    Light Mode
                  </label>
                </div>
                <div className="text-right">
                  <Button color="primary" onClick={saveUserStyleMode}>
                    Save
                  </Button>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={contactToogle}
        toggle={contactUsModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
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
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth,
  numbers: state.message.numbers,
  userName: state.message.userName,
  styleMode: state.message.numbers.styleMode,
})
const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserData()),
  sendContact: data => {
    dispatch(sendContact(data))
  },
  saveUserNumber: (fromNumber, email) => {
    dispatch(saveUserNumber(fromNumber, email))
  },
  saveStyleMode: (mode, email) => {
    dispatch(saveStyleMode(mode, email))
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
