import React from 'react';

// import $ from 'jquery';

import { Grid, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Typography, List, ListItem, ListItemText, Drawer, ListItemIcon, Fade, Menu, MenuItem } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';

// import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggleDrawer: false
        }

        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    toggleDrawer = (toggleDrawer) => {
        // if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        //   return;
        // }
    
        this.setState({ toggleDrawer });
    };

    toggleMenu = (event) => {
        this.setState({ menuComponent: event.currentTarget });
    };

    closeMenu = () => {
        // setTimeout(()=>{this.setState({ menuComponent: null })}, 0)
        this.setState({ menuComponent: null });
    };

    render() {
        return (
            <div className="header" style={{zIndex:1000, position: "fixed", width: "100%"}}>
                <Drawer open={this.state.toggleDrawer} onClose={()=>this.toggleDrawer(false)}>    
                    <div
                        style={{width: "250px"}}
                        role="presentation"
                        onClick={()=>this.toggleDrawer(false)}
                        onKeyDown={()=>this.toggleDrawer(false)}
                    >
                        <div style={{backgroundColor: "rgb(109, 19, 226)", color: "white"}}>
                            <List>
                                {/* <h5>Profile</h5> */}
                                <ListItem style={{paddingTop: "20px"}}>
                                    <ListItemText>
                                        <Typography style={{fontWeight: "50px"}} variant="h6">Admin</Typography>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </div>
                        {/* <Divider /> */}
                        <List>
                            <ListItem button onClick={()=>{this.props.changePage("manageServices")}}>
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText style={{marginLeft: "-20px"}} primary={"Manage Services"} />
                            </ListItem>
                            <ListItem button onClick={()=>{this.props.changePage("previousReceipts")}}>
                                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                                <ListItemText style={{marginLeft: "-20px"}} primary={"Reciepts"} />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>

                <Menu
                    id="fade-menu"
                    anchorEl={this.state.menuComponent}
                    keepMounted
                    open={Boolean(this.state.menuComponent)}
                    onClose={this.closeMenu}
                    TransitionComponent={Fade}
                    transitionDuration={300}
                >
                    <MenuItem onClick={()=>{this.closeMenu(); this.props.logout();}}>Logout</MenuItem>
                </Menu>




                <AppBar style={{backgroundColor: "rgb(109, 19, 226)"}} position="static">
                    <Toolbar>
                        <Grid item xs={3}>
                            <IconButton
                                onClick={()=>this.toggleDrawer(true)} 
                                style={{outline: "none"}} edge="start" color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={6}>
                            <center style={{marginTop: "3px"}}>BeautyParlour</center>
                        </Grid>
                        <Grid item xs={3}>
                            <IconButton
                                onClick={this.toggleMenu} 
                                style={{outline: "none" ,float: "right"}} edge="start" color="inherit" aria-label="menu"
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;