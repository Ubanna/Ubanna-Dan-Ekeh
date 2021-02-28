import React from 'react'
declare const window: any;

type Props = TodoProps & {
    updateTodo: (todo: ITodo) => void
    deleteTodo: (_id: string) => void
}

const Todo: React.FC<Props> = ({ todo, updateTodo, deleteTodo }) => {
  const checkTodo: string = todo.status ? `line-through` : ''
  
  var gapi = window.gapi
  var CLIENT_ID = "571670338573-5kde206c9quqnrs67bf3ngu218cioqm7.apps.googleusercontent.com"
  var API_KEY = "AIzaSyAjVxzcS4AurVv1C1Y52NdI0nihtHTqFwg"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  var SCOPES = "https://www.googleapis.com/auth/calendar";

  const handleClick = (item1: string, item2: string) => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('Working!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
          'summary': item1,
          'location': 'Work',
          'description': item2,
          'start': {
            'dateTime':  "2021-03-05T17:00:00-10:00",
            'timeZone': 'Africa/Lagos'
          },
          'end': {
            'dateTime': '2021-03-28T17:00:00-07:00',
            'timeZone': 'Africa/Lagos'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute((event: { htmlLink: any; }) => {
          console.log(event)
          window.open(event.htmlLink)
        })

        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then((response: { result: { items: any; }; }) => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
    

      })
    })
  }


  return (
    <div className='Card'>
      <div className='Card--text'>
        <h1 className={checkTodo}>{todo.name}</h1>
        <span className={checkTodo}>{todo.description}</span>
      </div>
      <div className='Card--button'>
      <button className='Card--button__event' onClick={() => handleClick(todo.name, todo.description)}>Add Event</button>
        <button
          onClick={() => updateTodo(todo)}
          className={todo.status ? `hide-button` : 'Card--button__done'}
        >
          Complete
        </button>
        <button
          onClick={() => deleteTodo(todo._id)}
          className='Card--button__delete'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Todo
