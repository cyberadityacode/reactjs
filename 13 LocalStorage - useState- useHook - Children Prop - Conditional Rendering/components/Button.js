import React from 'react'

export default function Button({clickToIncrease ,children}) {
  return (
    <button onClick={clickToIncrease}>{children}</button>
  )
}
