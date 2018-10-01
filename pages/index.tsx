import logo from "../images/dark.png"
import logo2x from "../images/dark@2x.png"
import "./index.css"
import * as React from "react"

export default () => (
  <div className="Index">
    <img src={logo} srcSet={`${logo} 1x, ${logo2x} 2x`} />
  </div>
)
