import React from 'react'
import { connect } from 'react-redux'
import { getNewAuthToken } from '../../actions/auth.action'
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
    let { auth_token } = this.props.auth
    if (auth_token !== preProps.auth.auth_token) {
      if (auth_token) {
        localStorage.setItem('token', auth_token)
        localStorage.setItem('currentPhoneNum', '')
        this.props.history.push('/home')
      }
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }
  submit = () => {
    this.props.getNewAuthToken(
      this.state.username,
      this.state.password,
      this.state.accountname,
    )
  }
  render() {
    return (
      <div className="form-membership">
        <div className="form-wrapper">
          <div className="logo">
            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50.004px"
              height="50.003px"
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
          </div>
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
          <hr />
          <p className="text-muted">Login with your social media account.</p>
          <ul className="list-inline">
            <li className="list-inline-item">
              <button className="btn btn-floating btn-facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-twitter">
                <i className="fab fa-twitter"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-dribbble">
                <i className="fab fa-dribbble"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-linkedin">
                <i className="fab fa-linkedin-in"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-google">
                <i className="fab fa-google"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-behance">
                <i className="fab fa-behance"></i>
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-floating btn-instagram">
                <i className="fab fa-instagram"></i>
              </button>
            </li>
          </ul>
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
