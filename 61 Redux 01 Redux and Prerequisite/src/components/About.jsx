import React, { useContext } from 'react'
import { useBioContext } from './useContext/UseContextFirst'

export default function About() {
    const value = useBioContext() //pulling from customHook

  return (
    <div>About {value.secretData} - {value.personalInfo}</div>
  )
}
