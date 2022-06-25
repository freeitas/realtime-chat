import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Auth from '../components/Auth'
import Chat from '../components/Chat'

export default function Home({ session, supabase }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(!!session)
  },[session])

  return (
    <div className={styles.container}>
      <Head>
        <title>Real-Time chat with Next.js + Supabase</title>
      </Head>

      <main className={styles.main}>
       {loggedIn ? <Chat supabase={supabase} /> : <Auth supabase={supabase} />}
      </main>
    </div>
  )
}
