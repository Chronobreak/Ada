import React, { Component } from "react";
import axios from "axios";

import {
  graphql,
  Query,
  Mutation,
  withApollo,
  ApolloConsumer,
  compose
} from "react-apollo";
import { gql } from "apollo-boost";
import client from "../index.jsx";
import "babel-polyfill";
import { Grid, Input, Button } from "semantic-ui-react";


class UploadComponent extends Component {
  constructor(props) {
    super(props);
    this.sendImageUrl = this.sendImageUrl.bind(this);
    this.uploadToTF = this.uploadToTF.bind(this);
  }

  uploadToTF(e){
    e.preventDefault();
    let input = document.getElementById("embedpollfileinput");
    let imageFile = input.files[0];
    let data = new FormData()
    data.append('image', imageFile);
    data.set('username', this.props.username)
    let endpoint = `/send`;

    axios.post(endpoint, data)
      .then(({data})=>{
        this.props.handleStateChange('inventory',data)
    })
    .catch(err=>console.log(err))
  }

  sendImageUrl(){
    let endpoint = '/send'
    axios.post(endpoint, {imageUrl: this.props.imageUrl, username: this.props.username})
      .then(({data}) => {
        this.props.handleStateChange('inventory', data);
      })
  }

  render() {
    return (
      <div>
        <Grid style={{ margin: "10px" }}>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <div>
                <div>
                  <label
                    htmlFor="embedpollfileinput"
                    className="ui large blue right floated button">
                    <input type="file"
                      onChange={this.uploadToTF}
                      className="inputfile" id="embedpollfileinput"
                      style={{ width: "0.1px",   height: "0.1px",  opacity: "0", overflow: "hidden",  position: "absolute",    zIndex: "-1"
                      }}/>
                    <i className="ui upload icon" />
                    Upload image
                  </label>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <Input
                  action={<Button className="ui left floated button" onClick={this.sendImageUrl}>Upload</Button>}
                  size='large' 
                  placeholder='Upload with URL' 
                  value={this.props.imageUrl} 
                  onChange={this.props.handleImageUrl}/>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


const UPLOAD_FILE = gql`
  mutation singleUpload($input: Upload!) {
    singleUpload(input: $input) 
  }
`;

const UPLOAD_LARGE_FILE = gql`
  mutation uploadLargeFile($input: String!, $name: String) {
    uploadLargeFile(input: $input, name: $name) {
      _id
      name
      brandName
      timestamp
      url
      price
      imageUrl
    }
  }
`

export default compose(
  graphql( UPLOAD_LARGE_FILE, {name: "largeUpload"}),
  graphql( UPLOAD_FILE , { name: "imageUpload" })
)(UploadComponent);
