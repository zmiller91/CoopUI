'use client'

import React from "react";
import auth from "../../client/auth";

export default class Info extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          message: ""
        }
      }


    componentDidMount() {
        auth.get("/new", (response) => {
            this.setState({message: response.data})
        })
    }


  render() {
    return (

        <div>
            {this.state.message}
        </div>



    );
  }
}
