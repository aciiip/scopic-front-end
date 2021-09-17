import React from "react";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

function ProductItem ({item}) {
    return (
        <>
            <Card className={'product-list-item'} variant={'outlined'}>
                <CardContent>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <Typography gutterBottom variant="h6" component="h2">
                            {item.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="h2">
                            ${item.last_bid}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {item.description}
                    </Typography>
                </CardContent>
                <CardActions style={{display: 'flex', justifyContent: 'end'}}>
                    <Button component={Link} to={`/detail/${item.id}`} variant={'text'} color={'primary'}>
                        Bid Now
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}

export default ProductItem;