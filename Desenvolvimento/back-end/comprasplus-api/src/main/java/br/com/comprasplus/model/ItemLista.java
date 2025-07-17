package br.com.comprasplus.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "itens_lista")
public class ItemLista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private Integer quantidade;

    private Double pesoKg;

    @ManyToOne
    @JoinColumn(name = "lista_id", nullable = false)
    private ListaCompras lista;

    @OneToOne(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private Pagamento pagamento;
}