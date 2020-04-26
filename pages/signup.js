import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
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

    if (props.session && props.session.loggedin) {
      if (req) {
        res.redirect('/')
      } else {
        Router.push('/')
      }
    }
    
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      message: null
    }
  
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
   }



  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim()
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value.trim()
    })
  }

  handleConfirmPasswordChange(event) {
    this.setState({
      confirmPassword: event.target.value.trim()
    })
  }
  
  handleSignUp(event) {
    event.preventDefault()

    this.setState({
      message: null
    })

    


    if (!this.state.email || !this.state.password || !this.state.confirmPassword ) {
      this.setState({
        message: 'Todos os campos são obrigatórios!'
      })

      return
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        message: 'Senha incorreta!'
      })

      return
    }

    let data = {
      email: this.state.email,
      password: this.state.password,
     }

    fetch('auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      if (response.message) {
        this.setState({
          message: response.message
        })
      } else if (response.email) {
        Router.push('/check-email?email=' + response.email)
      } else {
        this.setState({
          message: 'Erro desconhecido!'
        })
      }
    })
    .catch(error => {
      console.error('Error:', error)
      this.setState({
        message: 'Falha na solicitação!'
      })
    })
  }
  
  render() {
    
    const alert = (this.state.message === null) ? <div/> : <div className={`alert alert-danger`} role="alert">{this.state.message}</div>

    if (this.props.session.loggedin) {
      return (
        <Layout {...this.props}>
          <p className="lead text-center mt-5 mb-5">
            <Link href="/"><a>Gerenciar seu perfil</a></Link>
          </p>
        </Layout>
      )
    } else {
      return (
        <Layout {...this.props}>
          <Row className="mt-5">
            <Col xs="12" >
              <Card>
                <CardHeader>Inscrever-se</CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSignUp}>
                  
                    <FormGroup>
                      <Label for="userEmail">Email</Label>
                      <Input type="email" name="email" id="userEmail" placeholder="" value={this.state.email} onChange={this.handleEmailChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="userPassword">Senha</Label>
                      <Input type="password" name="password" id="userPassword" placeholder="" value={this.state.password} onChange={this.handlePasswordChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="userConfirmPassword">Confirme a Senha</Label>
                      <Input type="password" name="confirmPassword" id="userConfirmPassword" placeholder="" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} />
                    </FormGroup>
                    <Button type="submit">Inscrever-se</Button>
                  </Form>
                </CardBody>
              </Card>
              <br />
              {alert}
            </Col>
          </Row>
          <p className="text-center lead">
            <Link href="/login"><a>Volte</a></Link>
          </p>
        </Layout>
      )
    }
  }
}