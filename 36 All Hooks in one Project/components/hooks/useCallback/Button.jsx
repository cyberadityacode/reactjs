import React, { Children, memo } from 'react'

function Button({onClick,children}) {
    console.log('clicked', children);
  return (
    <>
        <button className='p-3 m-3 border' onClick={onClick}>{children}</button>
    </>
  )
}
export default memo(Button);