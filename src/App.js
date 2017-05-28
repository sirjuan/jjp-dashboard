import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

const YW_API_URL = 'https://api.aftership.com/v4'
const YW_API_KEY = '177fa335-c16f-4ff2-ad31-34fb094f27c5'
const options = {
  headers: {
    'Content-Type': 'application/json',
    'aftership-api-key': YW_API_KEY,
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {trackings: [], inputNumber: '', inputTitle: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

handleChange(event) {
  this.setState({[event.target.name]: event.target.value});
}
handleSubmit(event) {
  event.preventDefault();
  this.postTracking();
}
  getLatestNewsFromHS() {
    const GOOGLE_FEED_API_URL = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=';
    const url = GOOGLE_FEED_API_URL + 'http://www.hs.fi/rss/tuoreimmat.xml';
    fetch('http://www.nasa.gov/rss/dyn/breaking_news.rss')

    .then(text => console.log(text))
  }
  getTrackings() {
    fetch(YW_API_URL + '/trackings', options)
    .then(response => response.json())
    .then(json => {
      console.log(json)
      this.setState({trackings: json.data.trackings})
    })
  }

  postTracking() {
    const tracking = {
      tracking: {
        tracking_number: this.state.inputNumber,
        title: this.state.inputTitle.length ? this.state.inputTitle : null
      }
    }
    fetch(YW_API_URL + '/trackings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'aftership-api-key': YW_API_KEY,
      },
      body: JSON.stringify(tracking)
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
  }

  deleteTracking(slug, id) {
    axios.delete(YW_API_URL + '/trackings/'+ slug + '/' + id, {
      headers: {
        'Access-Control-Allow-Methods': 'DELETE',
        'aftership-api-key': YW_API_KEY,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
      },
    })
    .then(response => console.log(response))
    .then(response => this.getTrackings())
    .catch(err => console.log(err))
  }

  componentWillMount() {
    //this.postTracking()
    this.getTrackings()
    this.getLatestNewsFromHS()
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            Lisää träkkäys
            <input type="text" name="inputTitle" value={this.state.inputTitle} onChange={this.handleChange} />
            <input type="text" name="inputNumber" value={this.state.inputNumber} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Lisää" />
        </form>
        { this.state.trackings.map((tracking, index) => (
          <div key={index}>
          <h2>{tracking.title}</h2>
          {console.log(tracking)}
        {  tracking.checkpoints.map((checkpoint, index) => <p key={index}>{checkpoint.message}</p>)}
            <button onClick={() => this.deleteTracking(tracking.slug, tracking.tracking_number)}>Delete</button>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
