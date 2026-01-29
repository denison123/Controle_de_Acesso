import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, UserPlus, Trash2, Printer, Key, Search, Car, User, ShieldCheck } from 'lucide-react';

// Configurações de API
const SERVER_URL = 'http://10.10.64.101:3001/api';
const CREDENTIALS = btoa('t.i:123456*p');
const AUTH_HEADER = { 'Authorization': `Basic ${CREDENTIALS}` };

function App() {
    const [aba, setAba] = useState('portaria');
    const [funcionarios, setFuncionarios] = useState([]);
    const [veiculosCadastrados, setVeiculosCadastrados] = useState([]);
    const [chavesCadastradas, setChavesCadastradas] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [termoBusca, setTermoBusca] = useState(''); // Estado para a pesquisa

    // Estados de Interface e Formulários (Mantidos da versão anterior)
    const [modoPedestre, setModoPedestre] = useState('interno');
    const [modoVeiculo, setModoVeiculo] = useState('interno');
    const [sentidoPedestre, setSentidoPedestre] = useState('ENTRADA');
    const [sentidoVeiculo, setSentidoVeiculo] = useState('ENTRADA');
    const [sentidoChave, setSentidoChave] = useState('RETIRADA');
    const [funcSel, setFuncSel] = useState('');
    const [veicSel, setVeicSel] = useState('');
    const [chaveSel, setChaveSel] = useState('');
    const [respChave, setRespChave] = useState('');
    const [visNome, setVisNome] = useState('');
    const [visDoc, setVisDoc] = useState('');
    const [veicPlacaVis, setVeicPlacaVis] = useState('');
    const [veicTipoVis, setVeicTipoVis] = useState('');
    const [veicMotVis, setVeicMotVis] = useState('');

    const carregarDados = useCallback(() => {
        fetch(`${SERVER_URL}/dados`, { headers: AUTH_HEADER })
            .then(res => res.json())
            .then(data => {
                setFuncionarios(data.funcionarios || []);
                setVeiculosCadastrados(data.veiculos || []);
                setChavesCadastradas(data.chaves || []);
                setHistorico(data.historico || []);
            }).catch(err => console.error("Erro ao carregar dados:", err));
    }, []);

    useEffect(() => { carregarDados(); }, [carregarDados]);

    const sincronizar = (f, v, h, c) => {
        fetch(`${SERVER_URL}/salvar`, {
            method: 'POST',
            headers: { ...AUTH_HEADER, 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcionarios: f, veiculos: v, historico: h, chaves: c, encomendas: [] })
        });
    };

    const registrarAcesso = (tipo, detalhe) => {
        if (!detalhe || detalhe.trim() === "" || detalhe.includes('undefined')) {
            alert("Preencha todos os campos antes de confirmar.");
            return;
        }
        const registro = { id: Date.now(), tipo, detalhe, data: new Date().toLocaleString() };
        const novoHist = [registro, ...historico];
        setHistorico(novoHist);
        sincronizar(funcionarios, veiculosCadastrados, novoHist, chavesCadastradas);
        limparCampos();
    };

    const limparCampos = () => {
        setVisNome(''); setVisDoc(''); setVeicPlacaVis(''); setVeicTipoVis(''); setVeicMotVis('');
        setFuncSel(''); setVeicSel(''); setChaveSel(''); setRespChave('');
    };

    const excluirItem = (id, tipo) => {
        if (!window.confirm("Excluir registro?")) return;
        let nf = [...funcionarios], nv = [...veiculosCadastrados], nc = [...chavesCadastradas];
        if (tipo === 'F') nf = funcionarios.filter(f => f.id !== id);
        if (tipo === 'V') nv = veiculosCadastrados.filter(v => v.id !== id);
        if (tipo === 'C') nc = chavesCadastradas.filter(c => c.id !== id);
        setFuncionarios(nf); setVeiculosCadastrados(nv); setChavesCadastradas(nc);
        sincronizar(nf, nv, historico, nc);
    };

    // Lógica de Filtro do Histórico
    const historicoFiltrado = historico.filter(item =>
        item.detalhe.toLowerCase().includes(termoBusca.toLowerCase()) ||
        item.tipo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        item.data.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <div className="app-wrapper">
            
            <style>{`
                :root { --primary: #1e3a8a; --accent: #3b82f6; --bg: #f0f2f5; --card: #ffffff; --text: #1e293b; --in: #10b981; --out: #ef4444; }
                body { margin: 0; background: var(--bg); font-family: 'Segoe UI', sans-serif; color: var(--text); }
                .app-wrapper { max-width: 1300px; margin: 0 auto; padding: 20px; }
                
                .main-header { display: flex; justify-content: space-between; align-items: center; background: var(--primary); padding: 20px 30px; border-radius: 12px; margin-bottom: 25px; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .nav-buttons { display: flex; gap: 12px; }
                .nav-buttons button { background: rgba(255,255,255,0.1); border: none; color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 600; }
                .nav-buttons button.active { background: var(--accent); }

                .grid-main { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px; }
                .card-ui { background: var(--card); border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 15px; }
                .card-ui h3 { font-size: 1rem; text-transform: uppercase; color: var(--primary); margin: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; display: flex; align-items: center; gap: 10px; }

                .btn-group { display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; gap: 4px; }
                .btn-group button { flex: 1; border: none; padding: 10px; border-radius: 7px; cursor: pointer; font-size: 0.85rem; font-weight: 700; background: transparent; color: #64748b; }
                .btn-group button.active { background: white; color: var(--primary); box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
                .btn-group button.in.active { background: var(--in); color: white; }
                .btn-group button.out.active { background: var(--out); color: white; }

                input, select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; outline: none; box-sizing: border-box; }
                .btn-confirm { background: var(--primary); color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1rem; }

                .history-section { background: white; border-radius: 12px; padding: 25px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                
                /* Barra de Pesquisa Estilizada */
                .search-container { display: flex; align-items: center; background: #f1f5f9; padding: 0 15px; border-radius: 10px; border: 1px solid #e2e8f0; width: 100%; max-width: 400px; }
                .search-container input { border: none; background: transparent; padding: 12px; width: 100%; }
                .search-container input:focus { box-shadow: none; }

                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { text-align: left; padding: 15px; background: #f8fafc; border-bottom: 2px solid #edf2f7; font-size: 0.85rem; color: #64748b; text-transform: uppercase; }
                td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
                .tag-tipo { padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; background: #e2e8f0; color: #475569; }

                .scroll-list { margin-top: 15px; max-height: 280px; overflow-y: auto; }
                .list-row { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; align-items: center; }
                .delete-btn { color: #ef4444; cursor: pointer; opacity: 0.7; }

                @media print { .main-header, .grid-main, .nav-buttons, .search-container, .delete-btn { display: none !important; } }
            `}</style>

            <header className="main-header">
                <div className="brand"><h1>CONTROLE DE ACESSO - <span>PORTARIA POLO</span></h1></div>
                <nav className="nav-buttons">
                    <button className={aba === 'portaria' ? 'active' : ''} onClick={() => setAba('portaria')}><ClipboardList size={20} /> Portaria</button>
                    <button className={aba === 'cadastro' ? 'active' : ''} onClick={() => setAba('cadastro')}><UserPlus size={20} /> Cadastros</button>
                </nav>
            </header>

            <main>
                {aba === 'portaria' ? (
                    <>
                        {/* Seção de Cards Operacionais (Mesma da versão anterior) */}
                        <div className="grid-main">
                            <div className="card-ui">
                                <h3><User size={18} /> Pedestres</h3>
                                <div className="btn-group">
                                    <button className={modoPedestre === 'interno' ? 'active' : ''} onClick={() => setModoPedestre('interno')}>Interno</button>
                                    <button className={modoPedestre === 'visitante' ? 'active' : ''} onClick={() => setModoPedestre('visitante')}>Visitante</button>
                                </div>
                                <div className="btn-group">
                                    <button className={sentidoPedestre === 'ENTRADA' ? 'active in' : ''} onClick={() => setSentidoPedestre('ENTRADA')}>ENTRADA</button>
                                    <button className={sentidoPedestre === 'SAÍDA' ? 'active out' : ''} onClick={() => setSentidoPedestre('SAÍDA')}>SAÍDA</button>
                                </div>
                                {modoPedestre === 'interno' ? (
                                    <select value={funcSel} onChange={e => setFuncSel(e.target.value)}>
                                        <option value="">Buscar Funcionário...</option>
                                        {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome} ({f.depto})</option>)}
                                    </select>
                                ) : (
                                    <>
                                        <input placeholder="Nome do Visitante" value={visNome} onChange={e => setVisNome(e.target.value.toUpperCase())} />
                                        <input placeholder="Documento (RG ou CPF)" value={visDoc} onChange={e => setVisDoc(e.target.value)} />
                                    </>
                                )}
                                <button className="btn-confirm" onClick={() => registrarAcesso('PEDESTRE', `${sentidoPedestre}: ${modoPedestre === 'interno' ? funcSel : visNome + " (DOC: " + visDoc + ")"}`)}>Confirmar Registro</button>
                            </div>

                            <div className="card-ui">
                                <h3><Car size={18} /> Veículos</h3>
                                <div className="btn-group">
                                    <button className={modoVeiculo === 'interno' ? 'active' : ''} onClick={() => setModoVeiculo('interno')}>Frota</button>
                                    <button className={modoVeiculo === 'visitante' ? 'active' : ''} onClick={() => setModoVeiculo('visitante')}>Externo/Visita</button>
                                </div>
                                <div className="btn-group">
                                    <button className={sentidoVeiculo === 'ENTRADA' ? 'active in' : ''} onClick={() => setSentidoVeiculo('ENTRADA')}>ENTRADA</button>
                                    <button className={sentidoVeiculo === 'SAÍDA' ? 'active out' : ''} onClick={() => setSentidoVeiculo('SAÍDA')}>SAÍDA</button>
                                </div>
                                {modoVeiculo === 'interno' ? (
                                    <>
                                        <select value={veicSel} onChange={e => setVeicSel(e.target.value)}>
                                            <option value="">Selecionar Placa (Frota)...</option>
                                            {veiculosCadastrados.map(v => <option key={v.id} value={v.placa}>{v.placa} - {v.modelo}</option>)}
                                        </select>
                                        <select value={funcSel} onChange={e => setFuncSel(e.target.value)}>
                                            <option value="">Motorista (Funcionário)...</option>
                                            {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <input placeholder="Placa do Veículo" value={veicPlacaVis} onChange={e => setVeicPlacaVis(e.target.value.toUpperCase())} />
                                        <input placeholder="Tipo/Modelo (Ex: Caminhão Baú)" value={veicTipoVis} onChange={e => setVeicTipoVis(e.target.value.toUpperCase())} />
                                        <input placeholder="Nome do Motorista" value={veicMotVis} onChange={e => setVeicMotVis(e.target.value.toUpperCase())} />
                                    </>
                                )}
                                <button className="btn-confirm" onClick={() => {
                                    const desc = modoVeiculo === 'interno' ? `FROTA: ${veicSel} | MOT: ${funcSel}` : `EXTERNO: ${veicPlacaVis} (${veicTipoVis}) | MOT: ${veicMotVis}`;
                                    registrarAcesso('VEICULO', `${sentidoVeiculo}: ${desc}`);
                                }}>Confirmar Registro</button>
                            </div>

                            <div className="card-ui">
                                <h3><Key size={18} /> Claviculário</h3>
                                <div className="btn-group">
                                    <button className={sentidoChave === 'RETIRADA' ? 'active out' : ''} onClick={() => setSentidoChave('RETIRADA')}>RETIRADA</button>
                                    <button className={sentidoChave === 'DEVOLUÇÃO' ? 'active in' : ''} onClick={() => setSentidoChave('DEVOLUÇÃO')}>DEVOLUÇÃO</button>
                                </div>
                                <select value={chaveSel} onChange={e => setChaveSel(e.target.value)}>
                                    <option value="">Selecionar Chave...</option>
                                    {chavesCadastradas.map(c => <option key={c.id} value={c.numero}>{c.numero} - {c.sala}</option>)}
                                </select>
                                <select value={respChave} onChange={e => setRespChave(e.target.value)}>
                                    <option value="">Responsável...</option>
                                    {funcionarios.map(f => <option key={f.id} value={f.nome}>{f.nome}</option>)}
                                </select>
                                <button className="btn-confirm" onClick={() => registrarAcesso('CHAVE', `${sentidoChave}: CHAVE ${chaveSel} | RESP: ${respChave}`)}>Confirmar Registro</button>
                            </div>
                        </div>

                        {/* SEÇÃO DE HISTÓRICO COM BUSCA */}
                        <div className="history-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                <h3 style={{ margin: 0, color: '#1e3a8a' }}><ShieldCheck size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Histórico Geral de Acessos</h3>

                                <div className="search-container">
                                    <Search size={18} color="#64748b" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar por nome, placa, tipo ou data..."
                                        value={termoBusca}
                                        onChange={(e) => setTermoBusca(e.target.value)}
                                    />
                                </div>

                                <Printer size={22} className="delete-btn" style={{ color: '#64748b' }} onClick={() => window.print()} title="Imprimir Relatório" />
                            </div>

                            <table>
                                <thead><tr><th>Data/Hora</th><th>Tipo</th><th>Descrição Completa dos Detalhes</th></tr></thead>
                                <tbody>
                                    {historicoFiltrado.length > 0 ? (
                                        historicoFiltrado.map(h => (
                                            <tr key={h.id}>
                                                <td style={{ width: '180px', fontWeight: '600' }}>{h.data}</td>
                                                <td style={{ width: '100px' }}><span className="tag-tipo">{h.tipo}</span></td>
                                                <td>{h.detalhe}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Nenhum registro encontrado para esta busca.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    /* Tela de Cadastros (Mantida da versão anterior) */
                    <div className="grid-main">
                        <div className="card-ui">
                            <h3>👤 Cadastrar Funcionário</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const n = [...funcionarios, { id: Date.now(), nome: e.target.nome.value.toUpperCase(), depto: e.target.depto.value.toUpperCase() }];
                                setFuncionarios(n); sincronizar(n, veiculosCadastrados, historico, chavesCadastradas);
                                e.target.reset();
                            }}>
                                <input name="nome" placeholder="Nome Completo" required />
                                <input name="depto" placeholder="Departamento ou Função" required style={{ marginTop: '10px' }} />
                                <button className="btn-confirm" style={{ background: '#10b981' }}>Salvar no Sistema</button>
                            </form>
                            <div className="scroll-list">
                                {funcionarios.map(f => (
                                    <div key={f.id} className="list-row">
                                        <span><strong>{f.nome}</strong> <br /><small style={{ color: '#64748b' }}>{f.depto}</small></span>
                                        <Trash2 size={16} className="delete-btn" onClick={() => excluirItem(f.id, 'F')} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-ui">
                            <h3>🚗 Veículos da Frota</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const n = [...veiculosCadastrados, { id: Date.now(), placa: e.target.placa.value.toUpperCase(), modelo: e.target.modelo.value.toUpperCase() }];
                                setVeiculosCadastrados(n); sincronizar(funcionarios, n, historico, chavesCadastradas);
                                e.target.reset();
                            }}>
                                <input name="placa" placeholder="Placa do Veículo" required />
                                <input name="modelo" placeholder="Modelo/Cor (Ex: GOL BRANCO)" required style={{ marginTop: '10px' }} />
                                <button className="btn-confirm" style={{ background: '#10b981' }}>Salvar Veículo</button>
                            </form>
                            <div className="scroll-list">
                                {veiculosCadastrados.map(v => (
                                    <div key={v.id} className="list-row">
                                        <span><strong>{v.placa}</strong> - {v.modelo}</span>
                                        <Trash2 size={16} className="delete-btn" onClick={() => excluirItem(v.id, 'V')} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-ui">
                            <h3>🔑 Claviculário (Salas)</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const n = [...chavesCadastradas, { id: Date.now(), numero: e.target.numero.value, sala: e.target.sala.value.toUpperCase() }];
                                setChavesCadastradas(n); sincronizar(funcionarios, veiculosCadastrados, historico, n);
                                e.target.reset();
                            }}>
                                <input name="numero" placeholder="Nº da Chave (ex: 01)" required />
                                <input name="sala" placeholder="Nome da Sala/Local" required style={{ marginTop: '10px' }} />
                                <button className="btn-confirm" style={{ background: '#10b981' }}>Salvar Chave</button>
                            </form>
                            <div className="scroll-list">
                                {chavesCadastradas.map(c => (
                                    <div key={c.id} className="list-row">
                                        <span><strong>Chave {c.numero}</strong> - {c.sala}</span>
                                        <Trash2 size={16} className="delete-btn" onClick={() => excluirItem(c.id, 'C')} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;