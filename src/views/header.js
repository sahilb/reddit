import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class Header extends React.Component {
    constructor(props) {
        super(props);
        const { store } = this.props;
        if (store && store.state.isLoggedIn) {

            this.state = {
                isLoggedIn: true,
                isHomeEnabled: store.state.view == 'hot',
                isFavoritesEnabled: store.state.view == 'favorites'
            };
            store.addListener(() => {
                this.setState({
                    'isHomeEnabled': store.state.view == 'hot',
                    'isFavoritesEnabled': store.state.view == 'favorites'
                });
            })
        } else {
            this.state = {
                isLoggedIn: false
            }
        }
    }
    onHomeClicked() {
        this.props.store.actions.clickHome();
    }
    onFavoritesClicked() {
        this.props.store.actions.clickFavorites();
    }
    render() {
        if (!this.state.isLoggedIn) {
            return(
                <Navbar>
                    <Nav pullRight>
                        <NavItem eventKey={1} href={this.props.otherUri} className="signin-register"> {this.props.otherTitle} </NavItem>
                    </Nav>
                </Navbar>
            )
        } else {

            return (
                <Navbar>

                    <Nav>
                        <NavItem
                            eventKey={1}
                            href="#"
                            className={this.state.isHomeEnabled ? 'selected-nav' : ''}
                            onClick={this.onHomeClicked.bind(this)}
                        > Home </NavItem>
                        <NavItem
                            eventKey={2}
                            href="#"
                            className={this.state.isFavoritesEnabled ? 'selected-nav' : ''}
                            onClick={this.onFavoritesClicked.bind(this)}
                        > Favorites </NavItem>
                    </Nav>

                    <Nav pullRight>
                        <NavItem eventKey={1} href="/logout" className='logout-btn'> Logout </NavItem>
                    </Nav>

                </Navbar>
            );
        }
    }
}

export default Header;
