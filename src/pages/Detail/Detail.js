import React, {Component} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    FormControlLabel, FormGroup,
    Grid,
    Typography
} from "@material-ui/core";
import MyAppBar from "../../components/MyAppBar/MyAppBar";
import axios from "axios";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {
                name: '',
                description: '',
                last_bid: 0,
                close_at: ''
            },
            countDays: '',
            countDown: '',
            canBid: false,
            interval: null,
            autoBidding: false,
            canAutoBid: false
        }
    }

    getData = () => {
        const id = this.props.match.params.id;
        axios.get('http://localhost:8000/api/product/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            const res = response.data.data;
            this.setState({
                product: res.product,
            }, () => {
                this.startInterval();
            })
        })
    }

    getAutoBiddding = () => {
        const id = this.props.match.params.id;
        axios.get('http://localhost:8000/api/auto-bidding/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                autoBidding: !!response.data.data.auto_bidding
            })
        })
    }

    startInterval = () => {
        const interval = setInterval(() => {
            this.countDown(this.state.product.close_at)
        });
        this.setState({
            interval: interval
        });
    }

    countDown = (date) => {
        const close = new Date(date).getTime();
        const now = new Date().getTime();
        const distance = close - now;
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this.setState({
                canAutoBid: true,
                canBid: !this.state.autoBidding,
                countDays: days > 0 ? days + ' Days' : '',
                countDown: hours + ':' + minutes + ':' + seconds
            })
        } else {
            this.setState({
                canAutoBid: false,
                canBid: false,
                countDays: '',
                countDown: '0:0:0'
            })
        }
    }

    onBidClicked = () => {
        axios.post('http://localhost:8000/api/bid/' + this.state.product.id, {
            price: this.state.product.last_bid + 1
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            if (response.status === 200) {
                this.getData();
            }
        })
    }

    onAutoBiddingClicked = async () => {
        if (this.state.autoBidding) {
            await axios.delete('http://localhost:8000/api/auto-bidding/' + this.state.product.id, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                // console.log(response)
            })
        } else {
            await axios.post('http://localhost:8000/api/auto-bidding/' + this.state.product.id, {}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                // console.log(response)
            })
        }
        this.setState({
            autoBidding: !this.state.autoBidding,
            canBid: !this.state.autoBidding
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    componentDidMount() {
        this.getData();
        this.getAutoBiddding();
    }

    render() {
        return (
            <>
                <MyAppBar />
                <Container maxWidth={false} style={{marginTop: '20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Card variant={'outlined'}>
                                <CardContent>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {this.state.product.name}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            ${this.state.product.last_bid}
                                        </Typography>
                                    </Box>
                                    {this.state.product.description}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card variant={'outlined'}>
                                <CardContent>
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Typography>
                                            Close At
                                        </Typography>
                                        <Typography>
                                            {this.state.countDays}
                                        </Typography>
                                    </Box>
                                    <Typography variant={'h2'} align={'center'}>
                                        {this.state.countDown}
                                    </Typography>
                                    <Box>
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <Checkbox disabled={!this.state.canAutoBid} checked={this.state.autoBidding} color={'primary'} onClick={this.onAutoBiddingClicked} />
                                            } label="Auto Bidding" />
                                        </FormGroup>
                                        <Button variant={'contained'} color={'primary'} fullWidth disabled={!this.state.canBid} onClick={this.onBidClicked}>
                                            Bid Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }
}
export default Detail;