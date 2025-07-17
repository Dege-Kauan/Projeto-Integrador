package br.com.comprasplus.controller;

import br.com.comprasplus.model.Pagamento;
import br.com.comprasplus.model.ItemLista;
import br.com.comprasplus.repository.PagamentoRepository;
import br.com.comprasplus.repository.ItemListaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private ItemListaRepository itemListaRepository;

    @GetMapping
    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pagamento> buscarPorId(@PathVariable Long id) {
        Optional<Pagamento> pagamento = pagamentoRepository.findById(id);
        return pagamento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pagamento> criar(@RequestBody Pagamento pagamento) {
        if (pagamento.getItem() == null || pagamento.getItem().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<ItemLista> item = itemListaRepository.findById(pagamento.getItem().getId());
        if (item.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        pagamento.setItem(item.get());
        return ResponseEntity.ok(pagamentoRepository.save(pagamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pagamento> atualizar(@PathVariable Long id, @RequestBody Pagamento dados) {
        return pagamentoRepository.findById(id).map(pagamento -> {
            pagamento.setValor(dados.getValor());
            pagamento.setDataPagamento(dados.getDataPagamento());
            pagamento.setTipo(dados.getTipo());
            pagamento.setQuitado(dados.isQuitado());
            return ResponseEntity.ok(pagamentoRepository.save(pagamento));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (pagamentoRepository.existsById(id)) {
            pagamentoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
