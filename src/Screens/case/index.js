import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Menu from '../../components/Menu'

import Search from './search/index'
import CreateCase from './createCase/CreateCase'
import Penging from './penging/index'
import API from '../../services/api';
import Snackbar from '../../components/Snackbar';

export class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loader: {
        open: false,
        type: 'info',
        message: ''
      }
    }
    this.state.menuOptions = []
  }

  async componentDidMount() {
    try {
      const response = await API.get('/fields')

      if (response.status !== 200) return

      this.setState({ menuOptions: response.data.menu })

      this.setState({
        ...this.state,
        loader: {
          ...this.state.loader,
          open: true,
          type: 'success',
          message: 'Autenticado com successo!'
        }
      })
    } catch (err) {
      console.log(err)
      this.setState({
        ...this.state,
        loader: {
          ...this.state.loader,
          open: true,
          type: 'error',
          message: 'Usuario nao autenticado!'
        }
      })
    }
  }

  render() {
    return (
      <div>
        <Menu menuOptions={this.state.menuOptions} />
        {
          this.state.menuOptions &&
          <div>
            <Route path='/' exact component={Search} />
            <Route path='/case' component={CreateCase} />
            <Route path='/penging' component={Penging} />
          </div>
        }
        <Snackbar
          isOpen={this.state.loader.open}
          type={this.state.loader.type}
          message={this.state.loader.message}
          onClose={() => this.setState({ ...this.state, loader: { ...this.state.loader, open: false } })} />
      </div>
    )
  }
}

export default index
