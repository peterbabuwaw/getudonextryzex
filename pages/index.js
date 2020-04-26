import React from 'react'
import Router from 'next/router'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Layout from '../components/layout'
import Session from '../utils/session'

export default class extends React.Component {
  
  static async getInitialProps({req, res}) {

    let props = {
      session: ''
    }
    
    if (req && req.session) {
      props.session = req.session
    } else {
      props.session = await Session.getSession()
    }

    if (!props.session || !props.session.loggedin) {
      if (req) {
        res.redirect('/login')
      } else {
        Router.push('/login')
      }
    }
    
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      surname: '',
      address: '',
      creditCardNumber: '',
      mobileNumber: '',
      accountNumber: '',
      message: null,
      messageStyle: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.setProfile = this.setProfile.bind(this)
  }

  async componentDidMount() {
    this.getProfile()
  }

  getProfile() {
    fetch('/auth/profile', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      if (!response.firstName || !response.surname || !response.address || !response.creditCardNumber || !response.mobileNumber || !response.accountNumber) return
      this.setState({
        firstName: response.firstName,
        surname: response.surname,
        address: response.address,
        creditCardNumber: response.creditCardNumber,
        mobileNumber: response.mobileNumber,
        accountNumber: response.accountNumber
      })
      
    })
    
  }
  
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  async setProfile(e) {
    e.preventDefault()
    
    this.setState({
      message: null,
      messageStyle: null
    })
    
    const data = {
      firstName: this.state.firstName,
      surname: this.state.surname,
      address: this.state.address,
      creditCardNumber: this.state.creditCardNumber,
      mobileNumber: this.state.mobileNumber,
      accountNumber: this.state.accountNumber
    }
    
    fetch('/auth/update', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(async res => {
      if (res.status === 200) {
        this.getProfile()
        this.setState({
          message: 'O perfil foi salvo!',
          messageStyle: 'alert-success'
        })
      } else {
        this.setState({
          message: 'Falha ao salvar o perfil',
          messageStyle: 'alert-danger'
        })
      }
    })
  }
  
  render() {
    
    const alert = (this.state.message === null) ? <div/> : <div className={`alert ${this.state.messageStyle}`} role="alert">{this.state.message}</div>

    if (this.props.session.loggedin) {
      return (
        <Layout {...this.props}>
          <Row className="mt-4 text-center">
            <Col xs="12" sm=''>
              <h2>Complete seu perfil</h2>
              <p className="lead text-muted">
              Você pode atualizar as informações básicas do seu perfil.
              </p>
              <Form onSubmit={this.setProfile}>

                <FormGroup row>
                  <Label xs={2} for="firstName">Primeiro Nome:</Label>
                  <Col xs={10}>
                    <Input name="firstName" id="userFirstname" value={this.state.firstName} onChange={this.handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label xs={2} for="userSurname">Sobrenome:</Label>
                  <Col xs={10}>
                    <Input name="surname" id="userSurname" value={this.state.surname} onChange={this.handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                     <Label xs={2} for="userAddress">Endereço:</Label>
                  <Col xs={10}>
                    <Input name="address" id="userAddress" value={this.state.address} onChange={this.handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label xs={2} for="mobileNumber">Cellular:</Label>
                  <Col xs={10}>
                    <Input name="mobileNumber" id="userMobileNumber" value={this.state.mobileNumber} onChange={this.handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label xs={2} for="creditCardNumber">Cartão de crédito:</Label>
                  <Col xs={10}>
                    <Input name="creditCardNumber" id="creditCardNumber" value={this.state.creditCardNumber} onChange={this.handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label xs={2} for="accountNumber">Conta para depósito:</Label>
                  <Col xs={10}>
                    <Input name="accountNumber" id="accountNumber" value={this.state.accountNumber} onChange={this.handleChange} />
                  </Col>
                </FormGroup>
                <Button className="mb-3" type="submit">Atualizar</Button>
              </Form>
              {alert}
            </Col>
          </Row>
          
        </Layout>
      )
    } else {
      return (
        <Layout {...this.props}>
          <div />
        </Layout>
      )
    }
  }
}