import React from 'react';

import Header from './Header';

import ManageServices from './Pages/ManageServices';
import PreviousReceipts from './Pages/PreviousReceipts';

import ReceiptPreview from './Pages/ReceiptPreview';


class AdminIndex extends React.Component {
    constructor(props) {
        super(props);

        this.changePage = this.changePage.bind(this);
        this.goToReceiptPreview = this.goToReceiptPreview.bind(this);
        
        this.pages = {
            ManageServices: <ManageServices />,
            PreviousReceipts: <PreviousReceipts goToReceiptPreview={this.goToReceiptPreview} />
        };

        this.state = {
            content: this.pages.ManageServices
            
        };

    }

    changePage (page) {
        var content = null;

        if (page === "manageServices") content = this.pages.ManageServices;
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
                changePage={this.changePage}
                confirmed={confirmed}
            />
         });
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

export default AdminIndex;