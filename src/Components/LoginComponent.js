import React from 'react';
import '../css/LoginComponent.css';

import {LoginButton} from '@solid/react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";

import background from '../assets/solid_background.jpg'

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

function LoginComponent() {
    const classes = useStyles();

    return (
        <div className="center">
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={background}
                        title="Building an encyclopedia that is understandable for machines"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Solid
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Log in met je Solid Pod. Indien je nog geen Pod heb kan je <a href="https://inrupt.net/">hier</a> eentje aanmaken
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <LoginButton className="loginButton"
                                 popup="https://solid.inrupt.net/common/popup.html">Login</LoginButton>
                </CardActions>
            </Card>
        </div>
    );
}

export default LoginComponent;
