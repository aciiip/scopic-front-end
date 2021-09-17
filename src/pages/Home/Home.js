import React, {Component} from "react";
import {
    Box,
    Container,
    Grid, Icon,
    IconButton,
    InputAdornment, MenuItem,
    TextField,
} from "@material-ui/core";
import axios from "axios";
import Pagination from '@material-ui/lab/Pagination';
import MyAppBar from "../../components/MyAppBar/MyAppBar";
import ProductItem from "../../components/ProductItem/ProductItem";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            products: [],
            page: 1,
            order: 'none',
            search: '',
            items: [],
            lastPage: 0
        }
    }

    onPaceClicked = (event, value) => {
        if (this.state.page !== value) {
            this.setState({
                page: value
            }, this.getData);
        }
    }

    getData = () => {
        let url = 'http://localhost:8000/api/product?page=' + this.state.page;
        if (this.state.order && this.state.order !== 'none') {
            url = url + '&order=' + this.state.order;
        }
        if (this.state.search) {
            url = url + '&search=' + this.state.search;
        }
        this.setState({
            loading: true
        });

        axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            const res = response.data.data;
            const items = [];
            res.data.forEach((item, index) => {
                items.push(
                    <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                        <ProductItem item={item} />
                    </Grid>
                );
            });
            this.setState({
                products: res.data,
                loading: false,
                items: items,
                lastPage: res.last_page
            }, () => {
                window.scrollTo(0, 0)
            });
        })
    }

    componentDidMount() {
        this.getData();
    }

    onSearchChange = (event) => {
        this.setState({
            search: event.target.value
        });
    }

    onSearchKeyup = (event) => {
        switch (event.keyCode) {
            case 13 :
                this.getData();
                break;
            default:
                event.preventDefault();
                break;
        }
    }

    onSearchSubmit = () => {
        this.setState({
            page: 1
        }, this.getData);
    }

    onPriceOrderChange = (event) => {
        this.setState({
            order: event.target.value,
            page: 1
        }, this.getData);
    }

    render() {
    return (
        <>
            <MyAppBar />
            <Container maxWidth={false}>
                <Box
                    component={'div'}
                    display={'flex'}
                    justifyContent={'end'}
                    paddingTop={'20px'}
                    paddingBottom={'20px'}
                    gridColumnGap={'10px'}>
                    <TextField
                        onChange={this.onSearchChange}
                        defaultValue={this.state.search}
                        variant={'outlined'}
                        size={'small'} label={'Search'}
                        onKeyUp={this.onSearchKeyup}
                        InputProps={{
                        endAdornment: <InputAdornment position={'end'}>
                            <IconButton edge={'end'} size={'small'} onClick={this.onSearchSubmit}>
                                <Icon>search</Icon>
                            </IconButton>
                        </InputAdornment>
                    }} />
                    <TextField
                        select
                        variant={'outlined'}
                        size={'small'}
                        label={'Price Order'}
                        value={this.state.order}
                        onChange={this.onPriceOrderChange}>
                        <MenuItem value={'none'}>Default</MenuItem>
                        <MenuItem value={'asc'}>Low to High</MenuItem>
                        <MenuItem value={'desc'}>High to Low</MenuItem>
                    </TextField>
                </Box>
                <Grid container spacing={2}>
                    {this.state.items}
                </Grid>
                <Box component={'div'} display={'flex'} justifyContent={'center'} style={{margin: '20px 0'}}>
                    <Pagination
                        page={this.state.page}
                        count={this.state.lastPage}
                        color={"primary"}
                        onChange={this.onPaceClicked} />
                </Box>
            </Container>
        </>
    )
    }
}

export default Home;