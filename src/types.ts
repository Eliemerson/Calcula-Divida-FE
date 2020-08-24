export interface IPropostaCliente {
    contatoColaborador?: string;
    dataVencimento?: string;
    dataAtual?: string;
    VencimentoParcelas?: string;
    diasAtraso?: number;
    qtdMaximaParcelas?: number;
    valorFinal?: number;
    valorJuros?: number;
    valorOriginal?: number;
    valorParcela?: number;
    parcelaSelecionada?: number;
    propostaId?: number;
}

export interface IClienteProposta {
    propostaId: number;
    clienteId: number;
}


export interface IParcelas {
    numeroParcela?: number;
    valorParceDisplay?: string;
    valorParcela?: number;
    vencimentoParcela?: any;
}


export interface IProvedorResponse<T> {
    eSucesso: boolean;
    dado: T;
    menssagem: string;
}
