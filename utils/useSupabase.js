import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
)

const useSupabase = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(supabase.auth.session())

  supabase.auth.onAuthStateChange(async (_event, session) => {
    setSession(session)
  })

  useEffect(() =>{
    const getCurrentUser = async () => {
      if(session?.user.id) {
        const {data: currentUser} = await supabase
          .from('user')
          .select('*')
          .eq('id', session.user.id)

        if(currentUser.length) {
          const foundUser = currentUser[0]
          await supabase
            .from(`user:id=eq.${foundUser.id}`)
            .on('UPDATE', payload => {
              setCurrrentUser(payload.new)
            })
            .subscribe()
          return foundUser
        } else {
          return null
        }
      }
    }
    const foundUser = getCurrentUser()
    setCurrentUser(foundUser)
  }, [session])

  return { currentUser, session, supabase }
}

export default useSupabase
