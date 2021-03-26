import React from 'react';

// import $ from 'jquery';

import {  } from '@material-ui/core';

import Header from './Header';

import GenerateReceipts from './Pages/GenerateReceipts';
import PreviousReceipts from './Pages/PreviousReceipts';

import ReceiptPreview from './Pages/ReceiptPreview';


class DashboardIndex extends React.Component {
    constructor(props) {
        super(props);

        this.changePage = this.changePage.bind(this);
        this.goToReceiptPreview = this.goToReceiptPreview.bind(this);
        this.goToGenerateReceiptsFromPreview = this.goToGenerateReceiptsFromPreview.bind(this);
        this.generateAnotherReceipt = this.generateAnotherReceipt.bind(this);
        
        this.pages = {
            GenerateReceipts: <GenerateReceipts goToReceiptPreview={this.goToReceiptPreview} goToGenerateReceiptsFromPreview={this.goToGenerateReceiptsFromPreview} />,
            PreviousReceipts: <PreviousReceipts goToReceiptPreview={this.goToReceiptPreview} />
        };

        this.state = {
            content: this.pages.GenerateReceipts
            
        };

    }

    changePage (page) {
        var content = null;

        if (page === "generateReceipts") content = this.pages.GenerateReceipts;
        else if (page === "previousReceipts") content = this.pages.PreviousReceipts;

        this.setState({ content });
    }

    goToReceiptPreview(name, phone, left, services, subtotal, confirmed) {
        this.setState({ 
            content: <ReceiptPreview 
                name={name} 
                phone={phone} 
                left={left} 
                services={services} 
                subtotal={subtotal} 
                goToGenerateReceiptsFromPreview={this.goToGenerateReceiptsFromPreview} 
                generateAnotherReceipt={this.generateAnotherReceipt} 
                confirmed={confirmed}
            />
         });
    }

    goToGenerateReceiptsFromPreview(name, phone, left, right, subtotal) {
        var content = <GenerateReceipts 
            goToReceiptPreview={this.goToReceiptPreview}
            goBack={true}
            name={name}
            phone={phone}
            left={left}
            right={right}
            subtotal={subtotal}
        />;

        this.setState({ content });
    }

    generateAnotherReceipt() {
        this.setState({ content: this.pages.GenerateReceipts });
    }
    

    render() {
        return (
            <>
                <Header
                    changePage={this.changePage}
                    logout={this.props.logout} 
                />
                {this.state.content}
            </>
        );
    }
}

export default DashboardIndex;