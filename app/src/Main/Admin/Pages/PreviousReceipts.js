import React from 'react';

import axios from 'axios';

import config from "../../../config.json";

import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@material-ui/core';

class PreviousReceipts extends React.Component {
    constructor(props) {
        super(props);

        this.viewReceipt = this.viewReceipt.bind(this);

        this.state = {

        }
    }

    async UNSAFE_componentWillMount() {
        var res = await axios.post(config.HOST+'/api/Receptionist/getAllReceipts.php', {});

        if (res) {
            if (!res.data.error) {
                this.setState({ receipts: res.data.receipts });
            }
        }
    }

    viewReceipt(e) {
        var receipts = this.state.receipts;
        var node = e.target;
        if (node.nodeName === "SPAN") node = node.parentNode;
        
        var rid = node.attributes.rid.value;

        for(var i in receipts) {
            if (receipts[i].rid === rid) {
                var r = receipts[i];
                this.props.goToReceiptPreview(r.name, r.phone, [], JSON.parse(r.servicesObtained), r.total, true);
                break;
            }
        }

    }


    render() {

        var rows = this.state.receipts;
        // console.log(rows);
        // console.log(this.state.receipts);

        return (
            <div style={{padding: "20px 0", paddingTop: "80px"}}>
                <center>
                    <div style={{textAlign: "center", fontSize: "25px"}}>Receipts</div>
                </center>

                <center>
                    {
                        (this.state.receipts)?(
                            <TableContainer style={{width: "1000px", marginTop: "30px"}} component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow style={{backgroundColor: "lightgray"}}>
                                            <TableCell align="center">Time</TableCell>
                                            <TableCell align="center">Name</TableCell>
                                            <TableCell align="center">Phone</TableCell>
                                            <TableCell align="center">Services Used</TableCell>
                                            <TableCell align="center">Bill</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell align="center">{row.timestamp}</TableCell>
                                                <TableCell align="center">{row.name}</TableCell>
                                                <TableCell align="center">{row.phone}</TableCell>
                                                <TableCell align="center">{JSON.parse(row.servicesObtained).length}</TableCell>
                                                <TableCell align="center">₹ {row.total}</TableCell>
                                                <TableCell align="center"><Button rid={row.rid} onClick={this.viewReceipt} style={{outline: "none"}} color="primary" variant="contained">View</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ):(null)
                    }
                </center>
            </div>
        );
    }
}

export default PreviousReceipts;