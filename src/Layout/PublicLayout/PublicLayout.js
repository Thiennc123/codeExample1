import React, { Fragment, Component } from "react";

export default class PublicLayout extends Component {
  render() {
    const Component = this.props.component;
    return (
      <Fragment>
        <Component/>
      </Fragment>
    );
  }
}
