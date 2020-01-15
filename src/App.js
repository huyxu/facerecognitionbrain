import React, { Component, Fragment } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
	apiKey: '1581297cc57749d4b3e876f561b36fda'
});

const particlesOptions = {
	"particles": {
		"number": {
			"value": 180,
			"density": {
				"enable": true,
				"value_area": 868.1035095057337
			}
		},
		"color": {
			"value": "#ffffff"
		},
		"shape": {
			"type": "circle",
			"stroke": {
				"width": 0,
				"color": "#000000"
			},
			"polygon": {
				"nb_sides": 4
			},
			"image": {
				"src": "img/github.svg",
				"width": 100,
				"height": 100
			}
		},
		"opacity": {
			"value": 0.5,
			"random": false,
			"anim": {
				"enable": false,
				"speed": 1,
				"opacity_min": 0.1,
				"sync": false
			}
		},
		"size": {
			"value": 3,
			"random": true,
			"anim": {
				"enable": false,
				"speed": 40,
				"size_min": 0.1,
				"sync": false
			}
		},
		"line_linked": {
			"enable": true,
			"distance": 150,
			"color": "#ffffff",
			"opacity": 0.4,
			"width": 1
		},
		"move": {
			"enable": true,
			"speed": 6,
			"direction": "none",
			"random": false,
			"straight": false,
			"out_mode": "out",
			"bounce": false,
			"attract": {
				"enable": false,
				"rotateX": 600,
				"rotateY": 1200
			}
		}
	},
	"interactivity": {
		"detect_on": "canvas",
		"events": {
			"onhover": {
				"enable": true,
				"mode": "repulse"
			},
			"onclick": {
				"enable": true,
				"mode": "push"
			},
			"resize": true
		},
		"modes": {
			"grab": {
				"distance": 400,
				"line_linked": {
					"opacity": 1
				}
			},
			"bubble": {
				"distance": 400,
				"size": 40,
				"duration": 2,
				"opacity": 8,
				"speed": 3
			},
			"repulse": {
				"distance": 200,
				"duration": 0.4
			},
			"push": {
				"particles_nb": 4
			},
			"remove": {
				"particles_nb": 2
			}
		}
	},
	"retina_detect": true
}

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: [],
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}
		}
	}

	loadUser = (data) => {
		this.setState({ user: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}});
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);

		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}

	displayFaceBox = (box) => {
		this.setState({ box: box });
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	}

	onPictureSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => {
				if (response) {
					fetch('http://localhost:3001/image', {
						method: 'put',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user, { entries: count }));
					});
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => console.log(err));
	}

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState({ isSignedIn: false });
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	}

	render() {
		const { route, isSignedIn, box, imageUrl, user } = this.state;

		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
				{route === 'home'
					?<Fragment>
						<Logo />
						<Rank name={user.name} entries={user.entries} />
						<ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
						<FaceRecognition box={box} imageUrl={imageUrl} />
					</Fragment>
					:(route === 'register' 
						?<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
						:<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					)					 
				}
			</div>
		)
	};
}

export default App;
