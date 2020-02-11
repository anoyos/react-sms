import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Route, withRouter } from 'react-router-dom'
import Login from './Login/Login'
import Home from './Home/Home'
import History from './CallHistory/History'
import Voicemails from './Voicemails/Voicemails'
import VoicemailsList from './Voicemails/VoicemailsList'
import authenticate from './common/Authenticate'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth_token: '',
    }
  }
  componentDidUpdate(preProps) {
    const { auth_token } = this.props.auth
    if (auth_token !== preProps.auth.auth_token) {
      this.setState({
        auth_token: auth_token,
      })
      axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token
    }
  }
  render() {
    return (
      <div>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={authenticate(Home)} />
        <Route exact path="/callhistory" component={authenticate(History)} />

        <Route
          exact
          path="/voicemails/list/:vmbox_id"
          component={authenticate(VoicemailsList)}
        />
        <Route exact path="/voicemails" component={authenticate(Voicemails)} />
      </div>
    )
  }
}
const mapStateToProps = state => ({ auth: state.auth })
export default withRouter(connect(mapStateToProps)(App))
