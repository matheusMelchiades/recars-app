import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import helper from '../../helper/auth'
import Menu from '../../components/Menu'

import Search from './search/index'
import CreateCase from './createCase/CreateCase'
import Penging from './penging/index'
import Approved from './approved/index';
import API from '../../services/api';
import Snackbar from '../../components/Snackbar';

export class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      snackbar: {
        open: false,
        type: 'info',
        message: ''
      },
      auth: false
    }
    this.state.menuOptions = []
  }

  async componentDidMount() {
    try {
      const user = await helper.getUser()

      API.defaults.headers.common['Authorization'] = `Bearer ${user.token}`

      const response = await API.get('/fields')

      if (response.status !== 200) return

      this.setState({ menuOptions: response.data.menu, auth: true })

      this.setState({
        ...this.state,
        snackbar: {
          ...this.state.snackbar,
          open: true,
          type: 'success',
          message: 'Autenticado com successo!'
        }
      })
    } catch (err) {
      console.log(err)
      this.setState({
        ...this.state,
        snackbar: {
          ...this.state.snackbar,
          open: true,
          type: 'error',
          message: 'Usuario nao autenticado!'
        }
      })
      this.props.history.push('/login')
    }
  }

  render() {
    return (
      this.state.auth &&
      <div>
        <Menu menuOptions={this.state.menuOptions} />
        {
          this.state.menuOptions &&
          <div>
            <Route path='/' exact component={Search} />
            <Route path='/case' component={CreateCase} />
            <Route path='/penging' component={Penging} />
            <Route path='/cases' component={Approved} />
          </div>
        }
        <Snackbar
          isOpen={this.state.snackbar.open}
          type={this.state.snackbar.type}
          message={this.state.snackbar.message}
          onClose={() => this.setState({ ...this.state, snackbar: { ...this.state.snackbar, open: false } })} />
      </div>
    )
  }
}

export default index
