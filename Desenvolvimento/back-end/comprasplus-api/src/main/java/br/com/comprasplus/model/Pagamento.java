package br.com.comprasplus.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo; // débito, crédito, fiado

    private Integer parcelas; // apenas se for crédito

    private boolean quitado; // se está pago ou não (ex: fiado em aberto)

    private Double valor;

    private LocalDate dataPagamento;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private ItemLista item;
}