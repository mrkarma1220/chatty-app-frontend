import React from 'react'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Switch } from 'react-router-dom';

function LoadingBar({bar}) {
    return (
        <Loader
          type={bar ? 'Bars' : "MutatingDots"}
          color="#7e4eac"
          secondaryColor="white"
          height={100}
          width={100}
          background='rgba(0,0,0,0.3)'
        />
    )
}

export default LoadingBar
