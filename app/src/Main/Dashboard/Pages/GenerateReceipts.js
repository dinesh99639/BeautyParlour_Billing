import React from 'react';

import config from "../../../config.json";
// import $ from 'jquery';
import axios from 'axios';

import { Button, TextField, Grid, Card, List, ListItem, ListItemIcon, Checkbox, ListItemText, Divider, CardHeader } from '@material-ui/core';


class GenerateReceipts extends React.Component {
    constructor(props) {
        super(props);

        this.generateReceipt = this.generateReceipt.bind(this);
        this.handleTextField = this.handleTextField.bind(this);

        this.state = {
            name: "",
            phone: "",


            checked: [],
            left: [],
            right: [],
            
            leftChecked: [],
            rightChecked: []
        }

    }

    async UNSAFE_componentWillMount() {
        // console.log(this.props)
        if (this.props.goBack) {
            this.setState({
                name: this.props.name,
                phone: this.props.phone,
                left: this.props.left,
                right: this.props.right,

                subtotal: this.props.subtotal
            });
        }
        else {
            var res = await axios.post(config.HOST+'/api/Receptionist/getAllServices.php', {});
            var left = [];

            // console.log(res);
    
            if (res) {
                if (!res.data.error) {
                    var services = res.data.services;
    
                    for (var key in services) {
                        left.push([key, services[key]]);
                    }
                    // console.log(left);
    
                    this.setState({ services, left });
                }
            }
        }

    }


    not = (a, b) => a.filter((value) => b.indexOf(value) === -1); 
    intersection = (a, b) => a.filter((value) => b.indexOf(value) !== -1);
    union = (a, b) => [...a, ...this.not(b, a)];

    handleToggle = (value) => () => {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        
        this.setState({ 
            checked: newChecked,
            leftChecked:  this.intersection(newChecked, this.state.left),
            rightChecked: this.intersection(newChecked, this.state.right)
        });
    }
    
    numberOfChecked = (items) => this.intersection(this.state.checked, items).length;
    
    handleToggleAll = (items) => () => {
        if (this.numberOfChecked(items) === items.length) {
            this.setState({ checked: this.not(this.state.checked, items) });
        } else {
            this.setState({ checked: this.union(this.state.checked, items) });
        }
    }
    
    handleCheckedRight = () => {
        var right = this.state.right.concat(this.state.leftChecked);
        var left = this.not(this.state.left, this.state.leftChecked);
        var checked = this.not(this.state.checked, this.state.leftChecked);
        var leftChecked=  this.intersection(checked, left);
        var rightChecked= this.intersection(checked, right);

        this.setState({ 
            right, left, checked, leftChecked, rightChecked
        });
    }

    handleCheckedLeft = () => {
        var left = this.state.left.concat(this.state.rightChecked);
        var right = this.not(this.state.right, this.state.rightChecked);
        var checked = this.not(this.state.checked, this.state.rightChecked);
        var leftChecked=  this.intersection(checked, left);
        var rightChecked= this.intersection(checked, right);

        this.setState({ 
            left, right, checked, leftChecked, rightChecked 
         })
    };

    handleTextField(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    generateReceipt() {
        // console.log(this.state.name, this.state.phone, this.state.right);
        var left = this.state.left;
        var right = this.state.right;
        var subtotal = 0;

        for (var i in right) {
            subtotal += parseInt(right[i][1]);
        }
        this.props.goToReceiptPreview(this.state.name, this.state.phone, left, right, subtotal, false);
    }


    render() {
        const customList = (title, items) => (

            <Card>
                <CardHeader
                style={{ padding: "1px 2px"}}
                avatar={
                    <Checkbox
                    onClick={this.handleToggleAll(items)}
                    checked={this.numberOfChecked(items) === items.length && items.length !== 0}
                    indeterminate={this.numberOfChecked(items) !== items.length && this.numberOfChecked(items) !== 0}
                    disabled={items.length === 0}
                    inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${this.numberOfChecked(items)}/${items.length} selected`}
                />
                <Divider />
                <List style={{width: 400, height: 230, overflow: 'auto'}} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;
        
                    return (
                    <ListItem key={value} role="listitem" button onClick={this.handleToggle(value)}>
                        <ListItemIcon>
                        <Checkbox
                            checked={this.state.checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={value[0]+" (₹"+value[1]+")"} />
                    </ListItem>
                    );
                })}
                <ListItem />
                </List>
            </Card>
        );

        return (
            <div style={{padding: "20px 0", paddingTop: "80px"}}>
                <center>
                    <div style={{textAlign: "center", fontSize: "25px"}}>Generate Receipts</div>

                    <div style={{textAlign: "center", margin: "50px 0", width: "500px"}} >
                        <Grid container>
                            <Grid item xs={6}>Name</Grid>
                            <Grid item xs={6}><TextField name="name" value={this.state.name} onChange={this.handleTextField} /></Grid>
                        </Grid>
                        <Grid container style={{marginTop: "20px"}}>
                            <Grid item xs={6}>Phone no</Grid>
                            <Grid item xs={6}><TextField name="phone" value={this.state.phone} onChange={this.handleTextField} /></Grid>
                        </Grid>
                    </div>
                    
                    <Grid container spacing={2} justify="center" alignItems="center" style={{margin: "0", width: "100%"}}>
                        
                        {
                            (this.state.leftChecked && this.state.leftChecked)
                            ?(
                                <>
                                    <Grid item>{customList('Services', this.state.left)}</Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            styles={{margin: "0.5px 0"}}
                                            onClick={this.handleCheckedRight}
                                            disabled={this.state.leftChecked.length === 0}
                                            aria-label="move selected right"
                                        >
                                            &gt;
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            styles={{margin: "0.5px 0"}}
                                            onClick={this.handleCheckedLeft}
                                            disabled={this.state.rightChecked.length === 0}
                                            aria-label="move selected left"
                                        >
                                            &lt;
                                        </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid item>{customList('Choosen', this.state.right)}</Grid>
                                </>
                            )
                            :(null)
                        }
                    </Grid>

                    <div className="update" style={{textAlign: "center", marginTop: "40px"}}>
                        <Button
                            onClick={()=>this.generateReceipt()} 
                            style={{margin: "10px", outline: "none", backgroundColor: "#e56219"}} color="primary" variant="contained"
                        >
                            Generate Receipt
                        </Button>
                        
                    </div>
                </center>
            </div>
        );
    }
}

export default GenerateReceipts;