import { useEffect, useState, useRef } from "react"

const Chat = ({ currentUser, session, supabase }) => {
  const [messages, setMessages] = useState([])
  const message = useRef("")
  const [editingUserName, setEditingUserName] = useState(false)
  const newUsername = useRef("")

  useEffect(() => {
    console.log(currentUser)
    const getMessages = async () => {
      let { data: messages, error} = await supabase
        .from('message')
        .select('*')

      setMessages(messages)
    }

    getMessages()

    const setupMessagesSubscription = async () => {
      await supabase
        .from('message')
        .on('INSERT', payload => {
          setMessages(previous => [].concat(previous, payload.new))
        })
        .subscribe()
    }
    
    setupMessagesSubscription()
  }, [])

  const sendMessage = async evt => {
    evt.preventDefault()

    const content = message.current.value
    await supabase
      .from('message')
      .insert([
        { content, user_id: session.user.id }
      ])

    message.current.value = ""
  }

  const logout = evt => {
    evt.preventDefault()
    window.localStorage.clear()
    window.location.reload()
  }

  const setUserName = async evt => {
    evt.preventDefault()
    const username = newUsername.current.value
    await supabase
      .from('user')
      .insert([
        { ...currentUser, username }
      ], { upsert: true })
    newUsername.current.value = ""
    setEditingUserName(false)
  }

  return (
    <div>
      <div>
        <p>Welcome, {currentUser.username ? currentUser.username : session.user.email}</p>
        <div>
          {editingUserName ? (
            <form onSubmit={setUserName}>
              <input placeholder="new username" required ref={newUsername}></input>
              <button type="submit">Update username</button>
            </form>
          ) : (
            <div>
              <button onClick={() => setEditingUserName(true)}>Edit Username</button>
              <button onClick={evt => logout(evt)}>Log out</button>
            </div>
          )}
        </div>
      </div>

      {messages.map(message => <div key={message.id}>{message.content}</div>)}
      <form onSubmit={sendMessage}>
        <input placeholder="Write your message" required ref={message}></input>
        <button type="submit">Send message</button>
      </form>
    </div>
  )
}

export default Chat