import React from 'react'
import Link from 'next/link'

function Navigator () {
  return (
    <nav>
      <Link href='/'><a>index</a></Link>{' | '}
      <Link href='/inject-array'><a>injectArray</a></Link>
    </nav>
  )
}

export default React.memo(Navigator)