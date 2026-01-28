import React, { useState, useEffect } from 'react';
import { User, Car, Box, ClipboardList, UserPlus, Trash2, Printer, Package, UserCheck, UserPlus as UserPlusIcon } from 'lucide-react';
import './App.css';

const SERVER_URL = 'http://10.10.64.101:3001/api';
const CREDENTIALS = btoa('t.i:123456*p');
const AUTH_HEADER = { 'Authorization': `Basic ${CREDENTIALS}` };

function App() {
    // Estados principais
    const [modoEnc, setModoEnc] = useState('LISTA');
    const [aba, setAba] = useState('portaria');
    const [funcionarios, setFuncionarios] = useState([]);
    const [veiculosCadastrados, setVeiculosCadastrados] = useState([]);
    const [historico, setHistorico] = useState([]);

    // Estados de interface
    const [modoPedestre, setModoPedestre] = useState('interno');
    const [modoVeiculo, setModoVeiculo] = useState('visitante');
    const [sentidoPedestre, setSentidoPedestre] = useState('ENTRADA');
    const [sentidoVeiculo, setSentidoVeiculo] = useState('ENTRADA');
    const [mostrarEncomenda, setMostrarEncomenda] = useState(false);

    // Estados de formulário
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
    const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
    const [condutorVeiculo, setCondutorVeiculo] = useState('');
    const [visNome, setVisNome] = useState('');
    const [visRegistro, setVisRegistro] = useState('');
    const [visEmpresa, setVisEmpresa] = useState('');
    const [veicModeloVis, setVeicModeloVis] = useState('');
    const [veicPlacaVis, setVeicPlacaVis] = useState('');
    const [remetente, setRemetente] = useState('');
    const [destinatarioEnc, setDestinatarioEnc] = useState('');

    useEffect(() => {
        fetch(`${SERVER_URL}/dados`, { headers: AUTH_HEADER })
            .then(res => res.json())
            .then(data => {
                setFuncionarios(data.funcionarios || []);
                setVeiculosCadastrados(data.veiculos || []);
                setHistorico(data.historico || []);
            })
            .catch(err => console.error("Erro ao carregar:", err));
    }, []);

    const sincronizar = (f, v, h) => {
        fetch(`${SERVER_URL}/salvar`, {
            method: 'POST',
            headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcionarios: f, veiculos: v, historico: h })
        });
    };

    const excluirItem = (id, tipo) => {
        if (!window.confirm("Deseja realmente excluir este cadastro?")) return;
        let novaListaF = funcionarios;
        let novaListaV = veiculosCadastrados;
        if (tipo === 'F') novaListaF = funcionarios.filter(f => f.id !== id);
        if (tipo === 'V') novaListaV = veiculosCadastrados.filter(v => v.id !== id);
        setFuncionarios(novaListaF);
        setVeiculosCadastrados(novaListaV);
        sincronizar(novaListaF, novaListaV, historico);
    };

    const registrarAcesso = (tipo, detalhe) => {
        const registro = { id: Date.now(), tipo, detalhe, data: new Date().toLocaleString() };
        const novoHist = [registro, ...historico];
        setHistorico(novoHist);
        sincronizar(funcionarios, veiculosCadastrados, novoHist);
        
        // Limpar campos
        setFuncionarioSelecionado(''); setVeiculoSelecionado(''); setCondutorVeiculo('');
        setVisNome(''); setVisRegistro(''); setVisEmpresa('');
        setVeicModeloVis(''); setVeicPlacaVis(''); setRemetente(''); setDestinatarioEnc('');
    };

    const imprimirRelatorio = () => {
        const janelaImpressao = window.open('', '', 'width=900,height=700');
        const conteudo = `
            <html>
                <head>
                    <title>Relatório de Portaria - UNIT</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #1e3a8a; margin-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 12px; }
                        th { background-color: #f0f4f8; }
                        .header-info { text-align: center; margin-bottom: 20px; font-size: 14px; color: #666; }
                    </style>
                </head>
                <body>
                    <h1>SISTEMA UNIT - RELATÓRIO DE PORTARIA</h1>
                    <div class="header-info">Gerado em: ${new Date().toLocaleString()}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Tipo</th>
                                <th>Descrição Detalhada</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historico.map(h => `
                                <tr>
                                    <td>${h.data}</td>
                                    <td>${h.tipo}</td>
                                    <td>${h.detalhe}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        janelaImpressao.document.write(conteudo);
        janelaImpressao.document.close();
        janelaImpressao.print();
    };

    return (
        <div className="container">
            <div className="header">
                <h1>CONTROLE DE ACESSO - PORTARIA MATRIZ</h1>
                <p>Polo Segurança Especializada</p>
            </div>

            <div className="nav-buttons">
                <button className="btn btn-primary" onClick={() => setAba('portaria')}><ClipboardList size={18} /> Portaria</button>
                <button className="btn btn-primary" onClick={() => setAba('cadastro')}><UserPlus size={18} /> Cadastros</button>
            </div>

            {aba === 'cadastro' ? (
                <div className="grid-cards">
                    <div className="card">
                        <h2>Cadastrar Pedestre</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const nova = { id: Date.now(), nome: e.target.nome.value, departamento: e.target.departamento.value };
                            const lista = [...funcionarios, nova];
                            setFuncionarios(lista);
                            sincronizar(lista, veiculosCadastrados, historico);
                            e.target.reset();
                        }}>
                            <input name="nome" placeholder="Nome Completo" required className="input" style={{ marginBottom: '10px' }} />
                            <input name="departamento" placeholder="Departamento/Setor" required className="input" style={{ marginBottom: '10px' }} />
                            <button type="submit" className="btn-success">Adicionar Pedestre</button>
                        </form>
                        <div className="lista-scroll" style={{ marginTop: '20px' }}>
                            {funcionarios.map(f => (
                                <div key={f.id} className="item-lista">
                                    <span>{f.nome} <small>({f.departamento})</small></span>
                                    <Trash2 size={16} onClick={() => excluirItem(f.id, 'F')} style={{ cursor: 'pointer', color: '#ef4444' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2>Gestão de Frota</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const novo = { id: Date.now(), placa: e.target.placa.value.toUpperCase(), modelo: e.target.modelo.value };
                            const lista = [...veiculosCadastrados, novo];
                            setVeiculosCadastrados(lista);
                            sincronizar(funcionarios, lista, historico);
                            e.target.reset();
                        }}>
                            <input name="placa" placeholder="Placa" required className="input" style={{ marginBottom: '10px' }} />
                            <input name="modelo" placeholder="Modelo" required className="input" style={{ marginBottom: '10px' }} />
                            <button className="btn-success">Adicionar à Frota</button>
                        </form>
                        <div className="lista-scroll" style={{ marginTop: '20px' }}>
                            {veiculosCadastrados.map(v => (
                                <div key={v.id} className="item-lista">
                                    <span>{v.placa} - {v.modelo}</span>
                                    <Trash2 size={16} onClick={() => excluirItem(v.id, 'V')} style={{ cursor: 'pointer', color: '#ef4444' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid-cards">
                        <div className="card">
                            <div className="tabs-mini">
                                <button onClick={() => setModoPedestre('interno')} className={modoPedestre === 'interno' ? 'active' : ''}>Interno</button>
                                <button onClick={() => setModoPedestre('visitante')} className={modoPedestre === 'visitante' ? 'active' : ''}>Visitante</button>
                            </div>
                            <div className="sentido-toggle">
                                <button onClick={() => setSentidoPedestre('ENTRADA')} className={sentidoPedestre === 'ENTRADA' ? 'btn-in' : 'off'}>ENTRADA</button>
                                <button onClick={() => setSentidoPedestre('SAÍDA')} className={sentidoPedestre === 'SAÍDA' ? 'btn-out' : 'off'}>SAÍDA</button>
                            </div>
                            {modoPedestre === 'interno' ? (
                                <div className="col-gap">
                                    <select className="input" value={funcionarioSelecionado} onChange={e => setFuncionarioSelecionado(e.target.value)}>
                                        <option value="">Selecionar Funcionário...</option>
                                        {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                    </select>
                                    <button className="btn-primary" onClick={() => funcionarioSelecionado && registrarAcesso(`PEDESTRE_${sentidoPedestre}`, `${sentidoPedestre}: ${funcionarioSelecionado}`)}>Confirmar</button>
                                </div>
                            ) : (
                                <div className="col-gap">
                                    <input placeholder="Nome" value={visNome} onChange={e => setVisNome(e.target.value)} />
                                    <input placeholder="RG/CPF" value={visRegistro} onChange={e => setVisRegistro(e.target.value)} />
                                    <button className="btn-success" onClick={() => visNome && registrarAcesso(`VISITANTE_${sentidoPedestre}`, `${sentidoPedestre} | ${visNome} | RG: ${visRegistro}`)}>Gravar {sentidoPedestre}</button>
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <div className="tabs-mini">
                                <button onClick={() => setModoVeiculo('interno')} className={modoVeiculo === 'interno' ? 'active' : ''}>Frota</button>
                                <button onClick={() => setModoVeiculo('visitante')} className={modoVeiculo === 'visitante' ? 'active' : ''}>Visitante</button>
                            </div>
                            <div className="sentido-toggle">
                                <button onClick={() => setSentidoVeiculo('ENTRADA')} className={sentidoVeiculo === 'ENTRADA' ? 'btn-in' : 'off'}>ENTRADA</button>
                                <button onClick={() => setSentidoVeiculo('SAÍDA')} className={sentidoVeiculo === 'SAÍDA' ? 'btn-out' : 'off'}>SAÍDA</button>
                            </div>
                            {modoVeiculo === 'interno' ? (
                                <div className="col-gap">
                                    <select className="input" value={veiculoSelecionado} onChange={e => setVeiculoSelecionado(e.target.value)}>
                                        <option value="">Selecionar Placa...</option>
                                        {veiculosCadastrados.map(v => <option key={v.id} value={`${v.placa} (${v.modelo})`}>{v.placa}</option>)}
                                    </select>
                                    <input placeholder="Motorista" value={condutorVeiculo} onChange={e => setCondutorVeiculo(e.target.value)} />
                                    <button className="btn-primary" onClick={() => veiculoSelecionado && registrarAcesso(`VEÍCULO_${sentidoVeiculo}`, `${sentidoVeiculo} | Frota: ${veiculoSelecionado} | Condutor: ${condutorVeiculo}`)}>Confirmar</button>
                                </div>
                            ) : (
                                <div className="col-gap">
                                    <input placeholder="Placa" value={veicPlacaVis} onChange={e => setVeicPlacaVis(e.target.value.toUpperCase())} />
                                    <input placeholder="Modelo/Cor" value={veicModeloVis} onChange={e => setVeicModeloVis(e.target.value)} />
                                    <input placeholder="Motorista" value={condutorVeiculo} onChange={e => setCondutorVeiculo(e.target.value)} />
                                    <button className="btn-success" onClick={() => veicPlacaVis && registrarAcesso(`VEÍCULO_EXT_${sentidoVeiculo}`, `${sentidoVeiculo} | Placa: ${veicPlacaVis} | Motorista: ${condutorVeiculo}`)}>Gravar {sentidoVeiculo}</button>
                                </div>
                            )}
                        </div>

                        <div className="card">
                            {!mostrarEncomenda ? (
                                <button className="btn-access" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={() => { setMostrarEncomenda(true); setModoEnc('LISTA'); }}>
                                    <Box size={24} /> <span>Encomendas / Retiradas</span>
                                </button>
                            ) : (
                                <div className="col-gap">
                                    <div className="tabs-mini">
                                        <button onClick={() => setModoEnc('NOVO')} className={modoEnc === 'NOVO' ? 'active' : ''}>Nova</button>
                                        <button onClick={() => setModoEnc('LISTA')} className={modoEnc === 'LISTA' ? 'active' : ''}>Pendentes</button>
                                    </div>
                                    {modoEnc === 'NOVO' ? (
                                        <>
                                            <input placeholder="Remetente" value={remetente} onChange={e => setRemetente(e.target.value)} />
                                            <select className="input" value={destinatarioEnc} onChange={e => setDestinatarioEnc(e.target.value)}>
                                                <option value="">Para quem...</option>
                                                {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                            </select>
                                            <button className="btn-success" onClick={() => { registrarAcesso('ENC_ENTRADA', `📦 CHEGADA - De: ${remetente} | Para: ${destinatarioEnc}`); setModoEnc('LISTA'); }}>Gravar</button>
                                        </>
                                    ) : (
                                        <div className="lista-scroll" style={{maxHeight: '120px'}}>
                                            {historico.filter(h => h.tipo === 'ENC_ENTRADA' && !historico.some(s => s.tipo === 'ENC_SAIDA' && s.detalhe.includes(`Ref ID: ${h.id}`))).map(p => (
                                                <div key={p.id} className="item-pendente" style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px', padding: '5px', background: '#f1f5f9'}}>
                                                    <span>{p.detalhe.split('|')[1]}</span>
                                                    <button onClick={() => registrarAcesso('ENC_SAIDA', `✅ RETIRADA - Ref ID: ${p.id} | Receptor: ${p.detalhe.split('|')[1]}`)} style={{background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer'}}>Baixa</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button className="btn-cancel" onClick={() => setMostrarEncomenda(false)}>Voltar</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3>📌 Histórico Centralizado</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Printer size={20} onClick={imprimirRelatorio} style={{ cursor: 'pointer', color: '#3b82f6' }} title="Imprimir Relatório" />
                                <Trash2 size={20} onClick={() => { if (window.confirm("Limpar histórico?")) { setHistorico([]); sincronizar(funcionarios, veiculosCadastrados, []) } }} style={{ cursor: 'pointer', color: '#ef4444' }} />
                            </div>
                        </div>
                        <div className="lista-scroll">
                            <table>
                                <thead>
                                    <tr><th>Data/Hora</th><th>Tipo</th><th>Descrição</th></tr>
                                </thead>
                                <tbody>
                                    {historico.map(h => (
                                        <tr key={h.id}>
                                            <td>{h.data}</td>
                                            <td><span className={`tag ${h.tipo}`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', color: '#fff' }}>{h.tipo}</span></td>
                                            <td>{h.detalhe}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;