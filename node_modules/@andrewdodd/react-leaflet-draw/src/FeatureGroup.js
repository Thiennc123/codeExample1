import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FeatureGroup } from 'react-leaflet'
import LeafletDrawControl, {
  DrawPropTypes,
  EditPropTypes,
  PositionPropType
} from './EditControl'

export default class EditControlFeatureGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    onCreated: PropTypes.func,
    onEdited: PropTypes.func,
    onDeleted: PropTypes.func,

    controlProps: PropTypes.shape({
      draw: DrawPropTypes,
      edit: EditPropTypes,
      position: PositionPropType
    })
  }

  constructor () {
    super()
    this._featureGroupRef = React.createRef()
    this._editControlRef = React.createRef()
    this._createStoreRef = this._createStoreRef.bind(this)

    this._onCreated = this._onCreated.bind(this)
    this._onEdited = this._onEdited.bind(this)
    this._onDeleted = this._onDeleted.bind(this)

    this._onActivityStarted = this._onActivityStarted.bind(this)
    this._onActivityStopped = this._onActivityStopped.bind(this)

    this._leaflets = {}
  }

  _createStoreRef (elem) {
    return ref => {
      if (!ref) {
        return
      }
      this._leaflets[ref.leafletElement._leaflet_id] = elem
    }
  }

  _onCreated (e) {
    const { onCreated } = this.props
    onCreated && onCreated(e) // .layer.getLatLngs()[0])
  }

  _onEdited (e) {
    const { onEdited } = this.props
    if (!onEdited) return

    // Call onEdited for each layer included
    e.layers.getLayers().forEach(l => {
      const elem = this._leaflets[l._leaflet_id]
      onEdited(elem, l, e) // .getLatLngs()[0])
    })
  }

  _onDeleted (e) {
    const { onDeleted } = this.props
    if (!onDeleted) return

    // Call onDeleted for each layer included
    e.layers.getLayers().forEach(l => {
      const elem = this._leaflets[l._leaflet_id]
      onDeleted(elem, l, e)
    })
  }

  _onActivityStarted (e) {
    const { onActivityStarted } = this.props
    onActivityStarted && onActivityStarted(e.type)
  }
  _onActivityStopped (e) {
    const { onActivityStopped } = this.props
    onActivityStopped && onActivityStopped(e.type)
  }

  render () {
    const { controlProps } = this.props
    return (
      <FeatureGroup ref={this._featureGroupRef}>
        <LeafletDrawControl
          {...controlProps}
          onDeleted={this._onDeleted}
          onCreated={this._onCreated}
          onEdited={this._onEdited}
          onDrawStart={this._onActivityStarted}
          onEditStart={this._onActivityStarted}
          onDeleteStart={this._onActivityStarted}
          onDrawStop={this._onActivityStopped}
          onEditStop={this._onActivityStopped}
          onDeleteStop={this._onActivityStopped}
          ref={this._editControlRef}
        />
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {
            ref: this._createStoreRef(child)
          })
        })}
      </FeatureGroup>
    )
  }
}
