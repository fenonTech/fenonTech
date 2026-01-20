import React from "react";
import "./CategoryViewMobile.css";

interface CategoryData {
  nome: string;
  valorGasto: number;
  valorTotal: number;
}

interface CategoryViewMobileProps {
  categorias: CategoryData[];
}

const CategoryViewMobile: React.FC<CategoryViewMobileProps> = ({
  categorias,
}) => {
  // Calcular o total geral de todas as categorias
  const totalGeral = categorias.reduce((acc, cat) => acc + cat.valorGasto, 0);

  const calcularPorcentagem = (gasto: number): number => {
    if (totalGeral === 0) return 0;
    return (gasto / totalGeral) * 100;
  };

  const formatarValor = (valor: number): string => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="category-view-mobile">
      <h2 className="category-view-title">Visão por categoria</h2>
      <div className="category-list">
        {categorias.map((categoria, index) => {
          const porcentagem = calcularPorcentagem(categoria.valorGasto);

          return (
            <div key={index} className="category-item">
              <div className="category-header">
                <span className="category-name">{categoria.nome}</span>
                <span className="category-values">
                  {formatarValor(categoria.valorGasto)} (
                  {porcentagem.toFixed(1)}%)
                </span>
              </div>
              <div className="category-progress-bar">
                <div
                  className="category-progress-fill"
                  style={{ width: `${porcentagem}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {categorias.length > 0 && (
        <div className="category-total-footer">
          Total geral: {formatarValor(totalGeral)}
        </div>
      )}
    </div>
  );
};

export default CategoryViewMobile;
