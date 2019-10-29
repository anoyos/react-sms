import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Route, withRouter } from 'react-router-dom'
import Login from './Login/Login'
import Home from './Home/Home'
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
      </div>
    )
  }
}
const mapStateToProps = state => ({ auth: state.auth })
export default withRouter(connect(mapStateToProps)(App))
