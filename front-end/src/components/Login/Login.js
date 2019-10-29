import React from 'react'
import { connect } from 'react-redux'
import { getNewAuthToken } from '../../actions/auth.action'
import { ToastContainer, toast } from 'react-toastify'
import './Login.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      accountname: '',
    }
  }
  componentDidUpdate(preProps) {
    let { auth_token, auth_fail } = this.props.auth
    if (auth_token !== preProps.auth.auth_token) {
      if (auth_token) {
        localStorage.setItem('token', auth_token)
        localStorage.setItem('currentPhoneNum', '')
        this.props.history.push('/home')
      }
    }
    if (this.props !== preProps) {
      if (auth_fail) {
        this.loginFail()
      }
    }
  }
  handleChange = e => {
    if (e.key === 'Enter') {
      this.submit()
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      })
    }
  }
  submit = () => {
    this.props.getNewAuthToken(
      this.state.username,
      this.state.password,
      this.state.accountname,
    )
  }
  loginFail = () => {
    toast.error('Please check login information !', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
  render() {
    return (
      <div className="form-membership">
        <ToastContainer autoClose={5000} />
        <div className="form-wrapper">
          <div className="logo"></div>
          <h5>Sign in</h5>
          <div className="form-group input-group-lg">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username or email"
              onChange={this.handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group input-group-lg">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group input-group-lg">
            <input
              type="text"
              name="accountname"
              className="form-control"
              placeholder="Account Name"
              onKeyPress={this.handleChange}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.submit}
          >
            Sign in
          </button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => ({
  getNewAuthToken: (username, password, accountname) =>
    dispatch(getNewAuthToken(username, password, accountname)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
