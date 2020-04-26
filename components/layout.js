import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap'
import Package from '../package'
import Styles from '../css/index.scss'

export default class extends React.Component {

  static propTypes() {
    return {
      // session: React.PropTypes.object.isRequired,
      children: React.PropTypes.object.isRequired,
      fluid: React.PropTypes.boolean
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  render() {
    return (
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>{this.props.title || 'Getudo'}</title>
         </Head>
        <Navbar light className="navbar navbar-expand-md pt-3 pb-3">
          <Link prefetch href="/">
            <NavbarBrand href="/">
              <span className=""></span> 
            </NavbarBrand>
          </Link>
          <SignOutButton {...this.props} />
        </Navbar>
        <MainBody fluid={this.props.fluid}>
          {this.props.children}
        </MainBody>
        
      </React.Fragment>
    )
  }
}

export class MainBody extends React.Component {
  render() {
    return (
        <Container fluid={this.props.fluid}> 
           {this.props.children}
      </Container>
    )
  }
}

export class SignOutButton extends React.Component {

  render() {
    if (this.props.session && this.props.session.loggedin) {
      return (
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link href="/auth/signout">
              <Button outline color="primary"><span className="icon ion-md-log-out mr-1"></span> Sair</Button>
            </Link>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <span />
      )
    }
  }
}