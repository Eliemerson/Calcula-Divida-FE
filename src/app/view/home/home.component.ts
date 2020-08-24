import { Component, OnInit } from '@angular/core';
import { ServiceHelpersService } from 'src/app/services/service-helper.service';
import { IPropostaCliente, IParcelas, IProvedorResponse, IClienteProposta } from 'src/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private service: ServiceHelpersService, private datePipe: DatePipe) { }


  acordoCliente: IPropostaCliente = {};
  numeroParcelas: number[];
  parcelaSelecionada: number;
  parcelas: IParcelas[] = [];
  propostaFinalizada = false;
  mockClienteProposta: IClienteProposta = { propostaId: 1, clienteId: 1 };


  ngOnInit(): void {
    this.service.get(`https://localhost:5001/api/Proposta/obter-proposta/${this.mockClienteProposta.propostaId}`).subscribe(response => {
      this.acordoCliente = response;
      this.numeroParcelas = Array(this.acordoCliente.qtdMaximaParcelas).fill(1).map((x, i) => i);
    });
  }

  transform(value: number): string {
    if (value >= 0) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }
    return null;
  }


  calcularParcelas(parcelaSelecionada): void {
    this.parcelaSelecionada = parcelaSelecionada;
    this.parcelas = [];
    for (let i = 1; i <= parcelaSelecionada; i++) {
      const diasVencimento = 30 * i;
      const data = new Date(this.acordoCliente.dataAtual);
      const dataVencimento = new Date(data.setDate(data.getDate() + diasVencimento + 1));
      const maskData = this.datePipe.transform(dataVencimento, 'dd-MM-yyyy');
      const parcela: IParcelas =
      {
        numeroParcela: i,
        valorParceDisplay: this.transform(this.acordoCliente.valorFinal / +parcelaSelecionada),
        valorParcela: this.acordoCliente.valorFinal / +parcelaSelecionada,
        vencimentoParcela: maskData
      };
      this.parcelas.push(parcela);
    }
  }

  efetuarAcordo(): void {
    if (this.parcelas.length > 0) {
      const vencimentoParcela = this.parcelas.map(x => x.vencimentoParcela).join('/');
      this.acordoCliente.VencimentoParcelas = vencimentoParcela;
      this.acordoCliente.valorParcela = this.parcelas[0].valorParcela;
      this.acordoCliente.parcelaSelecionada = +this.parcelaSelecionada;
      this.acordoCliente.propostaId = this.mockClienteProposta.propostaId;
      this.service.post<IProvedorResponse<IPropostaCliente>>('https://localhost:5001/api/acordo/salvar-proposta', this.acordoCliente)
        .subscribe(response => {
          this.propostaFinalizada = response.eSucesso;
        });
    }
  }

}
