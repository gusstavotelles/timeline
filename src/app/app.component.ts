import { Component } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ProdutoModel } from "./models/produto.model";
import { CompraModel } from "./models/compra.model";
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  alternate: boolean = false;
  toggle: boolean = true;
  color: boolean = true;
  size: number = 20;
  expandEnabled: boolean = true;
  side = "right";
  entries: any;
  compras: CompraModel[] = [];
  constructor(private http: Http) {}

  ngOnInit() {
    this.consultaApi();
  }

  //  consultaApi(): Observable<TipoGrupoObraEntity[]> {
  consultaApi() {
    const url = "https://storage.googleapis.com/dito-questions/events.json";
    this.http.get(url).subscribe((res: Response) => {
      this.entries = res.json().events;
      this.mapeiaCompras();
      this.mapeiaProdutos();
      this.compras.reverse(); 
    });
  }

  mapeiaCompras() {
    for (let i = 0; i < this.entries.length; i++) {
      const obj = this.entries[i];
      if (obj.event == "comprou") {
        const compra = new CompraModel();
        compra.produtos = [];
        compra.custoTotal = obj.revenue;
        compra.data = new Date(obj.timestamp).toLocaleDateString();
        compra.hora = new Date(obj.timestamp).toLocaleTimeString();
        obj.custom_data.forEach(function(num) {
          if (num.key == "store_name") {
            compra.nomeLoja = num.value;
          }
          if (num.key == "transaction_id") {
            compra.id = num.value;
          }
        });

        this.compras.push(compra);
      }
    }
  }

  mapeiaProdutos() {
    for (let i = 0; i < this.entries.length; i++) {
      const obj = this.entries[i];
      if (obj.event == "comprou-produto") {
        const produto = new ProdutoModel();
        obj.custom_data.forEach(function(num) {
          if (num.key == "product_price") {
            produto.preco = num.value;
          } else if (num.key == "product_name") {
            produto.nome = num.value;
          } else if (num.key == "transaction_id") {
            produto.idCompra = num.value;
          }
        });
        this.compras.forEach(function(aux) {
          if (aux.id == produto.idCompra) {
            aux.produtos.push(produto);
          }
        });
      }
    }
  }

  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }
}
