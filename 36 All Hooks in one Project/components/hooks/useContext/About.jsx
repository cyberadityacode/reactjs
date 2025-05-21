import React, { useContext } from 'react'
import { BioContext } from './ContextAPIComponent';

export default function About() {
    const {secretData, personalInfo} = useContext(BioContext);
  return (
    
    <div>About {secretData}</div>
  )
}
