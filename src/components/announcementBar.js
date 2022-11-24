import React, { Component } from "react";
import { AppBar, Typography } from "@mui/material";
import "./announcement.css";
class AnnouncementBar extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <AppBar
          style={{ position: "fixed", backgroundColor: "darkgray", height: 50 }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography>
              <span className="announcementText">Online Shopping Store</span>
            </Typography>
            {/* &emsp; */}
          </div>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default AnnouncementBar;
