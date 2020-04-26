import React from 'react'
import Link from 'next/link'
import Layout from '../components/layout'

export default class extends React.Component {

  static async getInitialProps({req, query}) {

    let props = {
      message: ''
    }

    props.message = query.message || 'Ocorreu um erro desconhecido!'
    
    return props
  }

  render() {
    return (
      <Layout {...this.props}>
        <div className="text-center mb-5">
          <p className="lead">{this.props.message}</p>
          <p className="lead"><Link href="/"><a>Vá para a página inicial</a></Link></p>
        </div>
      </Layout>
    )
  }
}