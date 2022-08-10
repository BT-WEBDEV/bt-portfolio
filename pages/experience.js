import Head from 'next/head'
import * as React from 'react';
import Drawer from '../components/drawer'

export default function Experience() {
  return (
      <>
      <Head>
        <title>Experience</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Drawer/>
      <h1 className='title'> Experience </h1> 
      </>
    
  )
}