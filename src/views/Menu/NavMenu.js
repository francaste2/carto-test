import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: 4,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    btnFind:{
      marginLeft: 4,
    }
  }));

function NavMenu(){
  const classes = useStyles();
  // use history to send data to basemap.
  const history = useHistory();
  history.push({pathname:"/",state:{date: ['2017-01-01', '2017-01-10']}});
  // Find Clicked > send data to BaseMap and fetch earthquakes between dates.
  function handleClick(e) {
    e.preventDefault();
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value
    history.push({pathname:"/",state:{date: [from, to]}});
  }

  return (
    <AppBar position="absolute" color="default">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
            Earthquakes
        </Typography>
        <Typography>
          <form className={classes.container} noValidate>
            <TextField
              id="from"
              label="From"
              type="date"
              defaultValue="2017-10-01"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            /> &nbsp;&nbsp;
            <TextField
              id="to"
              label="To"
              type="date"
              defaultValue="2017-10-16"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button size="small" variant="contained" color="secondary" onClick={handleClick}> Find</Button>
          </form>
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default NavMenu