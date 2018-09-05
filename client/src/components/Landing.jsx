import React from 'react'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import NavBar from './NavBar.jsx'
import {
  Grid,
  Image,
  Menu,
  Form,
  Checkbox,
  Card,
  Icon,
  Button
} from "semantic-ui-react";
import Discover from './Discover.jsx'

export default class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  playVideo(){
    let video = document.getElementById("bannerVid")
    video.play()
  }
  

  render() {
    return (
      <div>
        <div className="main">
          <div className="main-wrapper">
            <div className={this.props.offSetY<=42 ? "fadeOut" : "fadeIn"} style={{fontFamily: "Roboto", leftPadding: "20px", fontSize: "40px", padding: "18px",   position: "absolute", color: "white", zIndex:"1000"}}>
              <div> ADA</div>
            </div>
            <div className="top-banner" style={{position:"relative"}}>
              <div className="jsx-3126485111 HeaderSimple__Media" >
                <video id="bannerVid" overflow="hidden" height="100%" width="100%" autoPlay muted loop>
                  <source src="https://videos.ctfassets.net/cvlcgjxo5px5/4vSRHQxtbikYSOOqyME2IG/f60840f3c2e750ddb4fd7eafe86d6cfb/BM_INTRO_V1_NOTEXT.mp4"/>
                </video>
                <div style={{position:"absolute", top:"50%", left:"50%", transform: "translate(-50%, -50%)", textAlign:"center", color:"#FFF", display:"flex", flexDirection:"column", justifyContent:"center"}}>
                  <div className="jsx-3126485111 inner">
                    <p style={{fontSize:"3.5rem", lineHeight:"0"}}>Introducing Ada</p>
                    <p style={{fontSize:"2.0rem", lineHeight:"120%"}}>Your AI fashion assistant</p>
                    <Link to="/detect" className="jsx-960340962 button Button Button--transparent Button--inline HeaderSimple__CTA" style={{color:"#333",background:"rgba(255,255,255,0.8)", padding:"8px", border: "1px solid #fff"}}>Try Out Now </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="Trend" style={{marginTop:100}}>
              <h1 style={{textAlign:"center"}}>
                What's Trending
              </h1>
              <Discover />
              <Grid centered style={{marginTop:50}}>
                <div style={{margin: "12px 5px 20px 0px"}}>
                  <Grid.Column>
                    <img src="https://builder.io/api/v1/image/assets%2F8vNMbZH3AvNtwzSXWef6QW77P102%2F348f1d9d44754191bc6cfd2cc3c74ec4?height=400&quality=75&width=400"></img>
                    <h5>Summer Trends 2018</h5>
                  </Grid.Column>
                </div>
                <div style={{margin: "12px 5px 20px 0px"}}>
                  <Grid.Column>
                    <img src="https://builder.io/api/v1/image/assets%2F8vNMbZH3AvNtwzSXWef6QW77P102%2F25154b733dac4a93ac146d7f9f63f24a?height=400&quality=75&width=400"></img>
                    <h5>Top 10 Summer Kicks</h5>
                  </Grid.Column>
                </div>
                <div style={{margin: "12px 5px 20px 0px"}}>
                  <Grid.Column>
                    <img src="https://builder.io/api/v1/image/assets%2F8vNMbZH3AvNtwzSXWef6QW77P102%2F41d8b95970904727ab5557610d2b90ad?height=400&quality=75&width=400"></img>
                    <h5>The Ultimate Guide to Jumpsuits</h5>
                  </Grid.Column>
                </div>
              </Grid>
            </div>
          </div >
        </div>
      </div>
    )
  }
}