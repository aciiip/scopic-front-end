import {Component} from "react";
import {Box, Button, Card, CardContent, Container, TextField, Typography} from "@material-ui/core";
import MyAppBar from "../../components/MyAppBar/MyAppBar";
import axios from "axios";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setting: null,
            maxAmount: 0
        }
    }
    getData = () => {
        axios.get('http://localhost:8000/api/auto-bid-setting', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            if (response.data.data.setting) {
                const setting = response.data.data.setting
                this.setState({
                    setting: setting,
                    maxAmount: setting.max_amount
                })
            }
        })
    }

    onMaxAmountChange = (event) => {
        this.setState({
            maxAmount: event.target.value
        })
    }

    onSaveClicked = () => {
        axios.post('http://localhost:8000/api/auto-bid-setting', {
            max_amount: this.state.maxAmount
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.getData();
        })
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <>
                <MyAppBar />
                <Container style={{marginTop: '15px'}}>
                    <Card variant={"outlined"}>
                        <CardContent>
                            <Box>
                                <Typography variant={'h6'}>
                                    Auto Bid Setting
                                </Typography>
                            </Box>
                            <Box style={{marginTop: '20px'}}>
                                <TextField value={this.state.maxAmount} onChange={this.onMaxAmountChange} fullWidth variant={'outlined'} label={'Maximum Bid Amount'} />
                            </Box>
                            <Box display={'flex'} justifyContent={'end'} style={{marginTop: '20px'}}>
                                <Button variant={'contained'} color={'primary'} onClick={this.onSaveClicked}>
                                    Save
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </>
        )
    }
}

export default Setting;