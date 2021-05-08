import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import PersonIcon from '@material-ui/icons/Person';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {makeStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {AuthContext} from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    app: {
        color: '#EDF2F4',
        backgroundColor: '#2B2D42',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
    },
    nav: {
        display: 'flex',
    },
    icon: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: '5%',
    },
    tabs: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    menu: {
        marginLeft: -50,
        marginTop: 60,
        height: 200,
    },
    menuItms: {
        width: 150,
        height: 40
    }
}));

export default function Navbar() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const {updateAuth, updateToken} = useContext(AuthContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        setAnchorEl(null);
        window.location.href = '/#/app/profile';
    }

    const handleLogout = () => {
        setAnchorEl(null);
        updateAuth(false);
        localStorage.removeItem("token");
        window.location.href = '/';
    }
    return (
        <AppBar className={classes.app}>
            <Toolbar className={classes.nav}>
                <Typography variant="h6" className={classes.icon}>
                    BillTracker
                </Typography>
                <Tabs className={classes.tabs}>
                    <Tab onClick={() => {
                        window.location.href = '/#/app';
                    }} label="Home" icon={<HomeIcon/>}/>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/mybills';
                    }} label="My Bills" icon={<FileCopyIcon/>}/>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/compare';
                    }} label="Compare Bills" icon={<CompareArrowsIcon/>}/>
                </Tabs>
                <div className={classes.login}>
                    <Tab onClick={handleClick} label="Profile" icon={<PersonIcon/>}/>
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    className={classes.menu}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem className={classes.menuItms} onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem className={classes.menuItms} onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}