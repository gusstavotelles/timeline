// import { ProdutoModel } from "/.produto.model";
import { ProdutoModel } from "./produto.model";

export class CompraModel {
  public id: number;
  public custoTotal: number;
  public data: Date;
  public hora: Date;
  public nomeLoja: Date;
  public produtos: ProdutoModel[];
  constructor() {}
}
