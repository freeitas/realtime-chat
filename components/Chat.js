import { useEffect, useState, useRef } from "react"

const Chat = ({ currentUser, session, supabase }) => {
  const [messages, setMessages] = useState([])
  const message = useRef("")

  useEffect(() => {
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

  return (
    <div>
      <p>Welcome, {currentUser.username ? currentUser.username : session.user.email}</p>
      {messages.map(message => <div key={message.id}>{message.content}</div>)}
      <form onSubmit={sendMessage}>
        <input placeholder="Write your message" required ref={message}></input>
        <button type="submit">Send message</button>
      </form>
    </div>
  )
}

export default Chat