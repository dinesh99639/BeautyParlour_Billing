import React from 'react';

import axios from 'axios';

import config from "../../../config.json";

import { Snackbar, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, TextField } from '@material-ui/core';

class ManageServices extends React.Component {
    constructor(props) {
        super(props);

        this.openConfirmDialog = this.openConfirmDialog.bind(this);
        this.closeConfirmDialog = this.closeConfirmDialog.bind(this);
        this.onConfirmDeleteButtonClick = this.onConfirmDeleteButtonClick.bind(this);

        this.openEditServiceDialog = this.openEditServiceDialog.bind(this);
        this.closeEditServiceDialog = this.closeEditServiceDialog.bind(this);
        this.onConfirmEditButtonClick = this.onConfirmEditButtonClick.bind(this);

        this.onServiceDetailsUpdate = this.onServiceDetailsUpdate.bind(this);

        this.showMessage = this.showMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);

        this.state = {
            sid: 0,

            viewConfirmDialog: false,
            viewEditDialog: false,

            editServiceName: "", 
            editServicePrice: ""

        }
    }

    async UNSAFE_componentWillMount() {
        var services = null;
        var servicesJSON = {};
        var res = await axios.post(config.HOST+'/api/Admin/getAllServices.php', {});
        if (res) {
            if (!res.data.error) {
                services = res.data.services;
                for (var i in services) {
                    servicesJSON[services[i].sid] = [services[i].serviceName, services[i].price];
                }
                // console.log(servicesJSON);
                this.setState({ services: res.data.services, servicesJSON });
            }
        }
    }

    openConfirmDialog = (e) => {
        var node = e.target;
        if (node.nodeName === "SPAN") node = node.parentNode;
        var sid = node.attributes.sid.value;

        // console.log(sid);
        this.setState({ viewConfirmDialog: true, sid });
    }
    closeConfirmDialog = () => this.setState({ viewConfirmDialog: false });

    async onConfirmDeleteButtonClick() {
        var services = null;
        var servicesJSON = {};

        var res = await axios.post(config.HOST+'/api/Admin/editService.php', {
            delete: true,
            sid: this.state.sid
        });
        
        if (res) {
            if (!res.data.error) {
                // console.log(res.data.services);

                services = res.data.services;
                for (var i in services) {
                    servicesJSON[services[i].sid] = [services[i].serviceName, services[i].price];
                }

                this.setState({ services, servicesJSON, sid: 0 });
                this.showMessage("Update Success");
            }
            else this.showMessage("Update Failed");
        }
        else this.showMessage("Update Failed");

        this.closeConfirmDialog();
    }

    openEditServiceDialog(e, edit) {
        var node, sid, service, editServiceName, editServicePrice;
        if (edit === true) {
            node = e.target;
            if (node.nodeName === "SPAN") node = node.parentNode;
            sid = node.attributes.sid.value;

            service = this.state.servicesJSON[sid];
            editServiceName = service[0];
            editServicePrice = service[1];
        }
        else {
            sid = 0;
            editServiceName = "";
            editServicePrice = "";
        }
        
        this.setState({ viewEditDialog: true, sid, editServiceName, editServicePrice });
    }
    closeEditServiceDialog = () => this.setState({ viewEditDialog: false });

    async onConfirmEditButtonClick() {
        var services = null;
        var servicesJSON = {};

        var res = await axios.post(config.HOST+'/api/Admin/editService.php', {
            edit: true,
            sid: this.state.sid, 
            serviceName: this.state.editServiceName,
            price: this.state.editServicePrice
        });
        
        if (res) {
            if (!res.data.error) {

                services = res.data.services;
                for (var i in services) {
                    servicesJSON[services[i].sid] = [services[i].serviceName, services[i].price];
                }

                await this.setState({ services, servicesJSON, sid: 0 });
                this.showMessage("Update Success");
            }
            else this.showMessage("Update Failed");
        }
        else this.showMessage("Update Failed");

        this.closeEditServiceDialog();
    }

    onServiceDetailsUpdate(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    showMessage(message) {
        this.setState({ showSuccessMessage: true, snackMessage: message, showPrintPreview: true });
    }

    hideMessage() {
        this.setState({ showSuccessMessage: false });
    }

    render() {

        var rows = this.state.services;
        // console.log(rows);
        // console.log(this.state.receipts);
        // console.log(rows);

        return (
            <>

                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={this.state.showSuccessMessage}
                    onClose={this.hideMessage}
                    message={this.state.snackMessage}
                    autoHideDuration={2000}
                />

                <Dialog
                    open={this.state.viewConfirmDialog}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title"><center>{"Confirmation"}</center></DialogTitle>
                    <DialogContent>
                        <DialogContentText component={'div'} id="alert-dialog-description">
                            Are you sure you want to delete <b style={{color: "blue"}}>{((this.state.sid) && this.state.servicesJSON[this.state.sid][0])}</b> service?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} style={{outline: "none"}} color="primary">No</Button>
                        <Button onClick={this.onConfirmDeleteButtonClick} style={{outline: "none"}} color="primary" autoFocus>Yes</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.viewEditDialog}
                    onClose={this.closeEditServiceDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title"><center>{"Service"}</center></DialogTitle>
                    <DialogContent>
                        <DialogContentText component={'div'} style={{margin: "20px 10px 30px 10px"}} id="alert-dialog-description">
                            <Grid container>
                                <Grid item xs={6}>Service Name</Grid>
                                <Grid item xs={6}><TextField name="editServiceName" value={this.state.editServiceName} onChange={this.onServiceDetailsUpdate} /></Grid>
                            </Grid>
                            <Grid container style={{marginTop: "20px"}}>
                                <Grid item xs={6}>Price</Grid>
                                <Grid item xs={6}><TextField name="editServicePrice" value={this.state.editServicePrice} onChange={this.onServiceDetailsUpdate} /></Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeEditServiceDialog} style={{outline: "none"}} color="primary">Cancel</Button>
                        <Button onClick={this.onConfirmEditButtonClick} style={{outline: "none"}} color="primary" autoFocus>Confirm</Button>
                    </DialogActions>
                </Dialog>

                <div style={{padding: "20px 0", paddingTop: "80px"}}>
                    <center>
                        <div style={{textAlign: "center", fontSize: "25px"}}>Manage Service</div>
                        <Button sid={0} onClick={(e)=>this.openEditServiceDialog(e, false)} style={{outline: "none", marginTop: "20px"}} color="primary" variant="contained">Add</Button>
                    </center>

                    <center>
                        {
                            (this.state.services)?(
                                <TableContainer style={{width: "750px", marginTop: "30px"}} component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{backgroundColor: "lightgray"}}>
                                                <TableCell align="center">Name</TableCell>
                                                <TableCell align="center">Service Price</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                                {/* <TableCell align="center">Delete</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.name}>
                                                    <TableCell align="center">{row.serviceName}</TableCell>
                                                    <TableCell align="center">₹ {row.price}</TableCell>
                                                    <TableCell align="center">
                                                        <Button sid={row.sid} onClick={(e)=>this.openEditServiceDialog(e, true)} style={{outline: "none", marginRight: "10px"}} color="primary" variant="contained">Edit</Button>
                                                        <Button sid={row.sid} onClick={this.openConfirmDialog} style={{outline: "none", marginLeft: "10px", backgroundColor: "#ff241d", color: "white"}} color="primary" variant="contained">Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ):(null)
                        }
                    </center>
                </div>
            </>
        );
    }
}

export default ManageServices;