import React, { useState, useEffect } from 'react';
import { User, Car, Box, ClipboardList, UserPlus, Trash2, Printer, Package, UserCheck, UserPlus as UserPlusIcon } from 'lucide-react';
import './App.css';

function App() {
    const [aba, setAba] = useState('portaria');
    const [funcionarios, setFuncionarios] = useState([]);
    const [veiculosCadastrados, setVeiculosCadastrados] = useState([]);
    const [historico, setHistorico] = useState([]);

    const [modoPedestre, setModoPedestre] = useState('interno');
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
    const [visNome, setVisNome] = useState('');
    const [visRegistro, setVisRegistro] = useState('');
    const [visEmpresa, setVisEmpresa] = useState('');
    const [visServico, setVisServico] = useState('');
    const [visDepto, setVisDepto] = useState('');

    const [modoVeiculo, setModoVeiculo] = useState('interno');
    const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
    const [condutorVeiculo, setCondutorVeiculo] = useState('');
    const [veicModeloVis, setVeicModeloVis] = useState('');
    const [veicPlacaVis, setVeicPlacaVis] = useState('');

    const [mostrarEncomenda, setMostrarEncomenda] = useState(false);
    const [remetente, setRemetente] = useState('');
    const [tipoVolume, setTipoVolume] = useState('');
    const [destinatarioEnc, setDestinatarioEnc] = useState('');

    useEffect(() => {
        const localFunc = JSON.parse(localStorage.getItem('seg_funcionarios') || '[]');
        const localVeic = JSON.parse(localStorage.getItem('seg_veiculos') || '[]');
        const localHist = JSON.parse(localStorage.getItem('seg_historico') || '[]');
        setFuncionarios(localFunc);
        setVeiculosCadastrados(localVeic);
        setHistorico(localHist);
    }, []);

    const registrarAcesso = (tipo, detalhe) => {
        const registro = {
            id: Date.now(),
            tipo, // Aqui deve ser exatamente PEDESTRE, VISITANTE, VEÍCULO, VEÍCULO_EXT ou ENCOMENDA
            detalhe,
            data: new Date().toLocaleString(),
        };
        const novoHist = [registro, ...historico];
        setHistorico(novoHist);
        localStorage.setItem('seg_historico', JSON.stringify(novoHist));

        setFuncionarioSelecionado('');
        setVisNome(''); setVisRegistro(''); setVisEmpresa(''); setVisServico(''); setVisDepto('');
        setVeiculoSelecionado(''); setCondutorVeiculo(''); setVeicModeloVis(''); setVeicPlacaVis('');
        setRemetente(''); setTipoVolume(''); setDestinatarioEnc('');
        setMostrarEncomenda(false);
    };

    const salvarFuncionario = (e) => {
        e.preventDefault();
        const novo = { id: Date.now(), nome: e.target.nome.value, cargo: e.target.cargo.value };
        const lista = [...funcionarios, novo];
        setFuncionarios(lista);
        localStorage.setItem('seg_funcionarios', JSON.stringify(lista));
        e.target.reset();
        alert('✅ Pessoal Cadastrado!');
    };

    const salvarVeiculo = (e) => {
        e.preventDefault();
        const novo = { id: Date.now(), placa: e.target.placa.value.toUpperCase(), modelo: e.target.modelo.value };
        const lista = [...veiculosCadastrados, novo];
        setVeiculosCadastrados(lista);
        localStorage.setItem('seg_veiculos', JSON.stringify(lista));
        e.target.reset();
        alert('✅ Veículo Cadastrado!');
    };

    const excluirFuncionario = (id) => {
        if (window.confirm("Deseja remover este funcionário do cadastro?")) {
            const novaLista = funcionarios.filter(f => f.id !== id);
            setFuncionarios(novaLista);
            localStorage.setItem('seg_funcionarios', JSON.stringify(novaLista));
        }
    };

    const excluirVeiculo = (id) => {
        if (window.confirm("Deseja remover este veículo do cadastro?")) {
            const novaLista = veiculosCadastrados.filter(v => v.id !== id);
            setVeiculosCadastrados(novaLista);
            localStorage.setItem('seg_veiculos', JSON.stringify(novaLista));
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>POLO SEGURANÇA</h1>
                <p>🛡️ Controle de Acesso Profissional 🛡️</p>
            </div>

            <div className="nav-buttons">
                <button className="btn btn-primary" onClick={() => setAba('portaria')}><ClipboardList size={18} /> Portaria</button>
                <button className="btn btn-primary" onClick={() => setAba('cadastro')}><UserPlus size={18} /> Cadastros Base</button>
            </div>

            {aba === 'cadastro' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="card">
                        <h2>Cadastrar Pessoal</h2>
                        <form onSubmit={salvarFuncionario}>
                            <input name="nome" placeholder="Nome Completo" required />
                            <input name="cargo" placeholder="Cargo/Setor" required />
                            <button type="submit" className="btn btn-success">Salvar</button>
                        </form>

                        <div style={{ marginTop: '20px' }}>
                            <h4>Funcionários Cadastrados:</h4>
                            {funcionarios.map(f => (
                                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                    <span>{f.nome} <small>({f.cargo})</small></span>
                                    <button onClick={() => excluirFuncionario(f.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2>Cadastrar Veículo (Frota)</h2>
                        <form onSubmit={salvarVeiculo}>
                            <input name="placa" placeholder="Placa" required />
                            <input name="modelo" placeholder="Modelo/Cor" required />
                            <button type="submit" className="btn btn-success" style={{ background: '#1e3a8a' }}>Salvar</button>
                        </form>

                        <div style={{ marginTop: '20px' }}>
                            <h4>Frota Cadastrada:</h4>
                            {veiculosCadastrados.map(v => (
                                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                                    <span>{v.placa} - {v.modelo}</span>
                                    <button onClick={() => excluirVeiculo(v.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid-cards">
                        {/* Bloco Pedestre / Visitante */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                                <button onClick={() => setModoPedestre('interno')} className={modoPedestre === 'interno' ? 'btn-tab active' : 'btn-tab'}>Interno</button>
                                <button onClick={() => setModoPedestre('visitante')} className={modoPedestre === 'visitante' ? 'btn-tab active' : 'btn-tab'}>Visitante</button>
                            </div>

                            {modoPedestre === 'interno' ? (
                                <>
                                    <select className="input" value={funcionarioSelecionado} onChange={(e) => setFuncionarioSelecionado(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
                                        <option value="">Buscar Funcionário...</option>
                                        {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                    </select>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => funcionarioSelecionado && registrarAcesso('PEDESTRE', `Interno: ${funcionarioSelecionado}`)}>Confirmar</button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <input placeholder="Nome" value={visNome} onChange={e => setVisNome(e.target.value)} />
                                    <input placeholder="RG/CPF" value={visRegistro} onChange={e => setVisRegistro(e.target.value)} />
                                    <input placeholder="Empresa" value={visEmpresa} onChange={e => setVisEmpresa(e.target.value)} />
                                    <input placeholder="Serviço" value={visServico} onChange={e => setVisServico(e.target.value)} />
                                    <input placeholder="Depto Destino" value={visDepto} onChange={e => setVisDepto(e.target.value)} />
                                    <button className="btn btn-success" onClick={() => visNome && registrarAcesso('VISITANTE', `${visNome} | RG: ${visRegistro} | Empresa: ${visEmpresa} | Serviço: ${visServico} | Destino: ${visDepto}`)}>Registrar Visita</button>
                                </div>
                            )}
                        </div>

                        {/* Bloco Veículo */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                                <button onClick={() => setModoVeiculo('interno')} className={modoVeiculo === 'interno' ? 'btn-tab active' : 'btn-tab'}>Frota</button>
                                <button onClick={() => setModoVeiculo('visitante')} className={modoVeiculo === 'visitante' ? 'btn-tab active' : 'btn-tab'}>Visitante</button>
                            </div>

                            {modoVeiculo === 'interno' ? (
                                <>
                                    <select className="input" value={veiculoSelecionado} onChange={(e) => setVeiculoSelecionado(e.target.value)} style={{ width: '100%', marginBottom: '5px' }}>
                                        <option value="">Placa...</option>
                                        {veiculosCadastrados.map(v => <option key={v.id} value={`${v.placa} (${v.modelo})`}>{v.placa}</option>)}
                                    </select>
                                    <input placeholder="Condutor" value={condutorVeiculo} onChange={(e) => setCondutorVeiculo(e.target.value)} style={{ marginBottom: '10px' }} />
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => (veiculoSelecionado && condutorVeiculo) && registrarAcesso('VEÍCULO', `Frota: ${veiculoSelecionado} | Condutor: ${condutorVeiculo}`)}>Confirmar</button>
                                </>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <input placeholder="Placa do Veículo" value={veicPlacaVis} onChange={e => setVeicPlacaVis(e.target.value.toUpperCase())} />
                                    <input placeholder="Modelo/Cor" value={veicModeloVis} onChange={e => setVeicModeloVis(e.target.value)} />
                                    <input placeholder="Nome do Motorista" value={condutorVeiculo} onChange={e => setCondutorVeiculo(e.target.value)} />
                                    <button className="btn btn-success" onClick={() => (veicPlacaVis && condutorVeiculo) && registrarAcesso('VEÍCULO_EXT', `Placa: ${veicPlacaVis} | Modelo: ${veicModeloVis} | Motorista: ${condutorVeiculo}`)}>Registrar Entrada</button>
                                </div>
                            )}
                        </div>

                        {/* Bloco Encomenda */}
                        <div className="card">
                            {!mostrarEncomenda ? (
                                <button className="btn btn-access" style={{ width: '100%', height: '100%' }} onClick={() => setMostrarEncomenda(true)}>
                                    <Box size={24} color="#1e3a8a" />
                                    <span>Encomendas</span>
                                </button>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <select className="input" value={remetente} onChange={(e) => setRemetente(e.target.value)}>
                                        <option value="">Logística...</option>
                                        <option value="Correios">Correios</option>
                                        <option value="Mercado Livre">Mercado Livre</option>
                                        <option value="Amazon">Amazon</option>
                                    </select>
                                    <select className="input" value={destinatarioEnc} onChange={(e) => setDestinatarioEnc(e.target.value)}>
                                        <option value="">Para...</option>
                                        {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                    </select>
                                    <button className="btn btn-success" onClick={() => (remetente && destinatarioEnc) && registrarAcesso('ENCOMENDA', `Remetente: ${remetente} | Destinatário: ${destinatarioEnc}`)}>Gravar</button>
                                    <button onClick={() => setMostrarEncomenda(false)} style={{ border: 'none', background: 'none', fontSize: '11px', cursor: 'pointer' }}>Voltar</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3>📌 Registro de Atividades</h3>
                            <div>
                                <button onClick={() => window.print()} className="btn btn-primary" style={{ background: '#64748b', marginRight: '5px' }}><Printer size={16} /></button>
                                <button onClick={() => { if (window.confirm("Limpar Histórico?")) { setHistorico([]); localStorage.removeItem('seg_historico') } }} className="btn" style={{ background: '#ef4444', color: 'white' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Horário</th>
                                    <th>Tipo</th>
                                    <th>Detalhes do Evento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.map(h => (
                                    <tr key={h.id}>
                                        <td>{h.data}</td>
                                        <td><span className={`tag ${h.tipo}`}>{h.tipo}</span></td>
                                        <td style={{ fontSize: '13px' }}>{h.detalhe}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;