import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "501ebb1e3b0e445095de3cb195dab5d0";
const CLIENT_SECRET = "3af2f0a89a6a49eb867c677e1009afb0";

function App() {
  //state to maintain input provided by the user
  const [searchInput, setSearchInput] = useState("");
  // state to store the access token
  const [accessToken, setAccessToken] = useState("");
  // albums -> stores all the album of an artist, being fetched with the API
  const [albums, setAlbums] = useState([]);

  // we don't want to call API each time the code gets refreshed, so 
  // useEffect hook comes into picture.
  useEffect(() => {
    // API access token
    //-------------------
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    // return promise
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      // -----------------
  }, [])
    
  // Search
  // function needs to be asynchronous because
  // inside the function we've lot of fetch statements and each fetch statements
  // wait for it's turn.(it uses keyword 'wait')
  async function search() {

    // Get request - get the artist Id of the inputSearch
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id });
    // Get Request - Grab all albums belonging to the artistId

    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        setAlbums(data.items)
      })
  }
  //  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder='Search for artist e.g. Taylor swift'
            type='input'
            onKeyPress={event => {
              if (event.key == "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>

      <Row className="mx-2 row row-cols-4">
        {albums.map((album, i) => {
          console.log(album);
          return (
            <Card>
              <Card.Img src={album.images[0].url} />
              <Card.Body>
                <Card.Title>
                  {album.name}
                </Card.Title>
              </Card.Body>
            </Card>
          )
        })}
      </Row>
    </div>
  );
}

export default App;