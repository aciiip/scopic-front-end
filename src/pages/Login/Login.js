import {Component} from "react";
import {Box, Button, Card, CardContent, Container, TextField, Typography} from "@material-ui/core";
import './Login.css';
import axios from "axios";
import {Alert} from "@material-ui/lab";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            usernameError: {
                status: false,
                message: ''
            },
            passwordError: {
                status: false,
                message: ''
            },
            errorMessage: ''
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.props.history.replace('/');
        }
    }

    onUsernameChanged = (event) => {
        this.setState({
            username: event.target.value,
            usernameError: {
                status: false,
                message: ''
            },
            errorMessage: ''
        })
    }

    onPasswordChanged = (event) => {
        this.setState({
            password: event.target.value,
            passwordError: {
                status: false,
                message: ''
            },
            errorMessage: ''
        })
    }

    loginSubmit = async () => {
        if (this.state.username.length <= 0) {
            await this.setState({
                usernameError: {
                    status: true,
                    message: 'Username is required'
                }
            });
        }
        if (this.state.password.length <= 0) {
            await this.setState({
                passwordError: {
                    status: true,
                    message: 'Password is required'
                }
            });
        }

        if (!this.state.usernameError.status && !this.state.passwordError.status) {
            this.requestLogin();
        }
    }

    requestLogin = () => {
        axios.post('http://localhost:8000/api/login', {
            username: this.state.username,
            password: this.state.password
        }).then(response => {
            localStorage.setItem('token', response.data.data.token);
            this.props.history.replace('/');
        }).catch(error => {
            this.setState({
                errorMessage: error.response.data.message
            })
        })
    }

    render() {
        return(
            <>
                <Box className={'login-container'}>
                    <Container>
                        <Typography variant={'h6'} component={'h1'} style={{color: 'white', paddingTop: '15px'}}>
                            Scopic
                        </Typography>
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'90vh'}>
                            {this.state.errorMessage.length > 0 ? (
                                <Alert variant={'standard'} severity={'error'} style={{marginBottom: '10px'}}>
                                    {this.state.errorMessage}
                                </Alert>
                            ) : null}
                            <Card variant={'outlined'} style={{width: '320px'}}>
                                <CardContent style={{padding: '30px'}}>
                                    <Box component={'div'} display={'flex'} justifyContent={'center'}>
                                        <Typography variant={'h6'}>
                                            Login
                                        </Typography>
                                    </Box>
                                    <Box
                                        component={'form'}
                                        display={'flex'}
                                        flexDirection={'column'}
                                        style={{marginTop: '20px'}}>
                                        <TextField
                                            error={this.state.usernameError.status}
                                            helperText={this.state.usernameError.message}
                                            autoComplete={'username'}
                                            label={'Username'}
                                            onChange={this.onUsernameChanged} />
                                        <TextField
                                            error={this.state.passwordError.status}
                                            helperText={this.state.passwordError.message}
                                            autoComplete={'current-password'}
                                            type={'password'}
                                            label={'Password'}
                                            value={this.state.password}
                                            onChange={this.onPasswordChanged}
                                            style={{marginTop: '20px'}} />
                                        <Button color={'primary'} variant={'contained'} style={{marginTop: '40px'}} onClick={this.loginSubmit}>
                                            Login
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Container>
                </Box>
            </>
        );
    }
}