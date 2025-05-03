import React from 'react'
import styles from './Button.module.css'

console.log('--------',styles);
export default function Button({clickToIncrease ,children}) {
  return (
    <button className={styles.button} onClick={clickToIncrease}>{children}</button>
  )
}
