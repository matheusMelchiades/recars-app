import React, { Component } from 'react'
import { getPendencies, approvePendencies } from '../../../services/api'
import {
  Paper, withStyles, Table, TableHead,
  TableBody, TableCell, TableRow, Checkbox, Button
} from '@material-ui/core'

export class Penging extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selecteds: [],
      pending: []
    }
  }

  async componentDidMount() {
    this.refresh()
    console.log('chamo')
  }

  refresh = async () => {
    try {
      const response = await getPendencies();

      if (response.status !== 200) return

      this.setState({ pending: response.data })
    } catch (err) {
      console.log(err)
    }
  }

  selectItem = (item) => {

    if (this.itemIsSelected(item)) {
      const filterItems = this.state.selecteds.filter(selected => selected && selected._id !== item._id)

      this.setState({ selecteds: filterItems })
    } else
      this.setState({ selecteds: [...this.state.selecteds, item] })
  }

  selectAll = () => {
    const lengthSelected = this.state.selecteds.length
    const lengthPeding = this.state.pending.length || 0

    if (lengthSelected === lengthPeding)
      this.setState({ selecteds: [] })
    else
      this.setState({ selecteds: [...this.state.pending] })
  }

  itemIsSelected = (item) => this.state.selecteds.some(selected => selected && selected._id === item._id)


  handleApproveSelecteds = async () => {
    try {
      const { selecteds } = this.state;

      const response = await approvePendencies({ pendencies: selecteds })

      if (response.status !== 200) return

      this.setState({ selected: [] }, this.refresh)
    } catch (err) {
      console.log(err)
    }
  }

  handleCopy = (text) => {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input)
  }

  render() {
    const { classes } = this.props

    if (this.state.pending && !this.state.pending.length) return false

    return (
      <div>
        <Button onClick={this.handleApproveSelecteds} variant="contained">
          Add
        </Button>
        <Paper className={classes.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Checkbox onClick={this.selectAll} />
                </TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Model</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">GeneralUse</TableCell>
                <TableCell align="center">Competence</TableCell>
                <TableCell align="center">Price Average</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.pending.map((newCase, index) => {
                  const isSelected = this.itemIsSelected(newCase)
                  return (
                    <TableRow key={index}
                      className={newCase.error ? classes.error : ''}
                      hover={!newCase.error} selected={isSelected}
                      onClick={newCase.error ? () => ({}) : () => this.selectItem(newCase)}
                      onDoubleClick={(e) => this.handleCopy(newCase._id)}>
                      <TableCell align="center">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="center">{newCase.brand}</TableCell>
                      <TableCell align="center">{newCase.model}</TableCell>
                      <TableCell align="center">{newCase.category}</TableCell>
                      <TableCell align="center">{newCase.type}</TableCell>
                      <TableCell align="center">{newCase.generalUse}</TableCell>
                      <TableCell align="center">{newCase.competence}</TableCell>
                      <TableCell align="center">{newCase.priceAverage}</TableCell>
                      <TableCell align="center">{newCase.quantity}</TableCell>
                      <TableCell align="center">{newCase.createdBy.username}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </Paper>
      </div >
    )
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 5,
    overflowX: 'auto'
  },
  error: {
    backgroundColor: '#e57373'
  }
})

export default withStyles(styles)(Penging)
