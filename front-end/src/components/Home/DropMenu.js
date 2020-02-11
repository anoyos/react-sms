import React, { useState } from 'react'
import { connect } from 'react-redux'
import './Home.css'
import {
  addFavoriteMessage,
  deleteFavoriteMessage,
} from '../../actions/message.action'

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

const DropMenu = props => {
  const {
    addFavoriteMessage,
    deleteFavoriteMessage,
    deleteHistory,
    tab,
    fromNumber,
    toNumber,
    email,
  } = props
  const [consDropdown, setconsDropdown] = useState(false)
  const consToggle = () => setconsDropdown(prevState => !prevState)

  const addFavorite = () => {
    addFavoriteMessage(fromNumber, toNumber, email)
  }

  const deleteFavorite = () => {
    deleteFavoriteMessage(fromNumber, toNumber, email)
  }

  return (
    <div>
      <Dropdown isOpen={consDropdown} toggle={consToggle}>
        <DropdownToggle>
          <i className="ti-more"></i>
        </DropdownToggle>
        {tab === 'favTab1' && (
          <DropdownMenu right>
            <DropdownItem onClick={() => addFavorite()}>
              Add Favorite
            </DropdownItem>
            <DropdownItem onClick={() => deleteHistory()}>
              Delete Conversation
            </DropdownItem>
          </DropdownMenu>
        )}
        {tab === 'favTab2' && (
          <DropdownMenu right>
            <DropdownItem onClick={() => deleteFavorite()}>
              Remove from Favorites
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth,
})
const mapDispatchToProps = dispatch => ({
  addFavoriteMessage: (fromNumber, toNumber, email) =>
    dispatch(addFavoriteMessage(fromNumber, toNumber, email)),

  deleteFavoriteMessage: (fromNumber, toNumber, email) =>
    dispatch(deleteFavoriteMessage(fromNumber, toNumber, email)),
})
export default connect(mapStateToProps, mapDispatchToProps)(DropMenu)
