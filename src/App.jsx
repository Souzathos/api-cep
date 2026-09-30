import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [cepDigitado, setCepDigitado] = useState('')
  const [cep, setCep] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!erro) return

    const timer = setTimeout(() => {
      setErro('')
    }, 5000)

    return () => clearTimeout(timer)
  }, [erro])

  async function buscarCep() {
    const cepLimpo = cepDigitado.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      setErro('Digite um CEP válido com 8 números.')
      setCep(null)
      return
    }

    setLoading(true)
    setErro('')
    setCep(null)

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await resposta.json()

      if (dados.erro) {
        setErro('CEP não encontrado.')
      } else {
        setCep(dados)
      }
    } catch (err) {
      console.log('Ocorreu um erro', err)
      setErro('Erro ao buscar o CEP. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Digite um CEP</h1>

      <div className="busca">
        <input
          type="text"
          placeholder="Ex: 01001-000"
          maxLength={9}
          value={cepDigitado}
          onChange={(e) => setCepDigitado(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarCep()}
        />
        <button onClick={buscarCep} disabled={loading}>
          Pesquisar
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {loading && <p className="loading">Carregando...</p>}

      {cep && !loading && (
        <div className="resultado">
          <h2>CEP: {cep.cep}</h2>
          <p><strong>Logradouro:</strong> {cep.logradouro || '-'}</p>
          <p><strong>Bairro:</strong> {cep.bairro || '-'}</p>
          <p><strong>Cidade:</strong> {cep.localidade}</p>
          <p><strong>Estado:</strong> {cep.estado} ({cep.uf})</p>
          <p><strong>Região:</strong> {cep.regiao}</p>
        </div>
      )}
    </div>
  )
}

export default App
