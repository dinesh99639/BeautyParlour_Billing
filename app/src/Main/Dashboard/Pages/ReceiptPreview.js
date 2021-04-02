import React from 'react';

import axios from 'axios';

import config from "../../../config.json";

import { Button, Grid, Snackbar } from '@material-ui/core';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import './ReceiptPreview.css';

class ReceiptPreview extends React.Component {
    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.confirmReceipt = this.confirmReceipt.bind(this);

        this.showMessage = this.showMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);

        this.state = {
            showSuccessMessage: false,
            showPrintPreview: false
        }
    }

    UNSAFE_componentWillMount() {
        // console.log(this.props.name, this.props.phone, this.props.services);
        var showPrintPreview = this.props.confirmed;
        var tax, subtotal, total;

        if (showPrintPreview) {
            tax = 2;
            subtotal = this.props.subtotal - tax;
            total = this.props.subtotal;
        }
        else {
            subtotal = this.props.subtotal;
            tax = 2;
            total = subtotal + tax;
        }
        this.setState({ subtotal, tax, total, showPrintPreview });
    }

    getCurentDate() {
        var today = new Date();

        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();

        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        
        return dd + '-' + mm + '-' + yyyy;
    }

    goBack() {
        this.props.goToGenerateReceiptsFromPreview(this.props.name, this.props.phone, this.props.left, this.props.services, this.props.subtotal);
    }

    async confirmReceipt() {
        // console.log(this.props.name, this.props.phone, this.props.services, this.state.total);
        var res = await axios.post(config.HOST+'/api/Receptionist/insertReceipt.php', { 
            name: this.props.name, 
            phone: this.props.phone, 
            services: JSON.stringify(this.props.services),
            total: this.state.total
        });

        if (res) {
            if (!res.data.error) this.showMessage("Receipt Generated Successfully");
            else this.showMessage("Receipt Generation Failed");
        }
        else this.showMessage("Receipt Generation Failed");
    }

    showMessage(message) {
        this.setState({ showSuccessMessage: true, snackMessage: message, showPrintPreview: true });
    }

    hideMessage() {
        this.setState({ showSuccessMessage: false });
    }


    render() {

        const rows = this.props.services;
        var subtotal = this.state.subtotal;
        var tax = this.state.tax;
        var total = this.state.total;
        // console.log(rows);

        // var generate

        return (
            <>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={this.state.showSuccessMessage}
                    onClose={this.hideMessage}
                    message={this.state.snackMessage}
                    // key={vertical + horizontal}
                />

                <div style={{padding: "20px 0", paddingTop: "80px"}}>
                    <center id="section-to-print" className="receipt">
                        <div style={{height: "650px", width: "700px", border: "1px solid", padding: "20px"}}>
                            <Grid container>
                                <Grid item xs={8} style={{textAlign: "left"}}>
                                    <h2 style={{color: "#7562e3"}}>BeautyParlour</h2>
                                    <p style={{margin: 0}}>123 Street Address, City, State, Zip/Post</p>
                                    <p style={{margin: 0}}>Website, Email Address</p>
                                    <p style={{margin: 0}}>Phone Number</p>
                                </Grid>
                                <Grid item xs={4} style={{textAlign: "right"}}>
                                    <img alt="Company logo" src="./beautyParlour.png" style={{height: "100px", width: "100px"}}></img>
                                </Grid>
                            </Grid>

                            <Grid container style= {{marginTop: "30px"}}>
                                <Grid item xs={8} style={{textAlign: "left"}}>
                                    <h5 style={{color: "#7562e3"}}>BILL TO</h5>
                                    <hr style={{width: "300px", margin: "0"}} />
                                    <p style={{margin: 0}}>Name: &nbsp;{this.props.name}</p>
                                    <p style={{margin: 0}}>Phone: {this.props.phone}</p>
                                </Grid>
                                <Grid item xs={4} style={{textAlign: "right"}}>
                                    <p style={{margin: 0}}><b>Invoice Date: </b>{this.getCurentDate()}</p>
                                </Grid>
                            </Grid>

                            <TableContainer style={{margin: "25px 0"}}>
                                <Table style={{border: "1px solid rgba(224, 224, 224, 1)"}} aria-label="simple table">
                                    <TableHead style={{backgroundColor: "white"}}>
                                        <TableRow>
                                            <TableCell style={{padding: "5px", fontWeight: "bold", width: "70px", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)"}}>S.no</TableCell>
                                            <TableCell style={{padding: "5px", fontWeight: "bold", border: "1px solid rgba(224, 224, 224, 1)", textAlign: "center"}}>Services</TableCell>
                                            <TableCell style={{padding: "5px", fontWeight: "bold", textAlign: "center"}} align="right">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={row.name}>
                                                <TableCell style={{padding: "5px", textAlign: "center", border: "1px solid rgba(224, 224, 224, 1)"}}>{index+1}</TableCell>
                                                <TableCell style={{padding: "5px", border: "1px solid rgba(224, 224, 224, 1)", textAlign: "center"}} component="th" scope="row">{row[0]}</TableCell>
                                                <TableCell style={{padding: "5px", paddingRight: "20px"}} align="right">₹ {row[1]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Grid container>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={4}>
                                    <TableContainer style={{margin: "0"}}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{padding: "5px", border: "none"}} colSpan={1}>Subtotal</TableCell>
                                                    <TableCell style={{padding: "5px", border: "none", paddingRight: "20px"}} align="right">₹ {subtotal}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{padding: "5px", border: "none"}}>Tax</TableCell>
                                                    <TableCell style={{padding: "5px", border: "none", paddingRight: "20px"}} align="right">₹ {tax}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{padding: "5px", border: "none"}} colSpan={1}>Total</TableCell>
                                                    <TableCell style={{padding: "5px", border: "none", paddingRight: "20px"}} align="right">₹ {total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>

                        </div>
                    </center>

                    <div className="update noprint" style={{textAlign: "center", marginTop: "40px"}}>
                        {
                            (this.state.showPrintPreview)
                            ?(
                                <>
                                    <Button onClick={this.props.generateAnotherReceipt} style={{margin: "10px", outline: "none", backgroundColor: "#e56219"}} color="primary" variant="contained">Generate Another Receipt</Button>
                                    <Button onClick={()=>{window.print()}} style={{margin: "10px", outline: "none", backgroundColor: "#349500"}} color="primary" variant="contained">Print</Button>
                                </>
                            )
                            :(
                                <>
                                    <Button onClick={this.goBack} style={{margin: "10px", outline: "none", backgroundColor: "#e56219"}} color="primary" variant="contained">Go Back</Button>
                                    <Button onClick={this.confirmReceipt} style={{margin: "10px", outline: "none", backgroundColor: "#349500"}} color="primary" variant="contained">Confirm</Button>
                                </>
                            )
                        }
                    </div>
                </div>
            </>
        );
    }
}

export default ReceiptPreview;